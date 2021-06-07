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
import { onAddNotification } from 'redux/actions';
import { NotificationType } from 'services/notification';
import { useDispatch } from 'react-redux';
import { Notification} from 'types/models/Notification';
interface Props {
  step: Steps | undefined;
  error: Error | string | undefined;
  onLoading: (value: boolean) => void;
  onClose: () => void;
}

const ErrorStep: React.FC<Props> = (props) => {
  const {step, error, onLoading, onClose} = props;
  const dispatch = useDispatch();

  const [message, setMessage] = useState<string>('');

  const classes = useStyles();

  useEffect(() => {
    if (step === Steps.ERROR && error) {
      console.log('START ERROR');

      if (error) {
        if (error instanceof Error) {
          setMessage(error.message);

          const notification: Notification = { title: 'Error', body: error.message };
          dispatch(onAddNotification([notification], NotificationType.ERROR));
        } else if (typeof error === 'string') {
          setMessage(error);

          const notification: Notification = { title: 'Error', body: error };
          dispatch(onAddNotification([notification], NotificationType.ERROR));
        }
      }
      onLoading(false);
    }
  }, [step, error]);

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        {message}
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='outlined'
        color='primary'
        size='large'
        onClick={onClose}>
        Close
      </Button>
    </>
  );
};

export default ErrorStep;
