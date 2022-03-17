import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {CircularProgress, Divider, useTheme} from '@material-ui/core';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import TableContainer from '@material-ui/core/TableContainer';

import {makeStyles} from '@material-ui/core/styles';

import RemoveRedEye from '@material-ui/icons/RemoveRedEyeOutlined';

import {PriceFeeds} from 'modules/CoinLeagues/constants';
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {useWeb3} from 'hooks/useWeb3';
import {
  ExplorerURL,
  GET_LEAGUES_CHAIN_ID,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {GameType} from 'types/coinsleague';
import {useMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
import {getTransactionScannerUrl} from 'utils/blockchain';
import UserProfileItem from '../UserProfileItem';
import {GameProfile} from 'modules/CoinLeagues/utils/types';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {truncateAddress} from 'utils';
import {List} from '@material-ui/core';
import ViewCoinListItem from '../ViewCoinsModal/ViewCoinItem';

import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import {CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: 6,
    border: 'none',
    width: '97%',
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    borderRadius: 6,
    justifyContent: 'center',
    border: '1px solid #7A8398',
    padding: theme.spacing(1),
  },
  innerContent: {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
  chip: {
    border: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#ffa552',
    background: '#343A49',
  },
  header: {
    border: 'none',
    color: '#8F96A7',
  },
  noBorder: {
    border: 'none',
  },
}));

interface IRow {
  hash: string;
  coins: string[];
  captainCoin: string;
  score: number;
}

interface Props {
  data?: IRow[];
  id: string;
  type?: GameType;
  winner?: any;
  account?: string;
  profile?: GameProfile;
}

const getIconByCoin = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic | ChainId.Binance,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic | ChainId.Binance,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const USD_POWER_NUMBER = 10 ** 8;

