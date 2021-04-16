import { NETWORK } from "shared/constants/Bitquery";
import { TransferByAddress } from "types/app";

export function parseTransferByAddressData(data: any, network: NETWORK): TransferByAddress[] {

  if (data && data.data[network]) {
    const sender: any[] = data.data[network].sender;
    const receiver: any[] = data.data[network].receiver;

    return sender.concat(receiver)
      .sort((a, b) => a.block.height - b.block.height)
      .map(e => {
        return {
          sender: e.sender.address,
          receiver: e.receiver.address,
          token: {
            address: e.currency.address,
            name: e.currency.name,
            symbol: e.currency.symbol,
            decimals: e.currency.decimals
          },
          amount: e.amount,
          hash: e.transaction.hash,
          time: e.block.timestamp.time
        }
      })
  }

  return [];
}