import React, {useCallback, useMemo} from 'react';

import {Paper, Box, Grid, Typography, Button} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {useToggler} from 'hooks/useToggler';

import JoinGameDialog from 'modules/SquidLeague/components/dialogs/JoinGameDialog';

import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';
import {ethers} from 'ethers';
import {GameState} from 'modules/SquidLeague/utils/types';
import Countdown from 'modules/SquidLeague/components/Countdown';
import {JoinGameStateSkeleton} from 'modules/SquidLeague/pages/Game/JoinGameState.skeleton';

import {ReactComponent as TimerIcon} from 'assets/images/vuesax/twotone/timer.svg';

import {ReactComponent as CupIcon} from 'assets/images/vuesax/twotone/cup.svg';

import {useChainInfo} from 'hooks/useChainInfo';

interface Params {
  id: string;
}

export const JoinGameCard = (props: Params) => {
  const {id} = props;
  const {tokenSymbol} = useChainInfo();
  const gameAddressQuery = useGameAddress(id);
  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);
  const gameDataRoundQuery = useOnChainCurrentRoundGame(
    gameDataQuery.data?.round,
    gameAddressQuery.data,
  );
  const joinGameToggler = useToggler(false);

  const handleCloseJoinGameDialog = useCallback(() => {
    joinGameToggler.toggle();
  }, [joinGameToggler]);

  const pot = gameDataQuery.data?.pot;

  const entry = useMemo(() => {
    if (pot) {
      return ethers.utils.formatEther(pot);
    } else {
      return null;
    }
  }, [pot]);

  const gameState = gameDataQuery.data?.gameState;
  const isPlayerJoined = gameDataQuery.data?.playerJoined;

  const isJoinGameState = useMemo(() => {
    return gameState === GameState.Joining;
  }, [gameState]);

  const joinStartTimestamp = gameDataQuery.data?.startTimestamp;

  return (
    <>
      {gameDataQuery?.isLoading && <JoinGameStateSkeleton />}

      {isJoinGameState && (
        <Grid item xs={12}>
          {gameAddressQuery.data && (
            <JoinGameDialog
              gameAddress={gameAddressQuery.data}
              pot={pot}
              onRefetchCallback={() => gameDataQuery.refetch()}
              dialogProps={{
                open: joinGameToggler.show,
                maxWidth: 'sm',
                fullWidth: true,
                onClose: handleCloseJoinGameDialog,
              }}
            />
          )}

          <Grid
            container
            spacing={4}
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
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
                              id='squidLeague.gameStartsIn'
                              defaultMessage={'Game starts in'}
                            />
                          </Typography>
                          <Typography variant='h5' color='textPrimary'>
                            {joinStartTimestamp && (
                              <Countdown
                                startTimestamp={joinStartTimestamp.toNumber()}
                                onEndCallback={() =>
                                  gameDataRoundQuery.refetch()
                                }
                              />
                            )}
                          </Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'center'}>
                          <TimerIcon />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
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
                              id='squidLeague.entry'
                              defaultMessage={'Entry'}
                            />
                          </Typography>
                          <Typography variant='h5' color='textPrimary'>
                            {entry} {tokenSymbol}
                          </Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'center'}>
                          <CupIcon />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  {!isPlayerJoined && (
                    <Button
                      fullWidth
                      startIcon={<ArrowDownwardIcon />}
                      variant='outlined'
                      onClick={() => joinGameToggler.toggle()}
                      color='primary'>
                      <IntlMessages
                        id='squidLeague.joinGame'
                        defaultMessage={'Join Game'}
                      />
                    </Button>
                  )}
                  {isPlayerJoined && (
                    <Box display={'flex'} justifyContent={'center'}>
                      <Typography variant={'h5'}> Joined</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default JoinGameCard;
