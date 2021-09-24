import React, {useCallback, useMemo, useState} from 'react';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import { useWeb3 } from 'hooks/useWeb3';
import { ExplorerURL } from 'modules/CoinsLeague/utils/constants';
import { ChainId } from 'types/blockchain';

interface Props {
  address?: string;
}

export const EndGame = (props: Props) => {
  const {address} = props;
  const {chainId} = useWeb3();
  const {onEndGameCallback, game, refetch} = useCoinsLeague(address);
  const [tx, setTx] = useState<string>();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  const canEndGame = useMemo(()=> {
    if(game){
      const start = game?.start_timestamp.toNumber() * 1000;
      const duration = game.duration.toNumber() * 1000;
     return  new Date().getTime() > start + duration; 
    }

  },[game?.start_timestamp])

  const onEndGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
        };
        const onConfirmTx = () => {
          setSubmitState(SubmitState.Confirmed);
          refetch();
        };
        const onError = () => {
          setSubmitState(SubmitState.Error);
          setTimeout(() => {
            setSubmitState(SubmitState.None);
          }, 3000);
        };

        onEndGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [game, refetch],
  );

  return (
    <Paper>
      <Box m={2}>
        <Grid container spacing={4} justifyContent={'flex-end'}>
          <Grid item xs md={3}>
            <Box m={2}>
              <Grid
                container
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}>
                <Grid item xs={12} md={12}>
                  <Box display={'flex'} justifyContent={'center'}>
                  {tx && (
                    <Button variant={'text'} onClick={goToExplorer}>
                      {submitState === SubmitState.Submitted
                        ? 'Submitted Tx'
                        : submitState === SubmitState.Error
                        ? 'Tx Error' :
                        submitState === SubmitState.Confirmed ? 
                         'Confirmed Tx' : ''}
                    </Button>
                  )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    onClick={onEndGame}
                    fullWidth
                    disabled={!canEndGame ||  submitState !== SubmitState.None}
                    variant={'contained'}
                    color={
                      submitState === SubmitState.Error ? 'default' : 'primary'
                    }>
                    <ButtonState
                      state={submitState}
                      defaultMsg={'END GAME'}
                      confirmedMsg={'Game Finished'}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
