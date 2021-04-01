import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract, ContractOptions } from 'web3-eth-contract';
import { web3Transaction, getWeb3 } from '../web3modal';

export const MIN_ABI: AbiItem[] = [
  // transfer
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    type: "function"
  }
];

/**
 * get token contract
 */
export function getContractToken(tokenAddress: string, web3: Web3, contractOptions?: ContractOptions): Contract {
  return new Contract(MIN_ABI, tokenAddress, contractOptions);
}

/**
 * 
 * @param from Address from sender transaction
 * @param to received addres
 * @param value value to send
 * @param contract token contract
 */
export async function sendTransaction(from: string, to: string, value: number, contract?: Contract): Promise<string | undefined> {
  const web3: Web3 = getWeb3() as Web3;
  if (web3 == null) {
    return Promise.reject('Web3 not provider');
  }
  const numDecimals: number = contract != null ? Number(await (
    new Promise((resolve, reject) => {
      contract?.methods.decimals()
        .call(
          function (error: any, d: number) {
            resolve((error) ? 18 : d);
          }
        );
    }))) : 18;
  const transformedValue = value * (Math.pow(10, numDecimals));
  if (contract == null) {
    const trans = await web3Transaction({
      from,
      to,
      value: transformedValue
    });
    return trans?.transactionHash;
  } else {
    // call transfer function
    return new Promise<string>((resolve, reject) => {
      contract.methods
        .transfer(to, transformedValue, (error: any, txHash: string) => {
          // it returns tx hash because sending tx
          if (error != null) {
            return reject(error);
          }
          return resolve(txHash);
        });
    });
  }
}

