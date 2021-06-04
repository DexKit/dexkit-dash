import React from 'react';
import {
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  CircularProgress,
  Button,
} from '@material-ui/core';
import {useStyles} from './index.style';

interface Props {}

const LoadingStep: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Please wait
      </Typography>
      <Button fullWidth color='primary' size='large' disabled>
        <CircularProgress style={{alignSelf: 'center'}} size='40px' />
      </Button>
    </>
  );
};

export default LoadingStep;
