import React, {useCallback, useMemo, useState} from 'react';
import {useCoinLeagues, useCoinLeaguesCallbacks} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {useWeb3} from 'hooks/useWeb3';
import {ExplorerURL, IS_SUPPORTED_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import Typography from '@material-ui/core/Typography';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import { useNotifications } from 'hooks/useNotifications';

interface Props {
  id?: string;
}

export const EndGame = (props: Props) => {
  const {id} = props;
  const {chainId} = useWeb3();
  const {game, refetch, refetchWinner} = useCoinLeagues(id);
  const [tx, setTx] = useState<string>();
  const {createNotification} = useNotifications();
  const [submitState, setSubmitState] = useState<SubmitState>(
    SubmitState.None,
  );
  const {onEndGameCallback } = useCoinLeaguesCallbacks(game?.address);

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)) {
        // @ts-ignore
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );
  const startTimestamp = game?.start_timestamp;
  const durationBN = game?.duration;

  const canEndGame = useMemo(() => {
    if (startTimestamp && durationBN) {
      const start = startTimestamp.toNumber() * 1000;
      const duration = durationBN.toNumber() * 1000;
      return new Date().getTime() > start + duration;
    }
  }, [startTimestamp, durationBN]);

   const onEndGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
          createNotification({
            title: 'Ended Game',
            body: `Ended Game ${id}`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, tx),
            urlCaption: 'View transaction',
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: tx,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        };
        const onConfirmTx = () => {
          setSubmitState(SubmitState.Confirmed);
          refetch();
          refetchWinner();
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
    [game, refetch, onEndGameCallback, chainId],
  );

  return (
    <>
      {canEndGame && (
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
                              ? 'Tx Error'
                              : submitState === SubmitState.Confirmed
                              ? 'Confirmed Tx'
                              : ''}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    <Button
                    onClick={onEndGame}
                    fullWidth
                    disabled={!canEndGame ||  submitState !== SubmitState.None || !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)}
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

                      <Paper>
                        <Box display={'flex'} justifyContent={'center'} p={2}>
                          <Typography>
                            &nbsp; Game will auto end soon or you can manually end it
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </>
  );
};
