import {useCallback, useState, useRef} from 'react';
import axios, {AxiosInstance} from 'axios';
import {AppState} from 'redux/store';
import {useSelector} from 'react-redux';
import Web3 from 'web3';
import {Collection} from 'redux/_wizard/reducers';
import {useWeb3} from 'hooks/useWeb3';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';
import {BigNumber, ethers} from 'ethers';
import {findTokensInfoByAddress} from 'utils';

function isIpfsUrl(url: string) {
  return url.startsWith('ipfs://');
}

interface WizardItemAttribute {}

export interface WizardItem {
  name: string;
  description: string;
  image: string;
  external_link: string;
  attributes: WizardItemAttribute[];
}

export interface WizardCollection {
  name: string;
  description: string;
  image: string;
  external_link: string;
  fee_recipient: string;
  seller_fee_basis_points: number;
}

export function useWizardApi() {
  const axiosRef = useRef<AxiosInstance>(
    axios.create({baseURL: process.env.REACT_APP_WIZARD_API_ENDPOINT}),
  );

  const uploadImage = useCallback(
    (file: File) => {
      let form = new FormData();

      form.append('file', file);

      return axiosRef.current.post('/nft/image/upload', form);
    },
    [axiosRef],
  );

  const sendItemsMetadata = useCallback(
    (items: WizardItem[]) => {
      return axiosRef.current.post('/nft/metadata', {
        metadata_type: 'items',
        data: items,
      });
    },
    [axiosRef],
  );

  const sendCollectionMetadata = useCallback(
    (collection: WizardCollection) => {
      return axiosRef.current.post('/nft/metadata', {
        metadata_type: 'collection',
        data: collection,
      });
    },
    [axiosRef],
  );

  return {sendItemsMetadata, sendCollectionMetadata, uploadImage};
}

export function useCollectionList() {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);

  const {collections} = useSelector<AppState, AppState['wizard']>(
    ({wizard}) => wizard,
  );

  return {data: collections, error, loading};
}

export function useCollectionDetails() {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);
  let [data, setData] = useState<Collection | null>(null);

  const {collections} = useSelector<AppState, AppState['wizard']>(
    ({wizard}) => wizard,
  );

  const get = useCallback(
    (address: string) => {
      let collectionIndex = collections.findIndex(
        (collection) => collection.address == address,
      );

      setData(collections[collectionIndex]);
    },
    [collections],
  );

  return {data, loading, error, get};
}

export function useCollectionMetadata() {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);
  let [data, setData] = useState<any | null>(null);
  let {getProvider} = useWeb3();

  const get = useCallback(
    async (address: string) => {
      setLoading(true);

      let ethersProvider = new ethers.providers.Web3Provider(getProvider());

      var contract = new ethers.Contract(
        address,
        ERC721Abi,
        ethersProvider.getSigner(),
      );

      let contractURI: string = await contract.contractURI();

      if (isIpfsUrl(contractURI)) {
        let cleanImageHash = new URL(contractURI).pathname.replace('//', '');
        contractURI = `https://ipfs.io/ipfs/${cleanImageHash}`;
      }

      let metadata: {name: string; description: string; image: string} =
        await axios.get(contractURI).then((response) => response.data);

      let contractImage = metadata.image;

      if (isIpfsUrl(contractImage)) {
        let cleanImageHash = new URL(contractImage).pathname.replace('//', '');
        contractImage = `https://ipfs.io/ipfs/${cleanImageHash}`;
      }

      setData({
        image: contractImage,
        name: metadata.name,
        description: metadata.description,
      });

      setLoading(false);
    },
    [getProvider],
  );

  return {data, loading, error, get};
}

export function useCollectionItems() {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);
  let [data, setData] = useState<any | null>(null);
  let {getProvider} = useWeb3();

  const get = useCallback(
    async (address: string) => {
      setLoading(true);

      let ethersProvider = new ethers.providers.Web3Provider(getProvider());

      var contract = new ethers.Contract(
        address,
        ERC721Abi,
        ethersProvider.getSigner(),
      );

      let eventFilter = await contract.filters.Transfer();

      let events = await contract.queryFilter(eventFilter);

      let tokenIds = new Set<string>();

      for (let event of events) {
        if (event.args) {
          tokenIds.add((event.args[2] as BigNumber).toNumber().toString());
        }
      }

      let tokens: {
        tokenId: string;
        name: string;
        description: string;
        imageUrl: string;
      }[] = [];

      for (let tokenId of tokenIds) {
        let tokenURI: string = await contract.tokenURI(tokenId);

        let url = tokenURI;

        if (isIpfsUrl(tokenURI)) {
          let cleanHash = new URL(tokenURI).pathname.replace('//', '');
          url = `https://ipfs.io/ipfs/${cleanHash}`;
        }

        let metadata: {name: string; description: string; image: string} =
          await axios.get(url).then((response) => response.data);

        let imageUrl = metadata.image;

        if (isIpfsUrl(imageUrl)) {
          let cleanImageHash = new URL(imageUrl).pathname.replace('//', '');
          imageUrl = `https://ipfs.io/ipfs/${cleanImageHash}`;
        }

        tokens.push({
          tokenId,
          imageUrl,
          name: metadata.name,
          description: metadata.description,
        });
      }

      setData(tokens);
      setLoading(false);
    },
    [getProvider],
  );

  return {data, error, loading, get};
}

export function useTokensList() {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);

  const list = useCallback(() => {}, []);

  return {list, data: [], error, loading};
}
