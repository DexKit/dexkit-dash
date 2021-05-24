import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BigNumber from 'bignumber.js';

interface Props {
  amount: BigNumber;
  onClose: () => void;
  onNext: (next: boolean | Error) => void;
}

const ConvertStep: React.FC<Props> = (props) => {
  const { onClose, onNext } = props

  const handleAction = () => {
    try {
      onNext(true);
    } catch (e) {
      onNext(e);
    }
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">ETH to WETH</DialogTitle>
      <DialogContent>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleAction} color="primary">Convert</Button>
      </DialogActions>
    </>
  );
}

export default ConvertStep