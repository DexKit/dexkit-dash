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
import {useInterval} from 'hooks/utils/useInterval';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeagues/utils/time';
import {strPad} from 'modules/CoinLeagues/utils/time';
import {CardTimer} from '../CardTimer';
import {GameGraph} from 'modules/CoinLeagues/utils/types';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';

import ViewGameMetadataModal from '../ViewGameMetadataModal';
import IconButton from '@material-ui/core/IconButton';
import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';

import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';

const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.text.primary,
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  containerPrize: {
    color: '#fff',
    borderRadius: 6,
    background: '#1c2650',
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 500,
    borderRadius: 6,
    fontSize: '1rem',
    background: '#ffa552',
    justifyContent: 'center',
    padding: theme.spacing(1),
    color: 'black',
  },
  innerContent: {
    fontSize: '0.8rem',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  smallContent: {
    fontSize: '14px',
    paddingBottom: theme.spacing(3),
  },
}));

interface Props {
  id: string;
  game: GameGraph;
  onClick: (address: string) => void;
  btnMessage?: string;
}

function CardGame(props: Props): JSX.Element {
  const {game, onClick} = props;
  const classes = useStyles();
  const {chainId, coinSymbol} = useLeaguesChainInfo();
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
  const gameLevel = GET_GAME_LEVEL(BigNumber.from(game.entry), chainId);
  const [openShowGameMetadataModal, setOpenShowGameMetadataModal] =
    useState(false);
  // Format number values
  const entriesIn = strPad(Number(game.currentPlayers) || 0);
  const entriesOut = strPad(Number(game.numPlayers) || 0);
  /* eslint-disable */
  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(game.intId);
    },
    [game.intId],
  );

  useInterval(
    () => {
      const startTime = Math.floor(
        Number(game.startsAt || 0) - Math.round(new Date().getTime() / 1000),
      );
      setCountdown(startTime);
    },
    1000,
    true,
  );

  return (
    <Container
      className={game.title ? classes.containerPrize : classes.container}
      maxWidth='xs'>
      {game.title ? (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Typography variant='subtitle2'>
            ID# {game.intId} {game.title ? `- ${game.title} ` : null}
          </Typography>
          <IconButton
            onClick={() => setOpenShowGameMetadataModal(true)}
            size={'small'}>
            <CrownIcon />
          </IconButton>
          <ViewGameMetadataModal
            open={openShowGameMetadataModal}
            setOpen={setOpenShowGameMetadataModal}
            gameMetadata={game}
          />
        </Box>
      ) : (
        <Typography variant='subtitle2'>ID# {game.intId}</Typography>
      )}

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
                    variant='subtitle2'
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    {gameLevel}
                  </Typography>
                  <Typography
                    style={{color: '#fcc591', alignItems: 'baseline'}}>
                    &nbsp;{entryAmount} {coinSymbol}
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
            <Typography variant='subtitle2'>
              <IntlMessages id='app.coinLeagues.gameTime' />:
            </Typography>
            <Typography variant='subtitle2' style={{fontWeight: 500}}>
              &nbsp;{GET_LABEL_FROM_DURATION(time)}
            </Typography>
          </Box>
          <Box
            display={'flex'}
            justifyContent='flex-end'
            style={{color: '#7a8398'}}>
            <Typography variant='subtitle2'>
              {' '}
              &nbsp;
              <IntlMessages id='app.coinLeagues.type' />:
            </Typography>
            <Typography
              variant='subtitle2'
              style={{color: game.type === 'Bull' ? '#60A561' : '#F76F8E'}}>
              &nbsp; {game.type === 'Bull' ? 'Bull' : 'Bear'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        className={`${classes.innerContent} ${classes.smallContent}`}>
        <Grid item>
          <Typography variant='subtitle2'>
            <IntlMessages id='app.coinLeagues.starts' />:
          </Typography>
          {countdown && countdown > 0 ? (
            <CardTimer time={countdown} />
          ) : (
            <Typography variant='subtitle2'>
              <IntlMessages id='app.coinLeagues.ready' />:
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
            {' '}
            <IntlMessages id='app.coinLeagues.maxPrizePool' />
          </Typography>
          <Typography variant='subtitle2'>
            {prizeTotalValue} {coinSymbol}
          </Typography>
        </Grid>
      </Grid>

      <Button className={classes.button} fullWidth onClick={onClickEnter}>
        {props.btnMessage || <IntlMessages id='app.coinLeagues.enterGame' />}
      </Button>
    </Container>
  );
}

export default CardGame;
