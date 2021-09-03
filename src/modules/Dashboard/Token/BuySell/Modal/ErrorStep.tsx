import React, {useEffect, useState} from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import {Steps} from 'types/app';
import {useStyles} from './index.style';
import {onAddNotification} from 'redux/actions';
import {NotificationType} from 'services/notification';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
interface Props {
  step: Steps | undefined;
  error: Error | string | undefined;
  onClose: () => void;
}

const ErrorStep: React.FC<Props> = (props) => {
  const {step, error, onClose} = props;
  const dispatch = useDispatch();

  const [message, setMessage] = useState<string>('');

  const classes = useStyles();

  useEffect(() => {
    if (step === Steps.ERROR && error) {
      console.log('START ERROR');

      if (error) {
        if (error instanceof Error) {
          setMessage(error.message);

          const notification: Notification = {
            title: 'Error',
            body: error.message,
          };
          dispatch(onAddNotification([notification], NotificationType.ERROR));
        } else if (typeof error === 'string') {
          setMessage(error);

          const notification: Notification = {title: 'Error', body: error};
          dispatch(onAddNotification([notification], NotificationType.ERROR));
        }
      }
    }
  }, [step]);

  return (
    <Typography align='center' style={{paddingBottom: 10}}>
      {message}
    </Typography>
  );
};

export default ErrorStep;
