import React, { useEffect, useState } from 'react';
import {Button, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import { Steps } from 'types/app';

interface Props {
  step: Steps | undefined;
  error: Error | string | undefined;
  onLoading: (value: boolean) => void;
  onClose: () => void;
}

const ErrorStep: React.FC<Props> = (props) => {
  const {step, error, onLoading, onClose } = (props);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (step == Steps.ERROR && error) {
      console.log('START ERROR')
      
      if (error) {
        if (error instanceof Error) {
          setMessage(error.message)
        }
        else if (typeof(error) === 'string') {
          setMessage(error)
        }
      }
      onLoading(false);
    }
  }, [step, error])

  return (
    <>
      <DialogTitle id="form-dialog-title">Error</DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </>
  );
}

export default ErrorStep