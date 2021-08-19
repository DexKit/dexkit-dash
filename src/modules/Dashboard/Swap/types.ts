export interface SwapTransaction {
  id: string;
  fromAmount: string;
  fromCoin: string;
  toAmount: string;
  toCoin: string;
  payinAddress: string;
  payoutAddress: string;
  created?: number;
  status: string;
}
