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

const ContentWrapper = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1rem;
`;

const DoneStep: React.FC<Props> = (props) => {
  const {step, onLoading, onClose} = props;

  const classes = useStyles();

  useEffect(() => {
    if (step == Steps.DONE) {
      console.log('START DONE');
      onLoading(false);
    }
  }, [step]);

  return (
    <>
      <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
        <Typography style={{fontWeight: 600}} variant='h5' align='center'>
          Finished
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <ContentWrapper>
          <Typography align='center'>
            <CheckCircleOutlineIcon style={{width: 80, height: 80}} />
          </Typography>
          <Typography align='center'>Order Completed!</Typography>
        </ContentWrapper>
      </DialogContent>
      <DialogActions>
        <Button color='primary' size='large' onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default DoneStep;
