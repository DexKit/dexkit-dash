import React from 'react';

import {GridContainer} from '@crema';
import {Chip, Grid, Theme, Typography} from '@material-ui/core';

import {makeStyles} from '@material-ui/styles';
import {green, red} from '@material-ui/core/colors';

import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {ReactComponent as RewardIcon} from 'assets/images/icons/reward.svg';

const useStyles = makeStyles<Theme, Props>((theme) => ({
  root: {
    borderRadius: 8,
    backgroundColor: '#2E3243',
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  icon: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  percentChip: {
    color: ({percentage}) => ((percentage || 0) > 10 ? green[500] : red[500]),
    backgroundColor: ({percentage}) =>
      (percentage || 0) > 10 ? green[900] : '#3E3749',
  },
}));

type Props = {
  title?: string;
  value?: number;
  percentage?: number;
  styles?: React.CSSProperties;
};

const RewardCard: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const {usdFormatter} = useUSDFormatter();

  const toCurrency = (value: number) => usdFormatter.format(value);

  return (
    <GridContainer
      spacing={2}
      style={{...props.styles}}
      className={classes.root}>
      <Grid item xs={3} className={classes.icon}>
        <RewardIcon />
      </Grid>

      <Grid item xs={9}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='body2'>
              {props.title || 'Aggregator'}
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent='space-evenly'>
          <Grid item xs={7} style={{alignSelf: 'center'}}>
            <Typography variant='h5'>
              {toCurrency(props.value || 120)}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Chip
              label={`${props.percentage || 0}%`}
              className={classes.percentChip}
            />
          </Grid>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default RewardCard;
