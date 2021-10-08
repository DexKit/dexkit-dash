import React from 'react';
import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: '50%',
  },
}));

interface KittygotchiAccessoryProps {
  icon: React.ReactNode;
}

export const KittygotchiAccessory = (props: KittygotchiAccessoryProps) => {
  const {icon} = props;
  const classes = useStyles();

  return <Box className={classes.root}>{icon}</Box>;
};
