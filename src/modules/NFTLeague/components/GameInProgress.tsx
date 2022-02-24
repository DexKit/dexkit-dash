import IntlMessages from '@crema/utility/IntlMessages';
import {Grid, Box, Paper, Typography} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import React from 'react';
import {useModuleStyle} from '../styles';
import {PlayerCoinPaper} from './PlayerCoinPaper';

import {ReactComponent as FlashIcon} from '../assets/flash.svg';
import {useWeb3} from 'hooks/useWeb3';
import {useGameGraph} from '../hooks/useGameGraph';
import {useGameOnChain} from '../hooks/useGameOnChain';

interface Props {
  id: string;
  finalPrize?: number;
  endsIn?: string;
  gameType?: 'bull' | 'bear';
  tokenSymbol?: string;
}

export const GameInProgress: React.FC<Props> = ({
  id,
  finalPrize,
  endsIn,
  gameType,
  tokenSymbol,
}) => {
  const classes = useModuleStyle();

  const {account} = useWeb3();

  const {
    query: {data},
  } = useGameOnChain(id);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box p={4} component={Paper}>
              <Typography color='textSecondary' variant='body2'>
                <IntlMessages id='nftLeague.finalPrize' />
              </Typography>
              <Typography
                className={classes.boldText}
                color='textPrimary'
                variant='subtitle1'>
                {finalPrize ? (
                  <>
                    {finalPrize} {tokenSymbol}
                  </>
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box p={4} component={Paper}>
              <Typography color='textSecondary' variant='body2'>
                <IntlMessages id='nftLeague.gameEndsIn' />
              </Typography>
              <Typography
                className={classes.boldText}
                color='textPrimary'
                variant='subtitle1'>
                {endsIn ? endsIn : <Skeleton />}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box p={4} component={Paper}>
              <Typography color='textSecondary' variant='body2'>
                <IntlMessages id='nftLeague.gameType' />
              </Typography>
              <Typography
                className={classes.boldText}
                color='textPrimary'
                variant='subtitle1'>
                {data?.type === 'Bull' ? (
                  'BULL'
                ) : data?.type === 'Bear' ? (
                  'BEAR'
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={5}>
            <PlayerCoinPaper
              state='inprogress'
              tokenId='2'
              initialPrice={1}
              currentPrice={1}
              multiplier={1000}
              score={10.0}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box
              height='100%'
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <Box display='flex' alignItems='center' alignContent='center'>
                <FlashIcon />
                <Typography
                  style={{textTransform: 'uppercase'}}
                  variant='body1'>
                  <IntlMessages id='nftLeague.versus' />
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5}>
            <PlayerCoinPaper
              state='waiting'
              tokenId='3'
              initialPrice={1}
              currentPrice={1}
              multiplier={1000}
              score={10.0}
              account={account}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GameInProgress;
