import React, {useCallback, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {BigNumber, ethers} from 'ethers';
import {makeStyles} from '@material-ui/core/styles';
import {truncateAddress} from 'utils/text';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square-small.svg';

import {useInterval} from 'hooks/utils/useInterval';
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
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.0rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
    color: 'black',
  },
  innerContent: {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
}));

interface Props {
  game: GameGraph;
  btnMessage?: string;
  onClick: any;
}

function SmallCardGameV2(props: Props): JSX.Element {
  const {game, onClick} = props;

  const classes = useStyles();

  const [countdown, setCountdown] = useState<number>();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry));

  const prizeTotalValue = ethers.utils.formatEther(
    BigNumber.from(game.entry).mul(BigNumber.from(game.numPlayers)),
  );
  const entryAmount = ethers.utils.formatEther(game.entry);
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

  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.id);
    },
    [game.id, onClick],
  );

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Grid container className={classes.innerContent} spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h6'>ID #{truncateAddress(game.id)}</Typography>
        </Grid>
        <Grid item xs={12}>
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

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>Prize Pool:&nbsp;</Typography>
            <Typography variant='h6'>{prizeTotalValue} Matic</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>Game Type:&nbsp;</Typography>
            <Typography variant='h6'>
              {game.type === 'Bull' ? 'Bull' : 'Bear'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>Countdown:&nbsp;</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              {countdown && countdown > 0 && <CardTimer time={countdown} />}
              {countdown && countdown < 0 && 'ENDED'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Button className={classes.button} fullWidth onClick={onClickEnter}>
            {props.btnMessage || 'VIEW'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SmallCardGameV2;
