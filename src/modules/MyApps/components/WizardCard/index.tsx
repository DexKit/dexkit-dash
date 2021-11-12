import React from 'react';

import {Link} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {makeStyles, useTheme} from '@material-ui/core';
import {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    maxHeight: '70%',
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    height: theme.spacing(12),
    backgroundColor: '#343A49',
  },
  kitBtn: {
    borderRadius: theme.shape.borderRadius,
    borderWidth: 'thin',
    border: `.5px solid ${theme.palette.grey['600']}`,
    backgroundColor: '#2F3142',
  },
  avatarMarketplace: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  avatarAggregator: {
    backgroundColor: theme.palette.primary.light,
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  avatarGrid: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  buttonsCard: {
    margin: theme.spacing(2),
  },
}));

type Props = {
  marketplaceKit?: number;
  aggregatorKit?: number;
};

const WizardCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={2}
      className={classes.root}
      // @ts-ignore
      style={{backgroundColor: theme.palette.background.darker}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='body1'>
            <IntlMessages id='app.myApps.aggregator' />
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={5} className={classes.buttonsCard}>
        <Grid item md={6} xs={12}>
          <Grid
            container
            spacing={2}
            className={classes.button}
            alignContent='space-around'>
            <Grid item xs={7} style={{alignSelf: 'center'}}>
              <Grid container spacing={2}>
                <Grid item xs={3} className={classes.avatarGrid}>
                  <Avatar className={classes.avatarMarketplace}>&nbsp;</Avatar>
                </Grid>
                <Grid item xs={9} style={{alignSelf: 'center'}}>
                  <IntlMessages id='app.myApps.marketplace' />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={5} style={{textAlign: 'right'}}>
              <Button size='small' className={classes.kitBtn}>
                {props.marketplaceKit || 500} KIT +
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} xs={12}>
          <Grid
            container
            spacing={2}
            className={classes.button}
            alignContent='space-around'>
            <Grid item xs={7} style={{alignSelf: 'center'}}>
              <Grid container spacing={2}>
                <Grid item xs={3} className={classes.avatarGrid}>
                  <Avatar className={classes.avatarAggregator}>&nbsp;</Avatar>
                </Grid>
                <Grid item xs={9} style={{alignSelf: 'center'}}>
                  <IntlMessages id='app.myApps.aggregator' />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={5} style={{textAlign: 'right'}}>
              <Button
                size='small'
                className={classes.kitBtn}
                component={Link}
                to='/my-apps/aggregator'>
                {props.aggregatorKit || 500} KIT +
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WizardCard;
