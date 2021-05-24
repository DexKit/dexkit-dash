import React, { useEffect } from 'react';
import { Button, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import { Steps } from 'types/app';

interface Props {
  step: Steps;
  onLoading: (value: boolean) => void;
  onClose: () => void;
}

const DoneStep: React.FC<Props> = (props) => {
  const {step, onLoading, onClose } = (props);

  useEffect(() => {
    if (step == Steps.DONE) {
      console.log('START DONE')
      onLoading(false);
    }
  }, [step])

  return (
    <>
      <DialogTitle id="form-dialog-title">Finish</DialogTitle>
      <DialogContent>
        DONE
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </>
  );
}

export default DoneStep