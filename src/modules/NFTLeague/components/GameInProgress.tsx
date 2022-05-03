import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Hidden,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import React, {useCallback, useMemo, useState} from 'react';
import {useModuleStyle} from '../styles';
import {PlayerCoinPaper} from './PlayerCoinPaper';

import {ReactComponent as FlashIcon} from '../assets/flash.svg';
import {useWeb3} from 'hooks/useWeb3';
import {useGameOnChain} from '../hooks/useGameOnChain';
import {GameType} from '../utils/types';
import {ethers} from 'ethers';
import JoinGameDialog from './JoinGameDialog';
import {useToggler} from 'hooks/useToggler';
import {useBattleFactoryCallbacks} from '../hooks/useBattleFactoryCallbacks';
import {
  GET_NFT_LEAGUE_FACTORY_ADDRESS,
  NFT_LEAGUE_MULTIPLIERS,
} from '../constants';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {SelectChampionDialog} from './SelectChampionDialog';

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import StopIcon from '@material-ui/icons/Stop';

import moment from 'moment';
import {useStartGame} from '../hooks/useStartGame';
import StartGameDialog from './StartGameDialog';
import {useAbortGame} from '../hooks/useAbortGame';
import AbortGameDialog from './AbortGameDialog';
import {useEndGame} from '../hooks/useEndGame';
import EndGameDialog from './EndGameDialog';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useChainInfo} from 'hooks/useChainInfo';
import {useIntl} from 'react-intl';
import {ChainId} from 'types/blockchain';
import Countdown from 'shared/components/Countdown';

import humanizeDuration from 'humanize-duration';
import ShareGameDialog from './ShareGameDialog';
import {useMobile} from 'hooks/useMobile';
import {Share} from '@material-ui/icons';

interface Props {
  id: string;
}

