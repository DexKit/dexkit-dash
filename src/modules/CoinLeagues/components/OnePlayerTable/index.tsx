import React, {useCallback, useMemo, useState} from 'react';

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
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {ethers} from 'ethers';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {GameType} from 'types/coinsleague';
import {useMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
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
  address: string;
  winner?: any;
  account?: string;
}

const getIconByCoin = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const truncHash = (hash: string): string => {
  if (ethers.utils.isHexString(hash)) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  } else {
    return hash;
  }
};

const USD_POWER_NUMBER = 10 ** 8;

function OnePlayerTable(props: Props): JSX.Element {
  const {address, account, winner, data} = props;
  const classes = useStyles();
  const {chainId} = useWeb3();
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
  } = useCoinLeagues(address);

  const {isBalanceVisible} = useIsBalanceVisible();

  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const [submitWithdrawState, setSubmitWithdrawState] = useState<SubmitState>(
    SubmitState.None,
  );

  const {multiplier, loadingMultiplier, tooltipMessage} =
    useMultipliers(address);

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

  const claimed = useMemo(() => {
    if (isWinner && winner && data) {
      return winner.claimed;
    }
  }, [isWinner, winner, data]);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback((ev: any) => {
    setOpenViewDialog(false);
  }, []);

  const onViewCoins = useCallback((c: any) => {
    setOpenViewDialog(true);
  }, []);

  const onClaimGame = useCallback(
    (ev: any) => {
      if (address && account && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          setSubmitState(SubmitState.Submitted);
          createNotification({
            title: 'Claim',
            body: `Claimed for Game ${address}`,
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
        const onError = () => {
          setSubmitState(SubmitState.Error);
          setTimeout(() => {
            setSubmitState(SubmitState.None);
          }, 3000);
        };

        onClaimCallback(account, {
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [address, account, refetch, onClaimCallback, chainId],
  );
  const onWithdrawGame = useCallback(
    (ev: any) => {
      if (address && account) {
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
    [address, account, refetch, onWithdrawCallback],
  );

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );
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
            return {
              endPrice: (f.price.toNumber() / USD_POWER_NUMBER) as number,
              startPrice: startFeed
                ? ((startFeed?.start_price.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0,
              multiplier: 1,
            };
          });

          const scores = prices
            .filter((p) => p.endPrice && p.startPrice)
            .map(
              (p) =>
                ((p.endPrice - p.startPrice) / p.endPrice) * p.multiplier * 100,
            );
          const score = scores.reduce((p, c) => p + c) / scores.length;
          return {
            ...d,
            account: d.hash,
            hash: label,
            score,
          };
        } else {
          return {
            ...d,
            account: d.hash,
            hash: label,
            score: d.score / 1000,
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
      };
    });
  }, [props.data, game, currentPrices, allFeeds]);

  // We need to this to calculate the monster of score in real time
  const playerData = useMemo(() => {
    if (account && playerRowData) {
      const place = playerRowData
        .sort((a, b) => {
          if (game?.game_type === GameType.Winner) {
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
  }, [playerRowData, account]);

  return (
    <>
      <ViewCoinLeagueDialog
        open={openViewDialog}
        onClose={onCloseViewCoinsDialog}
        coins={playerData?.coins || []}
        captainCoin={playerData?.captainCoin}
        address={address}
        playerAddress={playerData?.hash}
      />
      <TableContainer className={classes.container} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header}>Position</TableCell>
              <TableCell className={classes.header}>Captain</TableCell>
              {playerData?.coins && playerData?.coins.length > 0 && (
                <TableCell className={classes.header}>Coins</TableCell>
              )}
              <TableCell className={classes.header}>Score</TableCell>
              {(canClaim || claimed) && (
                <TableCell className={classes.header}>Action</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {!playerData && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className={classes.noBorder}
                  style={{textAlign: 'center', color: '#ffa552'}}>
                  <Typography variant='h5'>No data was found!</Typography>
                </TableCell>
              </TableRow>
            )}
            {playerData && (
              <TableRow>
                <TableCell className={classes.noBorder}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Chip
                      className={classes.chip}
                      label={
                        isBalanceVisible ? `${playerData.place + 1}º` : '..'
                      }
                    />

                    {/*data && <Chip className={classes.chip} label={`${1}º`} />*/}

                    <Typography style={{color: '#fff'}}>
                      &nbsp;{' '}
                      {isBalanceVisible
                        ? truncHash(playerData?.hash)
                        : '*****...****'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell className={classes.noBorder}>
                  <Box display={'flex'} alignItems={'center'}>
                    {chainId &&
                      IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) &&
                      playerData?.captainCoin && (
                        <>
                          {isBalanceVisible ? (
                            <Tooltip title={tooltipMessage(account)}>
                              <Badge
                                color={'primary'}
                                overlap='circular'
                                badgeContent={
                                  !loadingMultiplier && multiplier(account)
                                }>
                                <Avatar
                                  className={classes.chip}
                                  src={getIconByCoin(
                                    playerData?.captainCoin,
                                    chainId,
                                  )}
                                  style={{height: 35, width: 35}}>
                                  {getIconSymbol(
                                    playerData?.captainCoin,
                                    chainId,
                                  )}
                                </Avatar>
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Badge color={'primary'} overlap='circular'>
                              <Avatar
                                className={classes.chip}
                                style={{height: 35, width: 35}}></Avatar>
                            </Badge>
                          )}
                          {playerData?.coins.length === 0 && (
                            <IconButton
                              onClick={() => onViewCoins(playerData.coins)}>
                              <RemoveRedEye
                                style={{
                                  color: '#fff',
                                  marginLeft: 10,
                                  alignSelf: 'center',
                                }}
                              />
                            </IconButton>
                          )}
                        </>
                      )}
                  </Box>
                </TableCell>

                {playerData?.coins.length > 0 && (
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
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
                                  style={{height: 35, width: 35}}></Avatar>
                              </Badge>
                            ),
                          )}
                      </AvatarGroup>
                      {playerData?.coins && playerData?.coins.length > 0 && (
                        <IconButton
                          onClick={() => onViewCoins(playerData.coins)}>
                          <RemoveRedEye
                            style={{
                              color: '#fff',
                              marginLeft: 10,
                              alignSelf: 'center',
                            }}
                          />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}

                <TableCell className={classes.noBorder}>
                  {isBalanceVisible ? (
                    <Chip
                      clickable
                      style={{
                        background: '#343A49',
                        color: playerData?.score > 0 ? '#0e0' : '#e00',
                      }}
                      label={`${
                        playerData?.score >= 0 ? '+' : ''
                      }${playerData?.score?.toFixed(3)}%`}
                    />
                  ) : (
                    <Chip clickable label={`...%`} />
                  )}
                </TableCell>

                {(canClaim || claimed || canWithdraw) && (
                  <TableCell className={classes.noBorder}>
                    {canClaim && (
                      <Grid
                        container
                        justifyContent={'center'}
                        alignContent={'center'}
                        alignItems={'center'}>
                        <Grid item xs={12} md={12}>
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
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Button
                            onClick={onClaimGame}
                            fullWidth
                            disabled={submitState !== SubmitState.None}
                            variant={'contained'}
                            color={
                              submitState === SubmitState.Error
                                ? 'default'
                                : 'primary'
                            }>
                            <ButtonState
                              state={submitState}
                              defaultMsg={'CLAIM'}
                              confirmedMsg={'Claimed'}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                    {canWithdraw && (
                      <Grid
                        container
                        justifyContent={'center'}
                        alignContent={'center'}
                        alignItems={'center'}>
                        <Grid item xs={12} md={12}>
                          {tx && (
                            <Button variant={'text'} onClick={goToExplorer}>
                              {submitWithdrawState === SubmitState.Submitted
                                ? 'Submitted Tx'
                                : submitWithdrawState === SubmitState.Error
                                ? 'Tx Error'
                                : submitWithdrawState === SubmitState.Confirmed
                                ? 'Confirmed Tx'
                                : ''}
                            </Button>
                          )}
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Button
                            onClick={onWithdrawGame}
                            fullWidth
                            variant={'contained'}
                            disabled={submitWithdrawState !== SubmitState.None}
                            color={
                              submitWithdrawState === SubmitState.Error
                                ? 'default'
                                : 'primary'
                            }>
                            <ButtonState
                              state={submitWithdrawState}
                              defaultMsg={'WITHDRAW'}
                              confirmedMsg={'Withdrawed'}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                    {claimed && 'Claimed'}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default OnePlayerTable;
