import IntlMessages from '@crema/utility/IntlMessages';
import {Grid, Box, Paper, Typography} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import React, {useCallback, useState} from 'react';
import {useModuleStyle} from '../styles';
import {PlayerCoinPaper} from './PlayerCoinPaper';

import {ReactComponent as FlashIcon} from '../assets/flash.svg';
import {useWeb3} from 'hooks/useWeb3';
import {useGameGraph} from '../hooks/useGameGraph';
import {useGameOnChain} from '../hooks/useGameOnChain';
import {useOnChainGames} from '../hooks/useOnChainGames';
import {Game, GameType} from '../utils/types';
import {ethers} from 'ethers';
import JoinGameDialog from './JoinGameDialog';
import {useToggler} from 'hooks/useToggler';

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

  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const [transactionHash, setTransactionHash] = useState<string>();

  const {data, error, isLoading} = useGameOnChain(id);

  const joinGameToggler = useToggler();

  const handleJoinGame = useCallback(() => {}, []);

  const handleCloseCreateDialog = useCallback(() => {
    joinGameToggler.set(false);
    setLoading(false);
    setTransactionHash(undefined);
    setTransactionConfirmed(false);
    setErrorMessage(undefined);
  }, [joinGameToggler]);

  const handleConfirmJoinGame = useCallback(() => {}, []);

  return (
    <>
      <JoinGameDialog
        dialogProps={{
          open: joinGameToggler.show,
          onClose: handleCloseCreateDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        onConfirm={handleConfirmJoinGame}
        loading={loading}
        transactionHash={transactionHash}
        confirmed={transactionConfirmed}
        gameId={parseInt(id)}
        errorMessage={errorMessage}
      />
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
                  <Skeleton />
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
                  {data?.game_type === GameType.Winner ? (
                    'BULL'
                  ) : data?.game_type === GameType.Loser ? (
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
                tokenId={data?.player1_coin.champion_id.toString()}
                initialPrice={data?.player1_coin.start_price.toNumber()}
                currentPrice={data?.player1_coin.end_price.toNumber()}
                multiplier={data?.player1_coin.multiplier.toNumber()}
                score={data?.player1_coin.score.toNumber()}
                winner={data?.winner === data?.player1}
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
                state={
                  data?.player2 === ethers.constants.AddressZero
                    ? 'waiting'
                    : 'inprogress'
                }
                tokenId={data?.player2_coin.champion_id.toString()}
                initialPrice={data?.player2_coin.start_price.toNumber()}
                currentPrice={data?.player2_coin.end_price.toNumber()}
                multiplier={data?.player2_coin.multiplier.toNumber()}
                score={data?.player2_coin.score.toNumber()}
                account={account}
                winner={data?.winner === data?.player2}
                onJoinGame={
                  data?.player2 === ethers.constants.AddressZero
                    ? handleJoinGame
                    : undefined
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default GameInProgress;
