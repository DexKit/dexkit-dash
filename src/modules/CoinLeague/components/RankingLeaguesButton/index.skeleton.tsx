import React from 'react';

import {
  Box,
  Grid,
  Typography,
  Paper,
  ButtonBase,
  Chip,
  makeStyles,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    width: '100%',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

export const RankingButtonSkeleton = () => {
  const classes = useStyles();

  return (
    <Paper variant='outlined'>
      <ButtonBase className={classes.button}>
        <Box p={4}>
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'
            spacing={2}>
            <Grid item>
              <Skeleton>
                {' '}
                <Chip color={'primary'} label={''} size='small' />{' '}
              </Skeleton>
            </Grid>
            <Grid item xs>
              <Skeleton>
                {' '}
                <Typography align='left' variant='body1'>
                  {'0x00000aaa0s000ss0'}
                </Typography>
              </Skeleton>
            </Grid>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <Skeleton className={classes.avatar} variant='circle' />
              </Box>
            </Grid>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <Skeleton>
                  {' '}
                  <ExpandMoreIcon />
                </Skeleton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ButtonBase>
    </Paper>
  );
};

export default RankingButtonSkeleton;
