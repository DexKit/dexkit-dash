import React, {useCallback, useMemo} from 'react';
import MainLayout from 'shared/components/layouts/main';

import {
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  Divider,
  Button,
} from '@material-ui/core';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {useToggler} from 'hooks/useToggler';

import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';

import {GameState} from 'modules/SquidLeague/utils/types';
import JoinGameCard from 'modules/SquidLeague/components/JoinGameCard';
import SetupStartEndGameCard from 'modules/SquidLeague/components/SetupStartEndGameCard';
import SetupGameDialog from 'modules/SquidLeague/components/dialogs/SetupGameDialog';
import {getLastChallengeTimestamp} from 'modules/SquidLeague/utils/time';
import {useWeb3} from 'hooks/useWeb3';
import {Empty} from 'shared/components/Empty';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import WithdrawGameCard from 'modules/SquidLeague/components/WithdrawGameCard';
import {GET_MAX_ROUNDS} from 'modules/SquidLeague/constants';
import {PlayersCard} from 'modules/SquidLeague/components/PlayersCard';
import {getGameURL} from 'modules/SquidLeague/utils/url';
import CopyLink from 'shared/components/CopyLink';

interface Params {
  id: string;
}

export const GameLayout = (props: Params) => {
  const {id} = props;
  const gameAddressQuery = useGameAddress(id);
  const {chainId} = useWeb3();
  const gameDataQuery = useOnChainGameData(gameAddressQuery.data);
  const gameDataRoundQuery = useOnChainCurrentRoundGame(
    gameDataQuery.data?.round,
    gameAddressQuery.data,
  );

  const setupGameToggler = useToggler(false);

  const {formatMessage} = useIntl();

  const gameState = gameDataQuery.data?.gameState;
  const isPlayerJoined = gameDataQuery.data?.playerJoined;

  const isJoinGameState = useMemo(() => {
    return gameState === GameState.Joining;
  }, [gameState]);

  const isSetupGameState = useMemo(() => {
    return gameState === GameState.Setup;
  }, [gameState]);

  const isStartedGameState = useMemo(() => {
    return gameState === GameState.Started;
  }, [gameState]);

  const isFinishGameState = useMemo(() => {
    return gameState === GameState.Finished;
  }, [gameState]);

  const roundNumber = gameDataQuery.data?.round.toNumber();

  const isWithdrawState = useMemo(() => {
    return roundNumber === GET_MAX_ROUNDS(chainId);
  }, [roundNumber, chainId]);

  const joinStartTimestamp = gameDataQuery.data?.startTimestamp;

  const handleCloseSetupGameDialog = useCallback(() => {
    setupGameToggler.toggle();
  }, [setupGameToggler]);
  const lastChallengeTimestamp = gameDataQuery.data?.lastChallengeTimestamp;

  const round = gameDataQuery.data?.round;
  // Can we setup challenge
  const canWeSetupChallenge = useMemo(() => {
    if (isJoinGameState && joinStartTimestamp) {
      const actualDate = new Date();
      const gameDate = new Date(joinStartTimestamp.toNumber() * 1000);
      if (actualDate.getTime() > gameDate.getTime()) {
        return true;
      }
    }
    if (
      !isJoinGameState &&
      isFinishGameState &&
      chainId &&
      lastChallengeTimestamp &&
      round &&
      !(round?.toNumber() === GET_MAX_ROUNDS(chainId))
    ) {
      const actualDate = new Date();
      const challengeTimestamp = getLastChallengeTimestamp(
        lastChallengeTimestamp,
        chainId,
      );
      const gameDate = new Date(challengeTimestamp * 1000);
      if (actualDate.getTime() > gameDate.getTime()) {
        return true;
      }
    }
    return false;
  }, [
    joinStartTimestamp,
    isJoinGameState,
    lastChallengeTimestamp,
    chainId,
    isFinishGameState,
    round,
  ]);

  const formatRound = useMemo(() => {
    if (round) {
      if (isFinishGameState && round.toNumber() === GET_MAX_ROUNDS(chainId)) {
        return 'Final';
      } else {
        return round.toNumber() + 1;
      }
    }
    return null;
  }, [isFinishGameState, chainId, round]);

  return (
    <MainLayout>
      {gameAddressQuery.data && (
        <SetupGameDialog
          gameAddress={gameAddressQuery.data}
          onRefetchCallback={() => gameDataQuery.refetch()}
          dialogProps={{
            open: setupGameToggler.show,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseSetupGameDialog,
          }}
        />
      )}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages
              id='squidLeague.gameInformation'
              defaultMessage={'Squid League'}
            />{' '}
            #{Number(id) + 1}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='subtitle1'>
            <IntlMessages id='squidLeague.battle' defaultMessage={'Battle'} />
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <IntlMessages
              id='squidLeague.guessIfTheCoinWillGoUpOrDown'
              defaultMessage={
                'Be a prediction wizard and guess if coin will go up or down in an hour'
              }
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography color='textPrimary' variant='subtitle1'>
                  <IntlMessages
                    id='squidLeague.round'
                    defaultMessage={'Round'}
                  />{' '}
                  {formatRound}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {!isSupportedBlockchain(chainId) && (
                  <Empty
                    title='Network not Supported'
                    message='Please switch to supported networks: Mumbai'
                  />
                )}
              </Grid>
              {!isJoinGameState && !isPlayerJoined && (
                <Grid item xs={12}>
                  <Box display={'flex'} justifyContent={'center'}>
                    <Typography variant='subtitle1' color='primary'>
                      <IntlMessages
                        id='squidLeague.notJoinedGame'
                        defaultMessage={'You not joined this game'}
                      />
                    </Typography>
                  </Box>
                </Grid>
              )}

              {isJoinGameState && <JoinGameCard id={id} />}
              {(isSetupGameState || isFinishGameState || isStartedGameState) &&
                !isWithdrawState && <SetupStartEndGameCard id={id} />}
              {isWithdrawState && <WithdrawGameCard id={id} />}
              {canWeSetupChallenge && (
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'center'}>
                        <Button
                          onClick={() => setupGameToggler.toggle()}
                          startIcon={<ArrowDownwardIcon />}
                          variant='outlined'
                          color='primary'>
                          <IntlMessages
                            id='squidLeague.setupGame'
                            defaultMessage={'Setup Game'}
                          />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='subtitle1' color='textPrimary'>
            <IntlMessages
              id='squidLeague.shareGame'
              defaultMessage={'Share game'}
            />
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            <IntlMessages
              id='squidLeague.shareYourGameWithAnotherPlayers'
              defaultMessage={'Share game with another players'}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={formatMessage({
              id: 'squidLeague.url',
              defaultMessage: 'url',
            })}
            disabled
            value={getGameURL(id)}
            variant='outlined'
            fullWidth
          />
          <Box pt={2}>
            <CopyLink tooltip='Copied' copyText={getGameURL(id)}>
              <Button
                startIcon={<ArrowDownwardIcon />}
                variant='outlined'
                color='primary'>
                <IntlMessages
                  id='squidLeague.copyLink'
                  defaultMessage={'Copy Link'}
                />
              </Button>
            </CopyLink>

            {/*<Button
              startIcon={<ArrowDownwardIcon />}
              variant='outlined'
              color='primary'>
              <IntlMessages
                id='squidLeague.copyLink'
                defaultMessage={'Copy Link'}
              />
          </Button>*/}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {!isJoinGameState && (
          <Grid item xs={12}>
            <Typography variant='subtitle1' color='textPrimary'>
              <IntlMessages
                id='squidLeague.players'
                defaultMessage={'Players'}
              />{' '}
              {gameDataRoundQuery.data?.totalPlayersPastRound.toString()}/
              {gameDataQuery.data?.joinedPlayers.toString()}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Typography>
            <PlayersCard id={id} />
          </Grid>
        )}
        {isJoinGameState && (
          <Grid item xs={12}>
            <Typography variant='subtitle1' color='textPrimary'>
              <IntlMessages
                id='squidLeague.joinedPlayers'
                defaultMessage={'Joined Players'}
              />{' '}
              {gameDataQuery.data?.joinedPlayers.toString()}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              <IntlMessages
                id='squidLeague.pointsAreCountedHourly'
                defaultMessage={'Points are counted hourly'}
              />
            </Typography>
            <PlayersCard id={id} />
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
};

export default GameLayout;
