import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import {truncateAddress} from 'utils/text';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.125rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  innerContent: {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
}));

const strPad = (str: number): string =>
  (new Array(3).join('0') + str).slice(-2);

function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) - hours * 3600;
  const seconds = time - minutes * 60;

  return (
    <Grid item>
      <Typography variant='h6'>
        {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

function SmallCardGameSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Grid container className={classes.innerContent}>
        <Grid item xs={12}>
          <Skeleton>
            <Typography variant='h5'>
              ID #{truncateAddress('0x0000000000000000000000000000000000')}
            </Typography>
          </Skeleton>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <SendIcon />
            <Typography
              variant='h6'
              style={{
                fontWeight: 500,
                color: '#fcc591',
                alignItems: 'baseline',
              }}>
              <Skeleton>
                &nbsp;{0} {'Matic'}
              </Skeleton>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.prizePool' />
              :&nbsp;
            </Typography>
            <Skeleton>
              <Typography variant='h6'>{1000} Matic</Typography>
            </Skeleton>
          </Box>
        </Grid>
        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.gameType' />
              :&nbsp;
            </Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              <Skeleton>
                <Typography variant='h6'>
                  <IntlMessages id='app.coinLeagues.winner' />
                </Typography>
              </Skeleton>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.countdown' />
              :&nbsp;
            </Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              <Skeleton>
                <CardTimer time={1000} />
              </Skeleton>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{color: '#7a8398'}}>
        <Skeleton>
          <Button className={classes.button} fullWidth>
            <IntlMessages id='app.coinLeagues.view' />
          </Button>
        </Skeleton>
      </Grid>
    </Container>
  );
}

export default SmallCardGameSkeleton;
