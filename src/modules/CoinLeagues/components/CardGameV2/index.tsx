import React, {useCallback, useState} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square-small.svg';
import {BigNumber, ethers} from 'ethers';
import {truncateAddress} from 'utils/text';
import {useInterval} from 'hooks/utils/useInterval';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeagues/utils/time';
import {strPad} from 'modules/CoinLeagues/utils/time';
import {CardTimer} from '../CardTimer';
import {GameGraph} from 'modules/CoinLeagues/utils/types';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    color: 'black',
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.0rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
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

interface Props {
  id: string;
  game: GameGraph;
  onClick: (address: string) => void;
  btnMessage?: string;
}

function CardGameV2(props: Props): JSX.Element {
  const {game, onClick} = props;
  const classes = useStyles();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(game.amount_to_play.toNumber()  );*/
  const [countdown, setCountdown] = useState<number>();
  const prizeTotalValue = ethers.utils.formatEther(
    BigNumber.from(game.entry).mul(BigNumber.from(game.numPlayers)),
  );
  const entryAmount = ethers.utils.formatEther(game.entry);
  const time = Number(game.duration);
  const coins = Number(game.numCoins);
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry));

  // Format number values
  const entriesIn = strPad(Number(game.currentPlayers) || 0);
  const entriesOut = strPad(Number(game.numPlayers) || 0);
  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.id);
    },
    [game.id],
  );

  useInterval(
    () => {
      const time = Number(game.duration);
      const startTime =
        Math.round(new Date().getTime() / 1000) - Number(game.startedAt || 0);
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h6'>ID #{truncateAddress(props.id)}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid xs={6} item>
          <Box display={'flex'} alignItems={'center'}>
            <SendIcon />
            <Box display={'flex'} alignItems={'center'} pl={1}>
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                spacing={1}>
                <Grid xs={12} item>
                  <Typography
                    variant='h6'
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    {gameLevel}
                  </Typography>
                  <Typography
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    &nbsp;{entryAmount} {'MATIC'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Box
            display={'flex'}
            justifyContent='flex-end'
            style={{color: '#7a8398'}}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.duration' />:
            </Typography>
            <Typography variant='h6' style={{fontWeight: 500}}>
              &nbsp;{GET_LABEL_FROM_DURATION(time)}
            </Typography>
          </Box>
          <Box
            display={'flex'}
            justifyContent='flex-end'
            style={{color: '#7a8398'}}>
            <Typography variant='h6'>
              &nbsp;
              <IntlMessages id='app.coinLeagues.type' />:
            </Typography>
            <Typography variant='h6' style={{fontWeight: 500}}>
              &nbsp;{game.type === 'Bull' ? 'Bull' : 'Bear'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.starts' />
          </Typography>
          {countdown && countdown > 0 ? (
            <CardTimer time={countdown} />
          ) : (
            <Typography variant='subtitle2'>
              <IntlMessages id='app.coinLeagues.ready' />{' '}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.entries' />
          </Typography>
          <Typography variant='subtitle2'>
            {entriesIn}/{entriesOut}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.coins' />
          </Typography>
          <Typography variant='subtitle2'>{strPad(coins)}</Typography>
        </Grid>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.prizePool' />
          </Typography>
          <Typography variant='subtitle2'>{prizeTotalValue} MATIC</Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || <IntlMessages id='app.coinLeagues.type' />}
      </Button>
    </Container>
  );
}

export default CardGameV2;
