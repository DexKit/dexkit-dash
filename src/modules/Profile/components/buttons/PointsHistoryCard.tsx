import React from 'react';

import {Moment} from 'moment';

import {
  Box,
  Grid,
  Typography,
  Paper,
  alpha,
  makeStyles,
} from '@material-ui/core';

import {GiftIcon, CrownIcon} from 'shared/components/Icons';

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
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: alpha(theme.palette.common.white, 0.12),
    borderStyle: 'solid',
  },
}));

interface RankingButtonProps {
  label: string;
  icon?: 'gift' | 'crown';
  date?: Moment;
}

export const PointsHistoryCard = (props: RankingButtonProps) => {
  const classes = useStyles();

  const {label, date, icon} = props;

  return (
    <Paper variant='outlined'>
      <Box p={2}>
        <Grid
          container
          justifyContent='space-between'
          alignItems='center'
          alignContent='center'
          spacing={2}>
          <Grid item>
            <Box className={classes.iconWrapper}>
              {icon === 'crown' ? (
                <CrownIcon />
              ) : icon === 'gift' ? (
                <GiftIcon />
              ) : null}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography align='left' variant='body2'>
              {label}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2' color='textSecondary'>
              {date?.fromNow()}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PointsHistoryCard;
