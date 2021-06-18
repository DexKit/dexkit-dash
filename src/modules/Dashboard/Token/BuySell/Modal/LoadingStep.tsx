import React from 'react';
import {Typography, CircularProgress, Button} from '@material-ui/core';
// import {useStyles} from './index.style';

interface Props {
  currentStepIndex: number;
}

const LoadingStep: React.FC<Props> = (props) => {
  const {currentStepIndex} = props;
  // const classes = useStyles();

  return (
    <>
      {currentStepIndex !== -1 && (
        <Typography align='center' style={{paddingBottom: 10}}>
          Please confirm on your wallet and wait while your request is being
          processed
        </Typography>
      )}
      <Button
        style={{margin: 0}}
        fullWidth
        color='primary'
        size='large'
        disabled>
        <CircularProgress style={{alignSelf: 'center'}} size='40px' />
      </Button>
    </>
  );
};

export default LoadingStep;