export const GameInProgress: React.FC<Props> = ({id}) => {
  const classes = useModuleStyle();

  const {createNotification} = useNotifications();

  const {data, refetch} = useGameOnChain(id);

  const {messages} = useIntl();

  const {getTransactionScannerUrl} = useChainInfo();
  const {chainId, coinSymbol} = useLeaguesChainInfo();

  const handleSubmitStartMutation = useCallback(
    (hash: string) => {
      createNotification({
        title: messages['nftLeague.startingNFTLeagueGame'] as string,
        body: messages['nftLeague.startingGame'] as string,
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId as ChainId, hash),
        urlCaption: messages['nftLeague.viewTransaction'] as string,
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: hash,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    },
    [messages, createNotification, getTransactionScannerUrl, chainId],
  );

  const handleSubmitAbortMutation = useCallback(
    (hash: string) => {
      createNotification({
        title: messages['nftLeague.abortingNFTLeagueGame'] as string,
        body: messages['nftLeague.abortingGame'] as string,
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId as ChainId, hash),
        urlCaption: messages['nftLeague.viewTransaction'] as string,
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: hash,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    },
    [messages, createNotification, getTransactionScannerUrl, chainId],
  );

  const handleSubmitEndMutation = useCallback(
    (hash: string) => {
      createNotification({
        title: messages['nftLeague.endingNFTLeagueGame'] as string,
        body: messages['nftLeague.endingGame'] as string,
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId as ChainId, hash),
        urlCaption: messages['nftLeague.viewTransaction'] as string,
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: hash,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    },
    [messages, createNotification, getTransactionScannerUrl, chainId],
  );

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  const startGameMutation = useStartGame(
    chainId,
    handleSubmitStartMutation,
    handleRefetch,
  );

  const abortGameMutation = useAbortGame(
    chainId,
    handleSubmitAbortMutation,
    handleRefetch,
  );

  const endGameMutation = useEndGame(
    chainId,
    handleSubmitEndMutation,
    handleRefetch,
  );

  const {account} = useWeb3();

  const [errorMessage, setErrorMessage] = useState<string>();

  const [isBittokenCoin, setIsBittokenCoin] = useState(false);
  const [bittValue, setBittValue] = useState(0);
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    process.env.NODE_ENV === 'development' ? '24' : undefined,
  );
  const [selectedMultiplier, setSelectedMultiplier] = useState(
    NFT_LEAGUE_MULTIPLIERS[0],
  );

  const [loading, setLoading] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const [transactionHash, setTransactionHash] = useState<string>();

  const joinGameToggler = useToggler();

  const selectTokenToggler = useToggler();
  const startGameToggler = useToggler();
  const abortGameToggler = useToggler();
  const endGameToggler = useToggler();

  const battleFactory = useBattleFactoryCallbacks(
    GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
  );

  const handleChangeBittValue = useCallback((e: any) => {
    setBittValue(e.target.value);
  }, []);

  const handleJoinGame = useCallback(
    (multiplier: number) => {
      setSelectedMultiplier(multiplier);
      joinGameToggler.set(true);
    },
    [joinGameToggler],
  );

  const handleCloseCreateDialog = useCallback(() => {
    joinGameToggler.set(false);
    setLoading(false);
    setTransactionHash(undefined);
    setTransactionConfirmed(false);
    setErrorMessage(undefined);
  }, [joinGameToggler]);

  const handleCloseStartGameDialog = useCallback(() => {
    startGameToggler.set(false);

    startGameMutation.reset();
  }, [startGameToggler, startGameMutation]);

  const handleConfirmJoinGame = useCallback(() => {
    setLoading(true);

    const onSubmit = (hash: string) => {
      setTransactionHash(hash);
    };

    const onConfirmation = () => {
      setLoading(false);
      setTransactionConfirmed(true);
      refetch();
    };

    const onError = (err: Error) => {
      setErrorMessage(err.message);
      setLoading(false);
    };

    if (data?.entry !== undefined && selectedToken !== undefined) {
      battleFactory.onJoinGameCallback(
        parseInt(id),
        parseInt(selectedToken),
        bittValue,
        selectedMultiplier,
        data?.entry,
        {
          onConfirmation,
          onSubmit,
          onError,
        },
      );
    }
  }, [
    battleFactory,
    data,
    selectedMultiplier,
    selectedToken,
    bittValue,
    id,
    refetch,
  ]);

  const handleCloseDialog = useCallback(() => {
    selectTokenToggler.set(false);
  }, [selectTokenToggler]);

  const handleSelectChampion = useCallback(() => {
    selectTokenToggler.set(true);
  }, [selectTokenToggler]);

  const handleSelect = useCallback(
    (asset: {
      contractAddress: string;
      tokenId: string;
      image: string;
      rarity?: number;
    }) => {
      selectTokenToggler.set(false);
      setSelectedToken(asset.tokenId);

      if (asset.rarity === 0) {
        setIsBittokenCoin(true);
      } else {
        setIsBittokenCoin(false);
      }
    },
    [selectTokenToggler],
  );

  const handleClearChampion = useCallback(() => {
    setSelectedToken(undefined);
  }, []);

  const handleConfirmStartGame = useCallback(() => {
    startGameMutation.mutate(parseInt(id));
  }, [startGameMutation, id]);

  const handleStartGame = useCallback(() => {
    startGameToggler.set(true);
  }, [startGameToggler]);

  const handleCloseAbortGame = useCallback(() => {
    abortGameToggler.set(false);
    abortGameMutation.reset();
  }, [abortGameToggler, abortGameMutation]);

  const handleConfirmAbortGame = useCallback(() => {
    abortGameMutation.mutate(parseInt(id));
  }, [abortGameMutation, id]);

  const handleAbortGame = useCallback(() => {
    abortGameToggler.set(true);
  }, [abortGameToggler]);

  const handleCloseEndGame = useCallback(() => {
    endGameToggler.set(false);
    endGameMutation.reset();
  }, [endGameToggler, endGameMutation]);

  const handleConfirmEndGame = useCallback(() => {
    endGameMutation.mutate(parseInt(id));
  }, [endGameMutation, id]);

  const handleEndGame = useCallback(() => {
    endGameToggler.set(true);
  }, [endGameToggler]);

  const canFinhishGame = useMemo(() => {
    if (data?.finished === true || data?.started === false) {
      return false;
    }

    if (data?.start_timestamp && data?.duration) {
      const endTimestap = moment.unix(
        data?.start_timestamp.add(data?.duration).toNumber(),
      );

      if (moment().isAfter(endTimestap)) {
        return true;
      }
    }

    return false;
  }, [data]);

  const isMobile = useMobile();

  const shareDialogToggler = useToggler();

  const handleCloseShareDialog = useCallback(() => {
    shareDialogToggler.set(false);
  }, [shareDialogToggler]);

  const handleShareGame = useCallback(
    (id) => {
      shareDialogToggler.set(true);
    },
    [shareDialogToggler],
  );

  return (
    <>
      <ShareGameDialog
        dialogProps={{
          open: shareDialogToggler.show,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
          fullScreen: isMobile,
        }}
        id={id}
      />
      {selectTokenToggler.show && (
        <SelectChampionDialog
          dialogProps={{
            open: selectTokenToggler.show,
            onClose: handleCloseDialog,
            fullWidth: true,
            maxWidth: 'lg',
          }}
          onSelect={handleSelect}
          address={account}
        />
      )}

      {startGameToggler.show && (
        <StartGameDialog
          dialogProps={{
            open: startGameToggler.show,
            onClose: handleCloseStartGameDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onConfirm={handleConfirmStartGame}
          loading={startGameMutation.isLoading}
          transactionHash={startGameMutation.hash}
          confirmed={startGameMutation.confirmed}
          gameId={parseInt(id)}
          errorMessage={
            (startGameMutation.error as Error)?.message || undefined
          }
        />
      )}

      {abortGameToggler.show && (
        <AbortGameDialog
          dialogProps={{
            open: abortGameToggler.show,
            onClose: handleCloseAbortGame,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onConfirm={handleConfirmAbortGame}
          loading={abortGameMutation.isLoading}
          transactionHash={abortGameMutation.hash}
          confirmed={abortGameMutation.confirmed}
          gameId={parseInt(id)}
          errorMessage={
            (abortGameMutation.error as Error)?.message || undefined
          }
        />
      )}

      {endGameToggler.show && (
        <EndGameDialog
          dialogProps={{
            open: endGameToggler.show,
            onClose: handleCloseEndGame,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onConfirm={handleConfirmEndGame}
          loading={endGameMutation.isLoading}
          transactionHash={endGameMutation.hash}
          confirmed={endGameMutation.confirmed}
          gameId={parseInt(id)}
          errorMessage={(endGameMutation.error as Error)?.message || undefined}
        />
      )}
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
            <Grid item xs={12}>
              <Box p={4} component={Paper}>
                <Grid
                  container
                  spacing={4}
                  alignItems='center'
                  alignContent='center'
                  justifyContent='space-between'>
                  <Grid item>
                    <Grid container spacing={4}>
                      <Grid item>
                        <Typography color='textSecondary' variant='caption'>
                          <IntlMessages id='nftLeague.id' />
                        </Typography>
                        <Typography
                          className={classes.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {id}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color='textSecondary' variant='caption'>
                          <IntlMessages id='nftLeague.status' />
                        </Typography>
                        <Typography
                          className={classes.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {data?.started === false &&
                          data?.player2 === ethers.constants.AddressZero ? (
                            <IntlMessages id='nftLeague.waitingOpponent' />
                          ) : data?.aborted === true ? (
                            <IntlMessages id='nftLeague.aborted' />
                          ) : data?.finished === true ? (
                            <IntlMessages id='nftLeague.ended' />
                          ) : (
                            <IntlMessages id='nftLeague.inProgress' />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color='textSecondary' variant='caption'>
                          <IntlMessages id='nftLeague.finalPrize' />
                        </Typography>
                        <Typography
                          className={classes.boldText}
                          color='textPrimary'
                          variant='subtitle1'>
                          {data !== undefined
                            ? ethers.utils.formatEther(
                                data.entry.mul(2).mul(90).div(100),
                              )
                            : null}{' '}
                          {coinSymbol}
                        </Typography>
                      </Grid>
                      {!data?.started && (
                        <Grid item>
                          <Typography color='textSecondary' variant='caption'>
                            <IntlMessages
                              id='nftLeague.startsIn'
                              defaultMessage='Starts in'
                            />
                          </Typography>
                          <Typography
                            className={classes.boldText}
                            color='textPrimary'
                            variant='subtitle1'>
                            {data?.start_timestamp !== undefined ? (
                              moment(
                                data?.start_timestamp?.toNumber() * 1000,
                              ).isBefore(moment()) ? (
                                <IntlMessages
                                  id='nftLeague.ready'
                                  defaultMessage='Ready'
                                />
                              ) : (
                                <Countdown
                                  startTimestamp={data?.start_timestamp.toNumber()}
                                />
                              )
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Grid>
                      )}

                      {!data?.finished && (
                        <Grid item>
                          <Typography color='textSecondary' variant='caption'>
                            {data?.started ? (
                              <IntlMessages
                                id='nftLeague.gameEndsIn'
                                defaultMessage='Ends in'
                              />
                            ) : (
                              <IntlMessages
                                id='nftLeague.gameDuration'
                                defaultMessage='Game Duration'
                              />
                            )}
                          </Typography>
                          <Typography
                            className={classes.boldText}
                            color='textPrimary'
                            variant='subtitle1'>
                            {data !== undefined ? (
                              data?.started ? (
                                moment(
                                  data?.start_timestamp?.toNumber() * 1000 +
                                    data?.duration?.toNumber() * 1000,
                                ).isAfter(moment()) ? (
                                  <Countdown
                                    startTimestamp={data?.start_timestamp.toNumber()}
                                    duration={data?.duration.toNumber()}
                                  />
                                ) : (
                                  <IntlMessages
                                    id='nftLeague.ended'
                                    defaultMessage='Ended'
                                  />
                                )
                              ) : (
                                <>
                                  {humanizeDuration(
                                    data?.duration?.toNumber() * 1000 || 0,
                                  )}
                                </>
                              )
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </Grid>
                      )}

                      <Grid item>
                        <Typography color='textSecondary' variant='caption'>
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
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hidden smUp>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Hidden>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          startIcon={<Share />}
                          variant='outlined'
                          size='large'
                          onClick={handleShareGame}>
                          <IntlMessages
                            id='nftLeague.share'
                            defaultMessage='Share'
                          />
                        </Button>
                      </Grid>
                      <Grid item>
                        {canFinhishGame && (
                          <Button
                            disabled={data?.finished}
                            onClick={handleEndGame}
                            startIcon={<StopIcon />}
                            variant='contained'
                            color='primary'
                            size='large'>
                            <IntlMessages id='nftLeague.endGame' />
                          </Button>
                        )}

                        {data?.started === false &&
                          data?.finished === false &&
                          data?.player2 !== ethers.constants.AddressZero && (
                            <Button
                              onClick={handleStartGame}
                              startIcon={<PlayCircleOutlineIcon />}
                              variant='contained'
                              color='primary'
                              size='large'>
                              <IntlMessages id='nftLeague.startGame' />
                            </Button>
                          )}
                      </Grid>
                      {data?.player2 === ethers.constants.AddressZero &&
                        data?.player1 === account &&
                        data?.aborted === false && (
                          <Grid item>
                            <Button
                              fullWidth
                              onClick={handleAbortGame}
                              startIcon={<HighlightOffIcon />}
                              variant='outlined'
                              size='large'>
                              <IntlMessages id='nftLeague.abort' />
                            </Button>
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={5}>
              <PlayerCoinPaper
                state={
                  data?.winner !== ethers.constants.AddressZero
                    ? 'ended'
                    : 'inprogress' //ENUMS
                }
                tokenId={data?.player1_coin.champion_id.toString()}
                initialPrice={data?.player1_coin.start_price}
                coinFeedAddress={data?.player1_coin.coin_feed}
                multiplier={data?.player1_coin.multiplier}
                endPrice={data?.player1_coin.end_price}
                score={data?.player1_coin.champion_score.toNumber()}
                winner={data?.winner === data?.player1}
                account={data?.player1}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box
                height='100%'
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'
                flexDirection='column'>
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
                account={data?.player2}
                state={
                  data?.winner !== ethers.constants.AddressZero
                    ? 'ended'
                    : data?.player2 === ethers.constants.AddressZero
                    ? 'waiting'
                    : 'inprogress' //enums
                }
                onSelectChampion={handleSelectChampion}
                onClearChampion={handleClearChampion}
                tokenId={
                  data?.player2 !== ethers.constants.AddressZero
                    ? data?.player2_coin.champion_id.toString()
                    : selectedToken
                }
                initialPrice={data?.player2_coin.start_price}
                coinFeedAddress={data?.player2_coin.coin_feed}
                endPrice={data?.player2_coin.end_price}
                multiplier={data?.player2_coin.multiplier}
                score={data?.player2_coin.champion_score.toNumber()}
                winner={
                  data?.player2 !== ethers.constants.AddressZero &&
                  data?.winner === data?.player2
                }
                isBittokenCoin={isBittokenCoin}
                onChangeBittValue={handleChangeBittValue}
                bittValue={bittValue}
                onJoinGame={
                  data?.player2 === ethers.constants.AddressZero &&
                  account !== data?.player1
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
