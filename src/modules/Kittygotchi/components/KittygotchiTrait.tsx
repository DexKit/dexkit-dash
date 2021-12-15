import React from 'react';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
  },
}));

interface Props {
  traitType?: string;
  value?: string;
  loading?: boolean;
}

export function KittygotchiTrait(props: Props) {
  const {traitType, value, loading} = props;

  const classes = useStyles();

  return (
    <Paper variant='outlined' className={classes.paper}>
      <Box p={2}>
        <Typography component='p' align='center' variant='overline'>
          {loading ? <Skeleton /> : traitType}
        </Typography>
        <Typography align='center' variant='body2'>
          <strong>{loading ? <Skeleton /> : value}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}

export default KittygotchiTrait;
