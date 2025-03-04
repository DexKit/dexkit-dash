export interface ChangellyCoin {
  addressUrl: string;
  enabled: boolean;
  enabledFrom: boolean;
  enabledTo: boolean;
  extraIdName: boolean;
  fixRateEnabled: boolean;
  fixedTime: number;
  fullName: string;
  image: string;
  name: string;
  payinConfirmations: number;
  ticker: string;
  transactionUrl: string;
}
export interface ChangellyTransaction {
  amountExpectedFrom: string;
  amountExpectedTo: string;
  amountTo: number;
  apiExtraFee: string;
  binaryPayload: null;
  changellyFee: string;
  createdAt: string;
  currencyFrom: string;
  currencyTo: string;
  id: string;
  kycRequired: boolean;
  payinAddress: string;
  payinExtraId: null;
  payoutAddress: string;
  redirect: null;
  signature: null;
  status: string;
}
