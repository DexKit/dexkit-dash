import React, {useCallback, useState} from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {ethers} from 'ethers';
import {makeStyles} from '@material-ui/core/styles';
import {truncateAddress} from 'utils/text';
import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {GameType} from 'types/coinsleague';
import {useInterval} from 'hooks/utils/useInterval';
import {CardTimer} from '../CardTimer';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

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

interface Props {
  address: string;
  amount_to_play: ethers.BigNumber;
  start_timestamp: ethers.BigNumber;
  duration: ethers.BigNumber;
  num_players: ethers.BigNumber;
  game_type?: GameType;
  btnMessage?: string;
  onClick: any;
}

function SmallCardGame(props: Props): JSX.Element {
  const {
    amount_to_play,
    start_timestamp,
    num_players,
    duration,
    address,
    onClick,
    game_type,
  } = props;

  const classes = useStyles();
  const {messages} = useIntl();

  const [countdown, setCountdown] = useState<number>();
  /* const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  const prizeTotalValue = ethers.utils.formatEther(
    amount_to_play.mul(num_players),
  );
  const entryAmount = ethers.utils.formatEther(amount_to_play);
  useInterval(
    () => {
      const time = duration.toNumber();
      const startTime =
        Math.round(new Date().getTime() / 1000) - start_timestamp.toNumber();
      setCountdown(time - startTime);
    },
    1000,
    true,
  );

  const onClickEnter = useCallback(
    (ev: any) => {
      onClick(address);
    },
    [address],
  );

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Grid container className={classes.innerContent} spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h5'>ID #{truncateAddress(address)}</Typography>
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
              &nbsp;{entryAmount} {'Matic'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.prizePool' />
              :&nbsp;
            </Typography>
            <Typography variant='h6'>{prizeTotalValue} Matic</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h6'>
              <IntlMessages id='app.coinLeagues.gameType' />
              &nbsp;
            </Typography>
            <Typography variant='h6'>
              {game_type === GameType.Winner ? 'Bull' : 'Bear'}
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
              {countdown && countdown > 0 && <CardTimer time={countdown} />}
              {countdown && countdown < 0 && messages['app.ended']}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} style={{color: '#7a8398'}}>
          <Button className={classes.button} fullWidth onClick={onClickEnter}>
            {props.btnMessage || messages['app.view']}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SmallCardGame;
