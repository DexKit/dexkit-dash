import React, {useEffect} from 'react';
import {
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {Steps} from 'types/app';
import {useStyles} from './index.style';
import styled from 'styled-components';

interface Props {
  step: Steps;
  onLoading: (value: boolean) => void;
  onClose: () => void;
}

const DoneStep: React.FC<Props> = (props) => {
  const {step, onLoading, onClose} = props;

  const classes = useStyles();

  useEffect(() => {
    if (step === Steps.DONE) {
      console.log('START DONE');
      onLoading(false);
    }
  }, [step]);

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Order completed!
      </Typography>
      <Button fullWidth color='primary' size='large' onClick={onClose}>
        <CheckCircleOutlineIcon
          style={{width: 40, height: 40, paddingRight: 10}}
        />
        Close
      </Button>
    </>
  );
};

export default DoneStep;
