import React, {useCallback, useMemo} from 'react';

import {Grid, Button, Paper, Box, Typography} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {ReactComponent as CupIcon} from 'assets/images/vuesax/twotone/cup.svg';
import {ReactComponent as PlayersIcon} from 'assets/images/vuesax/twotone/profile-2-user.svg';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {useToggler} from 'hooks/useToggler';

import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';

import WithdrawGameDialog from 'modules/SquidLeague/components/dialogs/WithdrawGameDialog';
import {GET_MAX_ROUNDS} from 'modules/SquidLeague/constants';
import {useChainInfo} from 'hooks/useChainInfo';
import {ethers} from 'ethers';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';
import {useWeb3} from 'hooks/useWeb3';

interface Params {
  id: string;
}

export const WithdrawGameCard = (props: Params) => {
  const {id} = props;

  const gameAddressQuery = useGameAddress(id);

  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);
  const gameDataRoundQuery = useOnChainCurrentRoundGame(
    gameDataQuery.data?.round,
    gameAddressQuery.data,
  );
  const {tokenSymbol} = useChainInfo();
  const {chainId} = useWeb3();
  const withdrawGameToggler = useToggler(false);

  const handleCloseWithdrawGameDialog = useCallback(() => {
    withdrawGameToggler.toggle();
  }, [withdrawGameToggler]);

  const round = gameDataQuery.data?.round;
  const playerCanWithdraw =
    gameDataRoundQuery.data?.playerCurrentRoundChallengeResult;
  console.log(playerCanWithdraw);
  const canWeWithdrawGame = useMemo(() => {
    if (round && playerCanWithdraw) {
      return round.toNumber() === GET_MAX_ROUNDS(chainId) && playerCanWithdraw;
    }
    return false;
  }, [round, chainId, playerCanWithdraw]);

  const pot = gameDataQuery.data?.pot;
  const joinedPlayers = gameDataQuery.data?.joinedPlayers;
  const winners = gameDataRoundQuery.data?.totalPlayersPastRound;
  const totalPotPerPlayer = useMemo(() => {
    if (pot && joinedPlayers && winners && winners.gt(0)) {
      return ethers.utils.formatEther(pot.mul(joinedPlayers).div(winners));
    } else {
      return null;
    }
  }, [pot, joinedPlayers, winners]);

  const totalWinners = useMemo(() => {
    if (winners) {
      return winners.toString();
    } else {
      return null;
    }
  }, [winners]);

  const alreadyClaimed = gameDataQuery.data?.playerWithdraw;

  return (
    <Grid item xs={12}>
      {gameAddressQuery.data && (
        <WithdrawGameDialog
          gameAddress={gameAddressQuery.data}
          onRefetchCallback={() => gameDataQuery.refetch()}
          dialogProps={{
            open: withdrawGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseWithdrawGameDialog,
          }}
        />
      )}
      <Grid
        container
        spacing={4}
        alignItems='center'
        alignContent='center'
        justifyContent='center'>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Paper variant='outlined'>
                <Box p={2}>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    alignContent='center'>
                    <Box>
                      <Typography color='textSecondary' variant='caption'>
                        <IntlMessages
                          id='squidLeague.winners'
                          defaultMessage={'Winners'}
                        />
                      </Typography>
                      <Typography variant='h5' color='textPrimary'>
                        {totalWinners}{' '}
                        <IntlMessages
                          id='squidLeague.players'
                          defaultMessage={'Players'}
                        />
                      </Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'}>
                      <PlayersIcon />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant='outlined'>
                <Box p={2}>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    alignContent='center'>
                    <Box>
                      <Typography color='textSecondary' variant='caption'>
                        <IntlMessages
                          id='squidLeague.finalPrizePerPlayer'
                          defaultMessage='Final Prize per Player'
                        />
                      </Typography>
                      <Typography variant='h5' color='textPrimary'>
                        {totalPotPerPlayer} {tokenSymbol}
                      </Typography>
                    </Box>
                    <Box display='flex' justifyContent='center'>
                      <CupIcon />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            {canWeWithdrawGame && (
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={() => withdrawGameToggler.toggle()}
                      startIcon={<ArrowDownwardIcon />}
                      disabled={alreadyClaimed}
                      variant='outlined'
                      color='primary'>
                      {alreadyClaimed ? (
                        <IntlMessages
                          id='squidLeague.alreadyClaimed'
                          defaultMessage={'Already Claimed'}
                        />
                      ) : (
                        <IntlMessages
                          id='squidLeague.getPrize'
                          defaultMessage={'Get Prize'}
                        />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WithdrawGameCard;
