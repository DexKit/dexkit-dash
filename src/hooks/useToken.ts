
import {  getWeb3, } from "services/web3modal"


import { Currency } from 'types/bitquery/currency.interface';
import { getContractToken, sendTransfer } from 'services/transfer-token';
import { BigNumber } from "@0x/utils";



export enum Web3Status {
  Not_Connected,
  Connecting,
  Connected,
  Failure
}


export const useToken = () => {

 
  const onTransferToken = (from: string, to: string, amount: BigNumber, currency: Currency) => {
    const web3 = getWeb3();
    if(!web3){
      return null
    }
    const contract = getContractToken(currency.address, web3);
    sendTransfer(from, to, amount, contract).then(tx => {
      // Dispatch here a notification 

      })
  }
 

  


  return { onTransferToken }

}