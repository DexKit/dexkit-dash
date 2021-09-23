export enum NotificationType {
  TRANSACTION,
}

export interface TxNotificationMetadata {
  chainId: number;
  transactionHash: string;
  status: 'done' | 'pending' | 'failed';
}
