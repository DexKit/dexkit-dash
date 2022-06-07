import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {truncateAddress} from 'utils/text';
import Skeleton from '@material-ui/lab/Skeleton';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

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
    color: 'black',
  },
  innerContent: {
    fontSize: '1rem',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '0.875rem',
    paddingBottom: theme.spacing(3),
  },
}));

const strPad = (str: number): string => {
  return (new Array(3).join('0') + str).slice(-2);
};

function CardTimer(props: {time: number}) {
  const time = props.time;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) - hours * 3600;
  const seconds = time - minutes * 60;

  return (
    <Grid item>
      <Typography variant='subtitle2'>
        in {strPad(hours)}:{strPad(minutes)}:{strPad(seconds)}
      </Typography>
    </Grid>
  );
}

function CardGameProgressSkeleton(): JSX.Element {
  const classes = useStyles();
  const {coinSymbol} = useLeaguesChainInfo();
  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h5'>
        <Skeleton>ID #{truncateAddress('0x000000000000000000')}</Skeleton>
      </Typography>
      <Grid container className={classes.innerContent}>
        <Grid xs={5} item>
          <Typography
            variant='h6'
            style={{color: '#fcc591', alignItems: 'baseline'}}>
            <SendIcon />
            <Skeleton>
              &nbsp;{'0'} {coinSymbol}
            </Skeleton>
          </Typography>
        </Grid>
        <Grid
          xs={7}
          container
          justifyContent='flex-end'
          style={{color: '#7a8398'}}>
          <Typography variant='h6'>
            <IntlMessages id='app.coinLeagues.gameTime' />:
          </Typography>
          <Typography variant='h6' style={{fontWeight: 600}}>
            <Skeleton> &nbsp;{Math.floor(1 / 3600)}Hrs</Skeleton>
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.countdown' />
          </Typography>
          <CardTimer time={100} />
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.entries' />
            <Typography variant='subtitle2'>
              <Skeleton>
                {' '}
                {1} {1}{' '}
              </Skeleton>
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.coins' />
            <Typography variant='subtitle2'>
              {' '}
              <Skeleton>{strPad(1)} </Skeleton>
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.prizePool' />
            <Typography variant='subtitle2'>
              {' '}
              <Skeleton>
                {100} {coinSymbol}{' '}
              </Skeleton>
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth>
        <Skeleton>
          <IntlMessages id='app.coinLeagues.enterGame' />
        </Skeleton>
      </Button>
    </Container>
  );
}

export default CardGameProgressSkeleton;
