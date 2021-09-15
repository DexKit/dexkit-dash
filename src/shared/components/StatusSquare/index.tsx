import React from 'react';

import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  square: {
    height: '100%',
    width: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}));

interface Props {
  color: string;
}

export const StatusSquare = (props: Props) => {
  const {color} = props;

  const classes = useStyles();

  return <Box className={classes.square} style={{backgroundColor: color}} />;
};
