import {ethers} from 'ethers';
import {getEthers} from './web3modal';
import axios from 'axios';
import {getNormalizedUrl} from 'utils/browser';
import {TokenMetadata} from 'types/nfts';

const abi = [
  {
    inputs: [],
    name: 'baseURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getContractBaseURI = async (address: string) => {
  // const iface =
  const provider = getEthers();
  let contract = new ethers.Contract(address, abi, provider);

  const baseURI = (await contract.baseURI()) as string;
  const tokenURI = (await contract.tokenURI('1')) as string;

  return {
    baseURI,
    tokenURI,
  };
};

export const getTokenMetadataURI = async (
  tokenIds: string[],
  collection: string,
  provider: any,
) => {
  const metadaUris: string[] = [];

  let contract = new ethers.Contract(collection, abi, provider);

  for (let index = 0; index < tokenIds.length; index++) {
    metadaUris.push(await contract.tokenURI(1));
  }

  return metadaUris;
};

export const getTokenMetadata = async (url: string) => {
  return axios
    .get<TokenMetadata>(getNormalizedUrl(url))
    .then((response) => response.data);
};
