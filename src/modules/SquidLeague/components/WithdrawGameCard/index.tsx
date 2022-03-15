import React, {useCallback, useMemo} from 'react';

import {Grid, Button, makeStyles} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {useToggler} from 'hooks/useToggler';

import {useGameAddress} from 'modules/SquidLeague/hooks/useGameAddress';
import {useOnChainGameData} from 'modules/SquidLeague/hooks/useOnChainGameData';
import {useOnChainCurrentRoundGame} from 'modules/SquidLeague/hooks/useOnChainCurrentRoundGame';

import {GameState} from 'modules/SquidLeague/utils/types';

import WithdrawGameDialog from 'modules/SquidLeague/components/dialogs/WithdrawGameDialog';

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

  const withdrawGameToggler = useToggler(false);

  const handleCloseWithdrawGameDialog = useCallback(() => {
    withdrawGameToggler.toggle();
  }, [withdrawGameToggler]);

  const gameState = gameDataQuery.data?.gameState;
  const round = gameDataQuery.data?.round;
  const canWeWithdrawGame = useMemo(() => {
    if (round) {
      return gameState === GameState.Finished && round.toNumber() === 6;
    }
    return false;
  }, [gameState, round]);

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
        <Grid item xs={12} sm={4}>
          <Grid container spacing={4}>
            {canWeWithdrawGame && (
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={() => withdrawGameToggler.toggle()}
                      startIcon={<ArrowDownwardIcon />}
                      variant='outlined'
                      color='primary'>
                      <IntlMessages
                        id='squidLeague.endGame'
                        defaultMessage={'Get Prize'}
                      />
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
