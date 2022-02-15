import React from 'react';

import {makeStyles, Paper, Box, Typography} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing(8),
    height: theme.spacing(16),
    minWidth: theme.spacing(40),
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(6),
    alignItems: 'center',
    alignContent: 'center',
  },
  value: {
    fontWeight: 600,
  },
}));

interface Props {
  icon: React.ReactNode;
  caption: string;
  value?: string;
}

export const ProfileStatsPill: React.FC<Props> = ({caption, value, icon}) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Box mr={2}>{icon}</Box>
      <Box>
        <Typography
          style={{marginBottom: 0, paddingBottom: 0}}
          color='textSecondary'
          variant='caption'>
          {caption}
        </Typography>
        <Typography noWrap className={classes.value} variant='h5'>
          {!value ? <Skeleton /> : value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProfileStatsPill;
