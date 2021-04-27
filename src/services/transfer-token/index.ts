import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
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
// export function getContractToken(tokenAddress: string, contractOptions?: ContractOptions): Contract {
 
// }

/**
 * 
 * @param from Address from sender transaction
 * @param to received addres
 * @param value value to send
 * @param contract token contract
 */
export async function sendTransaction(from: string, to: string, amount: string, contractAddress?: string): Promise<any | undefined> {
  const web3: Web3 = getWeb3() as Web3;

  if (web3 == null) {
    return Promise.reject('Web3 not provider');
  }

  if (contractAddress == null) {
    const trans = await web3Transaction({from, to, value: amount});
    return trans?.transactionHash;
  } else {
    return new Promise<string>((resolve, reject) => {
      let contract = new web3.eth.Contract(MIN_ABI, contractAddress);

      contract.methods.transfer(to, amount).send({from: from})
      .once('transactionHash', (hash: string) => {
        resolve(hash);
      })
      .once('error', (error: any) => {
        reject(error)
      });

    });
  }
}

