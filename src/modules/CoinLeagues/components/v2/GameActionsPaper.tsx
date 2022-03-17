import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Button, CircularProgress, Grid, Paper} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {useMobile} from 'hooks/useMobile';
import {useGameEnd} from 'modules/CoinLeagues/hooks/v2/useGameEnd';
import {useGameStart} from 'modules/CoinLeagues/hooks/v2/useGameStart';
import React, {useCallback, useState} from 'react';
import {Game} from 'types/coinsleague';

interface Props {
  game?: Game;
  canEnterGame?: boolean;
  onEnterGame: () => void;
}

export const GameActionsPaper: React.FC<Props> = ({
  game,
  canEnterGame,
  onEnterGame,
}) => {
  const currentPlayers = game?.players?.length;

  const startGame = useGameStart(game);

  const [errorMessage, setErrorMessage] = useState<string>();

  const handleGameEndError = useCallback((error: any) => {
    if (error.data?.message) {
      setErrorMessage(error.data?.message);
    } else {
      setErrorMessage(error.message);
    }
  }, []);

  const endGame = useGameEnd({game, onError: handleGameEndError});

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

  return (
    <Paper>
      <Box p={4}>
        <Grid container spacing={4}>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleCloseError}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          {canEnterGame && (
            <Grid item xs={12}>
              <Button
                fullWidth={isMobile}
                onClick={onEnterGame}
                size='large'
                variant='contained'
                color='primary'>
                <IntlMessages
                  id='coinLeague.enterGame'
                  defaultMessage='Enter Game'
                />
              </Button>
            </Grid>
          )}
          {game?.started && !game?.finished && !game?.aborted && (
            <Grid item xs={12}>
              <Button
                fullWidth={isMobile}
                startIcon={
                  endGame.isLoading ? (
                    <CircularProgress size='1rem' />
                  ) : undefined
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
            </Grid>
          )}
          {currentPlayers != undefined &&
            currentPlayers > 0 &&
            !game?.started &&
            !canEnterGame && (
              <Grid item xs={12}>
                <Button
                  onClick={startGame.start}
                  variant='contained'
                  color='primary'
                  fullWidth={isMobile}
                  startIcon={
                    startGame.isLoading ? (
                      <CircularProgress size='1rem' />
                    ) : undefined
                  }>
                  <IntlMessages
                    id='coinLeague.startGame'
                    defaultMessage='Start Game'
                  />
                </Button>
              </Grid>
            )}
          {false && (
            <Grid item xs={12}>
              <Button variant='contained' color='primary'>
                <IntlMessages
                  id='coinLeague.abortGame'
                  defaultMessage='Abort Game'
                />
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default GameActionsPaper;
