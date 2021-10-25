import React from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {ethers} from 'ethers';
import {truncateAddress} from 'utils/text';
import Box from '@material-ui/core/Box';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeagues/utils/time';
import {GET_GAME_LEVEL} from 'modules/CoinLeagues/utils/game';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    fontSize: '1rem',
  },
}));

interface Props {
  address: string;
  duration: ethers.BigNumber;
  amount_to_play: ethers.BigNumber;
}

function SimpleCardGame(props: Props): JSX.Element {
  const classes = useStyles();
  const {messages} = useIntl();
  const {duration, address, amount_to_play} = props;
  const id = address;
  const time = duration.toNumber();
  const gameLevel = GET_GAME_LEVEL(amount_to_play);
  const entryAmount = ethers.utils.formatEther(amount_to_play);

  return (
    <Container className={classes.container}>
      <Grid
        container
        style={{color: '#7a8398'}}
        spacing={2}
        alignContent={'center'}
        alignItems={'center'}>
        <Grid item xs={12} sm={12}>
          <Box display={'flex'}>
            <Typography variant='h6'>{messages['app.gameTime']}:</Typography>
            <Typography variant='h6' style={{fontWeight: 600}}>
              &nbsp;{GET_LABEL_FROM_DURATION(time)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>ID #{truncateAddress(id)}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box display='flex' alignItems='center'>
            <SendIcon />
            <Box display='flex' alignItems='center' pl={3}>
              <Grid
                container
                justifyContent='center'
                alignItems='center'
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
      </Grid>
    </Container>
  );
}

export default SimpleCardGame;
