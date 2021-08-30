import React from 'react';

import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  greenSquare: {
    backgroundColor: theme.palette.success.main,
    height: theme.spacing(8),
    width: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}));

export const GreenSquare = () => {
  const classes = useStyles();

  return <Box className={classes.greenSquare} />;
};
