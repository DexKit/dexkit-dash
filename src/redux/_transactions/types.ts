export enum TransactionStatus {
  Pending,
  Confirmed,
  Failed,
}

export interface Transaction {
  hash: string;
  title: string;
  description: string;
  chainId: number;
  status: TransactionStatus;
  timestamp?: number;
}
