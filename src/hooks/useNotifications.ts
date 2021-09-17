import {useDispatch} from 'react-redux';
import {onAddNotification} from 'redux/actions';
import {Notification} from 'types/models/Notification';

export function useNotifications() {
  const dispatch = useDispatch();

  const createNotification = (notification: Notification) => {
    dispatch(onAddNotification([notification]));
  };

  return {createNotification};
}
