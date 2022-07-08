import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {ethers} from 'ethers';
import {Grid, Typography, Box, Paper} from '@material-ui/core';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import {GET_LABEL_FROM_DURATION} from 'modules/CoinLeague/utils/time';
import {GET_GAME_LEVEL} from 'modules/CoinLeague/utils/game';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

interface Props {
  address: string;
  duration: ethers.BigNumber;
  id: ethers.BigNumber;
  amount_to_play: ethers.BigNumber;
}

function SimpleCardGame(props: Props): JSX.Element {
  const {chainId, coinSymbol} = useLeaguesChainInfo();
  const {duration, amount_to_play, id} = props;
  const intId = id.toNumber();
  const time = duration.toNumber();
  const gameLevel = GET_GAME_LEVEL(amount_to_play, chainId);
  const entryAmount = ethers.utils.formatEther(amount_to_play);

  return (
    <Paper>
      <Box p={4}>
        <Grid container spacing={4}>
          <Grid item>
            <Typography variant='h6'>ID #{intId}</Typography>
          </Grid>

          <Grid item>
            <Box display={'flex'}>
              <Typography variant='h6'>
                <IntlMessages id='app.coinLeagues.gameTime' />:
              </Typography>
              <Typography variant='h6'>
                {GET_LABEL_FROM_DURATION(time)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display='flex' alignItems='center'>
              <Box display='flex' alignItems='center'>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  spacing={1}>
                  <Grid xs={12} item>
                    <Typography variant='h6'>{gameLevel}</Typography>
                    <Typography>
                      {entryAmount} {coinSymbol}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default SimpleCardGame;
