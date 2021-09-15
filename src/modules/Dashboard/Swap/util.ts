export const STATUS_CONFIRMING = 'confirming';
export const STATUS_WAITING = 'waiting';
export const STATUS_FINISHED = 'finished';
export const STATUS_HOLD = 'finished';
export const STATUS_EXCHANGING = 'exchanging';
export const STATUS_SENDING = 'sending';
export const STATUS_OVERDUE = 'overdue';
export const STATUS_EXPIRED = 'expired';
export const STATUS_FAILED = 'failed';
export const STATUS_REFUNDED = 'refunded';

export const getChangellyStatusMessage = (status: string) => {
  switch (status) {
    case STATUS_WAITING:
      return 'Waiting for deposit';
    case STATUS_CONFIRMING:
      return 'Confirming transaction';
    case STATUS_HOLD:
      return 'Transaction need verification';
    case STATUS_EXCHANGING:
      return 'Payment was confirmed';
    case STATUS_SENDING:
      return 'Coins are being sent';
    case STATUS_REFUNDED:
      return 'Refunded';
    case STATUS_FAILED:
      return 'Transaction failed';
    default:
      return '';
  }
};
