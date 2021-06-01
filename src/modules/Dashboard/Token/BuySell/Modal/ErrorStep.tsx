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
    if (step == Steps.ERROR && error) {
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
      <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
        <Typography style={{fontWeight: 600}} variant='h5' align='center'>
          Error
        </Typography>
      </DialogTitle>
      <DialogContent dividers>{message}</DialogContent>
      <DialogActions>
        <Button color='primary' size='large' onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default ErrorStep;
