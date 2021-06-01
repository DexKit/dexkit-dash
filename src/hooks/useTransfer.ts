
import { getContractToken } from 'services/transfer-token';
import { fromTokenUnitAmount } from "@0x/utils";
import { Currency } from "types/myApps";
import { useDispatch } from "react-redux";
import { onAddNotification } from "redux/actions";
import { NotificationType } from "services/notification";
import { isNativeCoin, truncateAddress } from "utils";
import { ChainId } from "types/blockchain";
import { useWeb3 } from "./useWeb3";

export enum Web3Status {
  Not_Connected,
  Connecting,
  Connected,
  Failure
}

export const useTransfer = () => {

  const {chainId, getWeb3} = useWeb3();

  const dispatch = useDispatch();
 
  const onTransfer = async (from: string, to: string, amount: string, currency: Currency) => {
    const web3: any = getWeb3();
    
    if(!web3){
      return null
    }

    const amountFn = fromTokenUnitAmount(amount, currency.decimals);

    if(isNativeCoin(currency.symbol, chainId as ChainId)) {
      
      web3.eth.sendTransaction({from, to, value: amountFn.toString()})
        .once('transactionHash', (hash: string) => {
          const notification = new Notification('Processing', { body: truncateAddress(hash) });
          dispatch(onAddNotification(notification, NotificationType.INFO));
        })
        .then((e: any) => {
          const notification = new Notification('Send', { body: `Sent with success ${truncateAddress(e.transactionHash)}` });
          dispatch(onAddNotification(notification, NotificationType.SUCCESS));
        })
        .catch((error: Error) => {
          const notification = new Notification('Error', { body: error.message });
          dispatch(onAddNotification(notification, NotificationType.ERROR));
        });

    } else {
      const contract = getContractToken(currency.address, web3);

      contract.methods
      .transfer(to, amountFn.toString()).send({from: from})
      .then((tx: string) => {
        const notification = new Notification('Send', { body: 'Sent with success' });
        dispatch(onAddNotification(notification));
      })
      .catch((e: any) => {
        const notification = new Notification('Error', { body: e.message||'' });
        dispatch(onAddNotification(notification, NotificationType.ERROR));
      })      
    }

  }


  return { onTransfer }

}