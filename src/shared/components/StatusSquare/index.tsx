/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  square: {
    height: '70%',
    width: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  bound: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
  },
}));

interface Props {
  color: string;
}

export const StatusSquare = React.forwardRef((props: Props, ref) => {
  const {color} = props;

  const classes = useStyles();
  //@ts-ignore
  return (
    <Box className={classes.bound}>
      <Box
        {...props}
        className={classes.square}
        style={{backgroundColor: color}}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ref={ref}
      />
    </Box>
  );
});
