import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BigNumber from 'bignumber.js';
import {useStyles} from './index.style';
import {Typography} from '@material-ui/core';

interface Props {
  amount: BigNumber;
  onClose: () => void;
  onNext: (next: boolean | Error) => void;
}

const ConvertStep: React.FC<Props> = (props) => {
  const {onClose, onNext} = props;

  const classes = useStyles();

  const handleAction = () => {
    try {
      onNext(true);
    } catch (e) {
      onNext(e);
    }
  };

  return (
    <>
      <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
        <Typography style={{fontWeight: 600}} variant='h5' align='center'>
          ETH to WETH
        </Typography>
      </DialogTitle>
      <DialogContent dividers></DialogContent>
      <DialogActions>
        <Button color='primary' size='large' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={handleAction}>
          Convert
        </Button>
      </DialogActions>
    </>
  );
};

export default ConvertStep;
