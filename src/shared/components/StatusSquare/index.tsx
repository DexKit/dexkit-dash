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

export const StatusSquare = React.forwardRef((props:Props, ref) => {
  const {color} = props;

  const classes = useStyles();  
  //@ts-ignore
  return <Box {...props} className={classes.square} style={{backgroundColor: color}} ref={ref}  />;
});

