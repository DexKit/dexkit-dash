import IntlMessages from '@crema/utility/IntlMessages';
import {Button, CircularProgress, Grid, makeStyles} from '@material-ui/core';
import {Delete, Edit} from '@material-ui/icons';
import {Alert} from '@material-ui/lab';
import {useMobile} from 'hooks/useMobile';
import {useGameEnd} from 'modules/CoinLeagues/hooks/v2/useGameEnd';
import {useGameStart} from 'modules/CoinLeagues/hooks/v2/useGameStart';
import React, {useCallback, useState, useMemo} from 'react';
import {Game} from 'types/coinsleague';

import GroupAddIcon from '@material-ui/icons/GroupAdd';

import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
}));

interface Props {
  game?: Game;
  canEnterGame?: boolean;
  onEnterGame: () => void;
  onEditMetadata?: () => void;
  onShowMetadata?: () => void;
  onRemoveMetadata?: () => void;
  onRefetch?: () => void;
  onError?: () => void;
  enterLoading?: boolean;
}

export const GameActions: React.FC<Props> = ({
  game,
  canEnterGame,
  onEnterGame,
  onEditMetadata,
  onShowMetadata,
  onRemoveMetadata,
  onRefetch,
  enterLoading,
}) => {
  const classes = useStyles();

  const currentPlayers = game?.players?.length;

  const startTimestamp = game?.start_timestamp;
  const durationBN = game?.duration;

  const canEndGame = useMemo(() => {
    if (startTimestamp && durationBN) {
      const start = startTimestamp.toNumber() * 1000;
      const duration = durationBN.toNumber() * 1000;
      return new Date().getTime() > start + duration;
    }
  }, [startTimestamp, durationBN]);

  const handleGameEndError = useCallback((error: any) => {
    if (error.data?.message) {
      setErrorMessage(error.data?.message);
    } else {
      setErrorMessage(error.message);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (onRefetch) {
      onRefetch();
    }
  }, [onRefetch]);

  const startGame = useGameStart({
    game,
    onError: handleGameEndError,
    onConfirm: handleConfirm,
  });

  const [errorMessage, setErrorMessage] = useState<string>();

  const endGame = useGameEnd({
    game,
    onError: handleGameEndError,
    onConfirm: handleConfirm,
  });

  const isMobile = useMobile();

  const handleCloseError = useCallback(() => {
    if (startGame.error !== undefined) {
      startGame.reset();
    }

    if (endGame.error !== undefined) {
      endGame.reset();
    }
    setErrorMessage(undefined);
  }, [startGame, endGame]);

  const isCanEndGameEnabled =
    game?.started && !game?.finished && !game?.aborted && canEndGame;

  const isEnterGameEnabled =
    currentPlayers !== undefined &&
    currentPlayers >= 2 &&
    !game?.started &&
    !canEnterGame;

  const showButtons =
    canEnterGame ||
    isCanEndGameEnabled ||
    isEnterGameEnabled ||
    onEnterGame !== undefined ||
    onEditMetadata !== undefined ||
    onShowMetadata !== undefined;

  if (showButtons) {
    return (
      <Grid container spacing={4}>
        {errorMessage && (
          <Grid item xs={12}>
            <Alert severity='error' onClose={handleCloseError}>
              {errorMessage}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid
            container
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'>
            <Grid item>
              <Grid container spacing={2}>
                {onEditMetadata && (
                  <Grid item>
                    <Button startIcon={<Edit />} onClick={onEditMetadata}>
                      <IntlMessages
                        id='coinLeague.editMetadata'
                        defaultMessage='Edit Metadata'
                      />
                    </Button>
                  </Grid>
                )}
                {onShowMetadata && (
                  <Grid item>
                    <Button
                      startIcon={<CrownIcon className={classes.icon} />}
                      onClick={onShowMetadata}>
                      <IntlMessages
                        id='coinLeague.viewJackpot'
                        defaultMessage='View Jackpot'
                      />
                    </Button>
                  </Grid>
                )}
                {onRemoveMetadata && (
                  <Grid item>
                    <Button startIcon={<Delete />} onClick={onRemoveMetadata}>
                      <IntlMessages
                        id='coinLeague.removeJackpot'
                        defaultMessage='Remove Jackpot'
                      />
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              {canEnterGame && (
                <Button
                  fullWidth={isMobile}
                  disabled={enterLoading}
                  onClick={onEnterGame}
                  variant='contained'
                  color='primary'
                  startIcon={
                    enterLoading ? (
                      <CircularProgress size='1rem' color='inherit' />
                    ) : (
                      <GroupAddIcon />
                    )
                  }>
                  <IntlMessages
                    id='coinLeague.enterGame'
                    defaultMessage='Enter Game'
                  />
                </Button>
              )}
              {isCanEndGameEnabled && (
                <Button
                  fullWidth={isMobile}
                  startIcon={
                    endGame.isLoading ? (
                      <CircularProgress size='1rem' color='inherit' />
                    ) : (
                      <StopIcon />
                    )
                  }
                  disabled={endGame.isLoading}
                  onClick={endGame.end}
                  variant='contained'
                  color='primary'>
                  <IntlMessages
                    id='coinLeague.endGame'
                    defaultMessage='End Game'
                  />
                </Button>
              )}
              {isEnterGameEnabled && (
                <Button
                  disabled={startGame.isLoading}
                  onClick={startGame.start}
                  variant='contained'
                  color='primary'
                  fullWidth={isMobile}
                  startIcon={
                    startGame.isLoading ? (
                      <CircularProgress size='1rem' color='inherit' />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }>
                  <IntlMessages
                    id='coinLeague.startGame'
                    defaultMessage='Start Game'
                  />
                </Button>
              )}
              {false && (
                <Button variant='contained' color='primary'>
                  <IntlMessages
                    id='coinLeague.abortGame'
                    defaultMessage='Abort Game'
                  />
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return null;
};

export default GameActions;
