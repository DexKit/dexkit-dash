import { TokenStatistic } from "types/app";

export function parseTokenStatisticsData(data: any): TokenStatistic {
  if (data && data.data.ethereum.transfers && data.data.ethereum.transfers.length > 0) {
    const e = data.data.ethereum.transfers[0];
    return {
      token: {
        symbol: e.currency.symbol,
        address: e.currency.address
      },
      transferCount: e.count,
      uniqSenders: e.sender_count,
      uniqReceiver: e.receiver_count,
      totalAmount: e.amount,
      medianTransferAmount: e.median,
      averageTransferAmount: e.average,
      firstTransferDate: e.min_date,
      lastTransferDate: e.max_date,
      daysTokenTransfered: e.days
    }
  }
  return {
    token: {
      symbol: '-',
      address: '-'
    },
    transferCount: 0,
    uniqSenders: 0,
    uniqReceiver: 0,
    totalAmount: 0,
    medianTransferAmount: 0,
    averageTransferAmount: 0,
    firstTransferDate: '-',
    lastTransferDate: '0',
    daysTokenTransfered: 0,
  };
}