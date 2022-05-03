import {useDispatch} from 'react-redux';
import {onAddNotification} from 'redux/actions';
import {addTransaction} from 'redux/_transactions/actions';
import {TransactionStatus} from 'redux/_transactions/types';
import {Notification} from 'types/models/Notification';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

export function useNotifications() {
  const dispatch = useDispatch();

  const createNotification = (notification: Notification) => {
    if (notification.type === NotificationType.TRANSACTION) {
      const metadata: TxNotificationMetadata = notification.metadata;

      dispatch(
        addTransaction({
          chainId: metadata.chainId,
          description: notification.body || '',
          hash: metadata.transactionHash,
          status: TransactionStatus.Pending,
          title: notification.title || '',
          timestamp: notification.timestamp,
        }),
      );
    }

    dispatch(onAddNotification([notification]));
  };

  return {createNotification};
}
