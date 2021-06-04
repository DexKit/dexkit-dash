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

interface Props {
  step: Steps | undefined;
  error: Error | string | undefined;
  onLoading: (value: boolean) => void;
  onClose: () => void;
}

const ErrorStep: React.FC<Props> = (props) => {
  const {step, error, onLoading, onClose} = props;

  const [message, setMessage] = useState<string>('');

  const classes = useStyles();

  useEffect(() => {
    if (step === Steps.ERROR && error) {
      console.log('START ERROR');

      if (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else if (typeof error === 'string') {
          setMessage(error);
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
      <Button fullWidth color='primary' size='large' onClick={onClose}>
        Close
      </Button>
    </>
  );
};

export default ErrorStep;
