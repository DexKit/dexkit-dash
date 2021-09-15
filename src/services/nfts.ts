import { ethers } from "ethers";
import {Interface} from 'ethers/lib/utils';
import { getMulticall, getMulticallFromProvider } from "./multicall";
import { getEthers } from "./web3modal";
import {CallInput} from '@indexed-finance/multicall';

const abi = [
    {
        "inputs": [],
        "name": "baseURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },


]

export const getContractBaseURI = async (address: string) => {
// const iface = 
 const provider = getEthers()
 let contract = new ethers.Contract(address, abi, provider);
 const multicall = await getMulticall();
 const baseURI = (await contract.baseURI()) as string;
 const tokenURI = (await contract.tokenURI('1')) as string;

 return {
     baseURI,
     tokenURI
 }

}

export const getTokenMetadataURI = async (tokenIds: string[], collection: string, provider: any) => {
  const iface = new Interface(abi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const metadaUris:  string[] = [];
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

  return metadaUris
  
  }