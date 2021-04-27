import { NETWORK } from "shared/constants/AppEnums";
import { TransferByAddress } from "types/app";

export function parseTransferByAddressData(data: any, network: NETWORK): TransferByAddress[] {

  if (data && data.data[network]) {
    const sender: any[] = data.data[network].sender.map((e: any) => {return {...e, type:'Send'}});
    const receiver: any[] = data.data[network].receiver.map((e: any) => {return {...e, type:'Receive'}});
        
    return sender.concat(receiver)
      .sort((a, b) => b.block.height - a.block.height)
      .map(e => {
        return {
          sender: e.sender.address,
          receiver: e.receiver.address,
          type: e.type,
          token: {
            address: e.currency.address,
            name: e.currency.name,
            symbol: e.currency.symbol,
            decimals: e.currency.decimals
          },
          amount: e.amount,
          amountUsd: e.amountInUsd,
          hash: e.transaction.hash,
          time: e.block.timestamp.time
        }
      })
  }

  return [];
}