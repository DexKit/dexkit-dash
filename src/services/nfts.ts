import {BigNumber, ethers} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {getMulticall, getMulticallFromProvider} from './multicall';
import {getEthers} from './web3modal';
import {CallInput} from '@indexed-finance/multicall';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';

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
  const multicall = await getMulticall();
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
  const iface = new Interface(abi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const metadaUris: string[] = [];
  for (let index = 0; index < tokenIds.length; index++) {
    const id = tokenIds[index];
    calls.push({
      interface: iface,
      target: collection,
      function: 'tokenURI',
      args: [id],
    });
  }
  const response = await multicall.multiCall(calls);
  const [blockNumber, results] = response;
  for (let index = 0; index < tokenIds.length; index++) {
    metadaUris.push(results[index][0]);
  }

  return metadaUris;
};
// Query all events
export const getTokenIDsByTransfer = async (
  collection: string,
  address: string,
  provider: any,
) => {
 
  const contract = new ethers.Contract(
    collection,
    ERC721Abi,
    provider,
  );

  console.log('picking events');
  let eventFilter = await contract.filters.Transfer(null, address);
  const blockNumber = await provider.getBlockNumber();
  let events = await contract.queryFilter(eventFilter, blockNumber - 10000 );
  console.log(events);
  let tokenIds = new Set<string>();

  for (let event of events) {
    if (event.args) {
      tokenIds.add((event.args[2] as BigNumber).toNumber().toString());
    }
  }

  const balance = (await contract.balanceOf(address)) as BigNumber;
  // Balance is the same so we can return all id's
  if (balance.toNumber() === tokenIds.entries.length) {
    return Array.from(tokenIds);
  }
  // if not, lets filter the ones we don't own
  const iface = new Interface(ERC721Abi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  for (const id of tokenIds) {
    calls.push({
      interface: iface,
      target: collection,
      function: 'ownerOf',
      args: [id],
    });
  }
  const response = await multicall.multiCall(calls);
  const [, results] = response;
  const filteredIDs = [];
  const ids = Array.from(tokenIds);
  for (let index = 0; index < results.length; index++) {
    const addr = results[index];
    if (addr.toLowerCase() === address.toLowerCase()) {
      filteredIDs.push(ids[index]);
    }
  }
  return filteredIDs;
};

export const getNFTBalances = async (
  collections: string[],
  account: string,
  provider: any,
) => {
  
  const iface = new Interface(ERC721Abi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];

  for (let index = 0; index < collections.length; index++) {
    const address = collections[index];
    calls.push({
      interface: iface,
      target: address,
      function: 'balanceOf',
      args: [account],
    });
  }
  const response = await multicall.multiCall(calls);
  const [blockNumber, results] = response;
  console.log(results);
  const balances: {address: string, balance: BigNumber}[] = [];
  for (let index = 0; index < results.length; index++) {
    balances.push({
      address: collections[index],
      balance:  results[index]
    });
  }

  return balances;
};
