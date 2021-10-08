import React from 'react';

import {GridContainer} from '@crema';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    backgroundColor: '#252836',
    padding: theme.spacing(3),
    maxHeight: '70%',
  },
  button: {
    borderRadius: 8,
    height: theme.spacing(12),
    backgroundColor: '#343A49',
  },
  kitBtn: {
    fontSize: '1rem',
    margin: 0,
    borderRadius: 8,
    borderWidth: 'thin',
    border: '1px solid rgba(255,255,255,.2)',
    backgroundColor: '#3C4255',
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

  return (
    <GridContainer spacing={2} className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Wizard Launch</Typography>
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
                <Grid
                  item
                  xs={3}
                  style={{display: 'flex', justifyContent: 'space-around'}}>
                  <Avatar
                    style={{backgroundColor: '#FCC591', width: 25, height: 25}}>
                    &nbsp;
                  </Avatar>
                </Grid>
                <Grid item xs={9} style={{alignSelf: 'center'}}>
                  Marketplace
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
                <Grid
                  item
                  xs={3}
                  style={{display: 'flex', justifyContent: 'space-around'}}>
                  <Avatar
                    style={{backgroundColor: '#BDCBFC', width: 25, height: 25}}>
                    &nbsp;
                  </Avatar>
                </Grid>
                <Grid item xs={9} style={{alignSelf: 'center'}}>
                  Aggregator
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={5} style={{textAlign: 'right'}}>
              <Button size='small' className={classes.kitBtn}>
                {props.aggregatorKit || 500} KIT +
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default WizardCard;