function OnePlayerTable(props: Props): JSX.Element {
  const {id, account, winner, data, type, profile} = props;
  const classes = useStyles();
  const {messages} = useIntl();
  const {chainId} = useWeb3();
  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [tx, setTx] = useState<string>();
  const accountLabels = useLabelAccounts();
  const {createNotification} = useNotifications();
  const {
    onClaimCallback,
    refetch,
    onWithdrawCallback,
    game,
    currentPrices,
    allFeeds,
    amountOnContract,
  } = useCoinLeagues(id);

  const {isBalanceVisible} = useIsBalanceVisible();

  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const [submitWithdrawState, setSubmitWithdrawState] = useState<SubmitState>(
    SubmitState.None,
  );

  const {multiplier, loadingMultiplier, tooltipMessage} = useMultipliers(id);

  const isWinner = useMemo(() => {
    if (account && winner) {
      return winner.address.toLowerCase() === account.toLowerCase();
    }
    return false;
  }, [account, winner]);

  const canClaim = useMemo(() => {
    if (isWinner && winner && data) {
      return !winner.claimed;
    }
  }, [isWinner, winner, data]);

  const canWithdraw = useMemo(() => {
    if (game) {
      return game.aborted;
    }
  }, [game]);

  const alreadyWithdrawed = useMemo(() => {
    if (game && amountOnContract) {
      return game.aborted && amountOnContract.isZero();
    }
  }, [game, amountOnContract]);

  const claimed = useMemo(() => {
    if (isWinner && winner && data) {
      return winner.claimed;
    }
  }, [isWinner, winner, data]);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback(() => {
    setOpenViewDialog(false);
  }, []);

  const onViewCoins = useCallback((c: any) => {
    setOpenViewDialog(true);
  }, []);

  const handleCloseError = useCallback(() => {
    setSubmitState(SubmitState.None);
    setErrorMessage(undefined);
  }, []);

  const onClaimGame = useCallback(
    (ev: any) => {
      if (id && account && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
          createNotification({
            title: messages['app.coinLeagues.claim'] as string,
            body: `Claimed for Game ${id}`,
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
        };
        const onError = (e: any) => {
          setSubmitState(SubmitState.Error);
          if (e.message) {
            setErrorMessage(e.message);
          } else {
            setErrorMessage(String(e));
          }
        };

        onClaimCallback(account, {
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [
      id,
      account,
      refetch,
      onClaimCallback,
      chainId,
      createNotification,
      messages,
    ],
  );

  const onWithdrawGame = useCallback(
    (ev: any) => {
      if (id && account) {
        setSubmitWithdrawState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitWithdrawState(SubmitState.Submitted);
        };
        const onConfirmTx = () => {
          setSubmitWithdrawState(SubmitState.Confirmed);
          refetch();
        };
        const onError = () => {
          setSubmitWithdrawState(SubmitState.Error);
          setTimeout(() => {
            setSubmitWithdrawState(SubmitState.None);
          }, 3000);
        };

        onWithdrawCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [id, account, refetch, onWithdrawCallback],
  );

  const goToExplorer = useCallback(() => {
    if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
      window.open(`${ExplorerURL[chainId]}${tx}`);
    }
  }, [tx, chainId]);

  const playerRowData = useMemo(() => {
    if (game && !game.finished && game.started && !game.aborted) {
      return props?.data?.map((d) => {
        let label;
        const bitboyMember = GET_BITBOY_NAME(d.hash);
        if (bitboyMember) {
          label = bitboyMember.label;
        } else {
          label = accountLabels
            ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
            : d.hash;
        }
        const currentFeedPrice = currentPrices?.filter((f) =>
          d.coins
            .concat(d.captainCoin ? d.captainCoin : [])
            .map((c) => c.toLowerCase())
            .includes(f.feed.toLowerCase()),
        );

        if (currentFeedPrice?.length) {
          const prices = currentFeedPrice.map((f) => {
            const startFeed = allFeeds?.find(
              (al) => al.address.toLowerCase() === f.feed.toLowerCase(),
            );
            let multiplier = 1;

            if (
              d.captainCoin &&
              d.captainCoin.toLowerCase() === f.feed.toLowerCase()
            ) {
              const end = f.price.toNumber() / USD_POWER_NUMBER;
              const start = startFeed
                ? ((startFeed?.start_price.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0;
              if (end && start) {
                const scr = (end - start) / end;
                if (scr > 0 && type === GameType.Winner) {
                  multiplier = 1.2;
                }
                if (scr < 0 && type === GameType.Loser) {
                  multiplier = 1.2;
                }
              }
            }

            return {
              endPrice: (f.price.toNumber() / USD_POWER_NUMBER) as number,
              startPrice: startFeed
                ? ((startFeed?.start_price.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0,
              multiplier,
            };
          });

          const scores = prices
            .filter((p) => p.endPrice && p.startPrice)
            .map(
              (p) =>
                ((p.endPrice - p.startPrice) / p.endPrice) * p.multiplier * 100,
            );
          const score = scores && scores.reduce((p, c) => p + c);
          return {
            ...d,
            account: d.hash,
            hash: label,
            score,
            profile,
          };
        } else {
          return {
            ...d,
            account: d.hash,
            hash: label,
            score: d.score / 1000,
            profile,
          };
        }
      });
    }
    return props?.data?.map((d) => {
      let label;
      const bitboyMember = GET_BITBOY_NAME(d.hash);
      if (bitboyMember) {
        label = bitboyMember.label;
      } else {
        label = accountLabels
          ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
          : d.hash;
      }
      return {
        ...d,
        account: d.hash,
        hash: label,
        score: d.score / 1000,
        profile,
      };
    });
  }, [props, game, currentPrices, allFeeds, type, accountLabels, profile]);

  // We need to this to calculate the monster of score in real time
  const playerData = useMemo(() => {
    if (account && playerRowData) {
      const place = playerRowData
        .sort((a, b) => {
          if (type === GameType.Winner) {
            return b.score - a.score;
          } else {
            return a.score - b.score;
          }
        })
        .findIndex((p) => p.account.toLowerCase() === account.toLowerCase());
      const pl = playerRowData.find(
        (p) => p.account.toLowerCase() === account.toLowerCase(),
      );
      if (pl) {
        return {
          ...pl,
          place,
        };
      }
    }
  }, [playerRowData, account, type]);

  const allCoins = useMemo(() => {
    const chain = GET_LEAGUES_CHAIN_ID(chainId);

    if (
      playerData?.coins &&
      playerData?.captainCoin &&
      allFeeds &&
      allFeeds.length
    ) {
      const coinsWithFeeds = allFeeds.filter((cf) =>
        playerData?.coins
          .concat(playerData?.captainCoin)
          .map((c) => c?.toLowerCase())
          .includes(cf?.address?.toLowerCase()),
      );
      const coinsList = PriceFeeds[chain].filter((c) =>
        coinsWithFeeds
          .map((cf) => cf?.address?.toLowerCase())
          .includes(c?.address?.toLowerCase()),
      );
      return [playerData?.captainCoin]
        .concat(playerData?.coins)
        .map((c) => {
          return {
            coin: coinsList.find(
              (cl) => cl.address.toLowerCase() === c.toLowerCase(),
            ),
            isCaptain:
              c.toLowerCase() === playerData?.captainCoin.toLowerCase(),
            feed: coinsWithFeeds.find(
              (cl) => cl.address.toLowerCase() === c.toLowerCase(),
            ),
            currentFeed: currentPrices?.find(
              (cl) => cl.feed.toLowerCase() === c.toLowerCase(),
            ),
          };
        })
        .filter((c) => c.coin && c.feed) as {
        coin: CoinFeed;
        feed: CoinFeedOnChain;
        currentFeed: any;
        isCaptain: boolean;
      }[];
    }
    return [];
  }, [allFeeds, currentPrices, chainId, playerData]);

  const gameStarted = useMemo(() => {
    return game?.started && !game.finished && !game.aborted;
  }, [game]);

  return (
    <>
      <ViewCoinLeagueDialog
        open={openViewDialog}
        onClose={onCloseViewCoinsDialog}
        coins={playerData?.coins || []}
        captainCoin={playerData?.captainCoin}
        id={id}
        playerAddress={playerData?.hash}
      />
      <Paper>
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>
                <IntlMessages
                  id='coinLeague.yourCoins'
                  defaultMessage='Your Coins'
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                alignContent='center'>
                <Grid item>
                  <Chip
                    className={classes.chip}
                    label={
                      isBalanceVisible
                        ? `${(playerData?.place || 0) + 1}º`
                        : '..'
                    }
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant='body1'>
                    {playerData?.profile !== undefined
                      ? playerData.profile.username
                      : truncateAddress(playerData?.hash || '')}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => setExpanded((value) => !value)}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            {playerData && (
              <Grid item xs={12}>
                <Grid container spacing={4} justifyContent='space-between'>
                  <Grid item>
                    {playerData.coins?.length > 0 && (
                      <AvatarGroup max={10} spacing={17}>
                        {chainId &&
                          IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) &&
                          playerData?.coins.map((coin) =>
                            isBalanceVisible ? (
                              <Avatar
                                className={classes.chip}
                                src={getIconByCoin(coin, chainId)}
                                style={{height: 35, width: 35}}>
                                {getIconSymbol(coin, chainId)}
                              </Avatar>
                            ) : (
                              <Badge color={'primary'} overlap='circular'>
                                <Avatar
                                  className={classes.chip}
                                  style={{height: 35, width: 35}}
                                />
                              </Badge>
                            ),
                          )}
                      </AvatarGroup>
                    )}
                  </Grid>
                  <Grid item>
                    {isBalanceVisible ? (
                      <Chip
                        clickable
                        style={{
                          color:
                            playerData?.score > 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                        label={`${
                          playerData?.score >= 0 ? '+' : ''
                        }${playerData?.score?.toFixed(3)}%`}
                      />
                    ) : (
                      <Chip clickable label={`...%`} />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}
            {expanded && (
              <Grid item xs={12}>
                <List disablePadding>
                  {allCoins?.map((coin, index) => (
                    <ViewCoinListItem
                      coin={coin.coin}
                      feedOnchain={coin.feed}
                      currentPrice={coin.currentFeed}
                      started={gameStarted}
                      key={index}
                      isCaptain={coin.isCaptain}
                      playerAddress={playerData?.hash}
                      multipliers={multiplier}
                      tooltipMessage={tooltipMessage}
                    />
                  ))}
                </List>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {(canClaim || claimed || canWithdraw) && (
              <>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle1'>
                        <IntlMessages
                          id='coinLeague.prize'
                          defaultMessage='Prize'
                        />
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        <IntlMessages
                          id='coinLeague.congratulationsYourWonInFirstPlace'
                          defaultMessage='Congratulations, you won in 1° place'
                        />
                      </Typography>
                    </Grid>
                    {canClaim && (
                      <Grid item xs={12}>
                        <Grid
                          container
                          justifyContent='center'
                          alignContent='center'
                          alignItems='center'>
                          <Grid item xs={12}>
                            {tx && (
                              <Button onClick={goToExplorer}>
                                {submitState === SubmitState.Submitted ? (
                                  <IntlMessages id='app.coinLeagues.submittedTx' />
                                ) : submitState === SubmitState.Error ? (
                                  <IntlMessages id='app.coinLeagues.txError' />
                                ) : submitState === SubmitState.Confirmed ? (
                                  <IntlMessages id='app.coinLeagues.confirmedTx' />
                                ) : (
                                  ''
                                )}
                              </Button>
                            )}
                          </Grid>
                          {submitState === SubmitState.Error && (
                            <Grid item xs={12}>
                              <Alert
                                severity='error'
                                onClose={handleCloseError}>
                                {errorMessage}
                              </Alert>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <Button
                              onClick={onClaimGame}
                              fullWidth
                              startIcon={<CircularProgress />}
                              disabled={submitState !== SubmitState.None}
                              variant='contained'
                              color='primary'>
                              <IntlMessages
                                id='coinLeague.claim'
                                defaultMessage='Claim'
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {canWithdraw && !alreadyWithdrawed && (
                      <Grid
                        container
                        justifyContent='center'
                        alignContent='center'
                        alignItems='center'>
                        <Grid item xs={12}>
                          {tx && (
                            <Button variant={'text'} onClick={goToExplorer}>
                              {submitWithdrawState === SubmitState.Submitted ? (
                                <IntlMessages id='app.coinLeagues.submittedTx' />
                              ) : submitWithdrawState === SubmitState.Error ? (
                                <IntlMessages id='app.coinLeagues.txError' />
                              ) : submitWithdrawState ===
                                SubmitState.Confirmed ? (
                                <IntlMessages id='app.coinLeagues.confirmedTx' />
                              ) : (
                                ''
                              )}
                            </Button>
                          )}
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Button
                            onClick={onWithdrawGame}
                            fullWidth
                            variant='contained'
                            disabled={submitWithdrawState !== SubmitState.None}
                            color={
                              submitWithdrawState === SubmitState.Error
                                ? 'default'
                                : 'primary'
                            }>
                            <ButtonState
                              state={submitWithdrawState}
                              defaultMsg={
                                messages['app.coinLeagues.withdraw'] as string
                              }
                              confirmedMsg={
                                messages['app.coinLeagues.withdrawed'] as string
                              }
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    )}

                    {alreadyWithdrawed && (
                      <IntlMessages
                        id='coinLeague.withdrawed'
                        defaultMessage='Withdrawed'
                      />
                    )}
                  </Grid>
                </Grid>
                {claimed && (
                  <Grid item xs={12}>
                    <Button variant='contained' disabled fullWidth>
                      <IntlMessages id='app.coinLeagues.claimed' />
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default OnePlayerTable;
