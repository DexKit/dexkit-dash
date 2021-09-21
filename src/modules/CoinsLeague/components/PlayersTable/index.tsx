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

import {MumbaiPriceFeeds} from 'modules/CoinsLeague/constants';
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';
import {ButtonState, SubmitState} from '../ButtonState';
import Button from '@material-ui/core/Button';
import {useWeb3} from 'hooks/useWeb3';
import {ExplorerURL} from 'modules/CoinsLeague/utils/constants';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {BigNumber} from '@ethersproject/bignumber';

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
  claimed: boolean;
  showClaim?: boolean;
  score: number;
}

interface Props {
  data?: IRow[];
  address: string;
  winner?: any;
  account?: string;
}

const getIconByCoin = (coin: string) => {
  return (
    MumbaiPriceFeeds.find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (coin: string) => {
  return (
    MumbaiPriceFeeds.find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const truncHash = (hash: string): string => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const USD_POWER = BigNumber.from(10 ** 8);

function PlayersTable(props: Props): JSX.Element {
  const {address, account, winner, data} = props;
  const classes = useStyles();
  const {chainId} = useWeb3();
  const [coins, setCoins] = useState([]);
  const [tx, setTx] = useState<string>();
  const {
    onClaimCallback,
    refetch,
    onWithdrawCallback,
    game,
    currentPrices,
    allFeeds,
  } = useCoinsLeague(address);
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const [submitWithdrawState, setSubmitWithdrawState] = useState<SubmitState>(
    SubmitState.None,
  );

  const isWinner = useMemo(() => {
    if (account && winner) {
      return winner.address.toLowerCase() === account.toLowerCase();
    }
    return false;
  }, [account, winner]);

  const canClaim = useMemo(() => {
    if (isWinner && winner && data && data.length === 1) {
      return !winner.claimed;
    }
  }, [isWinner, winner, data]);

  const canWithdraw = useMemo(() => {
    if (game) {
      return game.aborted;
    }
  }, [game]);

  const claimed = useMemo(() => {
    if (isWinner && winner && data && data.length === 1) {
      return winner.claimed;
    }
  }, [isWinner, winner, data]);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback((ev: any) => {
    setOpenViewDialog(false);
  }, []);

  const onViewCoins = useCallback((c: any) => {
    setCoins(c);
    setOpenViewDialog(true);
  }, []);

  const onClaimGame = useCallback(
    (ev: any) => {
      if (address && account) {
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

        onClaimCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [address, account, refetch, onClaimCallback],
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
  // We need to this to calculate the monster of score in real time
  const playerRowData = useMemo(() => {
    if (game && !game.finished && game.started && !game.aborted) {
      return props?.data?.map((d) => {
        const currentFeedPrice = currentPrices?.filter((f) =>
          d.coins.map((c) => c.toLowerCase()).includes(f.feed.toLowerCase()),
        );
        if (currentFeedPrice?.length) {
          const prices = currentFeedPrice.map((f) => {
            const startFeed = allFeeds?.find(
              (al) => al.address.toLowerCase() === f.feed.toLowerCase(),
            );
            return {
              endPrice: f.price.div(USD_POWER).toNumber() as number,
              startPrice: startFeed?.start_price
                .div(USD_POWER)
                .toNumber() as number,
            };
          });
          const scores = prices.map(
            (p) => (p.endPrice - p.startPrice) / p.endPrice,
          );
          const score = scores.reduce((p, c) => p + c) * 100;
          return {
            ...d,
            score,
          };
        } else {
          return {
            ...d,
            score: d.score / 10,
          };
        }
      });
    }
    return props?.data?.map((d) => {
      return {
        ...d,
        score: d.score / 10,
      }
    });
  }, [props.data, game, currentPrices, allFeeds]);

  return (
    <>
      <ViewCoinLeagueDialog
        open={openViewDialog}
        onClose={onCloseViewCoinsDialog}
        coins={coins}
        address={address}
      />
      <TableContainer className={classes.container} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableCell className={classes.header}>Position</TableCell>
            <TableCell className={classes.header}>Coins</TableCell>
            <TableCell className={classes.header}>Score</TableCell>
            {(canClaim || claimed) && (
              <TableCell className={classes.header}>Action</TableCell>
            )}
          </TableHead>

          <TableBody>
            {!props.data?.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className={classes.noBorder}
                  style={{textAlign: 'center', color: '#ffa552'}}>
                  <Typography variant='h5'>No data was found!</Typography>
                </TableCell>
              </TableRow>
            )}
            {playerRowData
              ?.sort((a, b) => b.score - a.score)
              .map((row, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Chip className={classes.chip} label={`${i + 1}º`} />
                      <Typography style={{color: '#fff'}}>
                        &nbsp; {truncHash(row.hash)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <AvatarGroup max={10} spacing={17}>
                        {row?.coins.map((coin) => (
                          <Avatar
                            className={classes.chip}
                            src={getIconByCoin(coin)}
                            style={{height: 35, width: 35}}>
                            {getIconSymbol(coin)}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <IconButton onClick={() => onViewCoins(row.coins)}>
                        <RemoveRedEye
                          style={{
                            color: '#fff',
                            marginLeft: 10,
                            alignSelf: 'center',
                          }}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Chip
                      clickable
                      style={{
                        background: '#343A49',
                        color: row.score > 0 ? '#0e0' : '#e00',
                      }}
                      label={`${row.score > 0 ? '+' : ''}${row.score?.toFixed(
                        2,
                      )}%`}
                    />
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
                              disabled={submitState === SubmitState.Confirmed}
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
                                  : submitWithdrawState ===
                                    SubmitState.Confirmed
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
                              disabled={
                                submitWithdrawState === SubmitState.Confirmed
                              }
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PlayersTable;
