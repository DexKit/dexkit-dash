import React from 'react';
import {
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import {useStyles} from './index.style';

interface Props {}

const LoadingStep: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <>
      <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
        <Typography style={{fontWeight: 600}} variant='h5' align='center'>
          Wait please
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogBox}>
        <CircularProgress size="100px" />
      </DialogContent>
      <DialogActions></DialogActions>
    </>
  );
};

export default LoadingStep;
