import React, {useCallback, useMemo, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TickerTapeTV from '../../components/TickerTapeTV';
import CardPrize from '../../components/CardPrize';
import SimpleCardGame from '../../components/SimpleCardGame';
import {HOME_ROUTE} from 'shared/constants/routes';
import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
} from 'react-router-dom';
import CardInfoPlayers from 'modules/CoinLeagues/components/CardInfoPlayers';
import ChartAccordion from 'modules/CoinLeagues/components/ChartAccordion';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {truncateAddress} from 'utils/text';
import {ethers} from 'ethers';
import CardInfoPlayersSkeleton from 'modules/CoinLeagues/components/CardInfoPlayers/index.skeleton';
import CardPrizeSkeleton from 'modules/CoinLeagues/components/CardPrize/index.skeleton';
import {ReactComponent as CryptocurrencyIcon} from 'assets/images/icons/cryptocurrency.svg';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import SimpleCardGameSkeleton from 'modules/CoinLeagues/components/SimpleCardGame/index.skeleton';
import {SelectCoinLeagueDialog} from 'modules/CoinLeagues/components/SelectCoins/index.modal';
import {CoinItem} from 'modules/CoinLeagues/components/CoinItem';
import IconButton from '@material-ui/core/IconButton';

import Box from '@material-ui/core/Box';
import {GameType, Player} from 'types/coinsleague';
import PlayersTable from 'modules/CoinLeagues/components/PlayersTable';
import OnePlayerTable from 'modules/CoinLeagues/components/OnePlayerTable';
import {WaitingPlayers} from 'modules/CoinLeagues/components/WaitingPlayers';
import Chip from '@material-ui/core/Chip';
import {useWeb3} from 'hooks/useWeb3';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {ChainId} from 'types/blockchain';
import {EndGame} from 'modules/CoinLeagues/components/EndGame';
import {StartGame} from 'modules/CoinLeagues/components/StartGame';
import {ButtonState} from 'modules/CoinLeagues/components/ButtonState';
import Countdown from 'modules/CoinLeagues/components/Countdown';
import {useNotifications} from 'hooks/useNotifications';

import {CopyButton} from 'shared/components/CopyButton';
import {FileCopy} from '@material-ui/icons';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import CoinsLeagueBanner from 'assets/images/banners/coinsleague.svg';
import Hidden from '@material-ui/core/Hidden';
import PlayersTableSkeleton from 'modules/CoinLeagues/components/PlayersTable/index.skeleton';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import {ShareButton} from 'shared/components/ShareButton';
import Alert from '@material-ui/lab/Alert';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useMobile} from 'hooks/useMobile';
import SwapButton from 'shared/components/SwapButton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(2),
    backgroundColor: '#1F1D2B',
  },
  chip: {
    color: '#fff',
    background: '#1F1D2B',
    border: '2px solid #2e3243',
  },
  gameTypePaper: {
    backgroundColor: '#2e3243',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));
type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;
enum SubmitState {
  None,
  WaitingWallet,
  Submitted,
  Error,
  Confirmed,
}

function GameEnter(props: Props) {
  const classes = useStyles();
  const {
    match: {params},
  } = props;
  const history = useHistory();
  const {account, chainId} = useWeb3();
  const {createNotification} = useNotifications();
  const isMobile = useMobile();

  const {address} = params;
  const {game, gameQuery, refetch, onJoinGameCallback, winner} =
    useCoinLeagues(address);
  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);

  const [selectedCoins, setSelectedCoins] = useState<CoinFeed[]>([]);
  const [captainCoin, setCaptainCoin] = useState<CoinFeed>();
  const [open, setOpen] = useState(false);
  const [isCaptainCoin, setIsChaptainCoin] = useState(false);
  const [tx, setTx] = useState<string>();

  const onOpenSelectDialog = useCallback((ev: any) => {
    setOpen(true);
  }, []);

  const onOpenSelectCaptainDialog = useCallback((ev: any) => {
    setIsChaptainCoin(true);
    setOpen(true);
  }, []);

  const player = useMemo(() => {
    if (account && game?.players && game?.players.length) {
      //TODO: We did this because sometimes it is not returning the player_address and as objects
      return game.players
        .map((p: any) => {
          return {
            coin_feeds: p[0],
            player_address: p[1],
            captain_coin: p[2],
            champion_id: p[3],
            score: p[4],
          } as Player;
        })
        .find((p) => {
          if (p?.player_address && account) {
            return p?.player_address.toLowerCase() === account.toLowerCase();
          } else {
            return false;
          }
        });
    }
  }, [account, game?.players, game]);

  const players = useMemo(() => {
    if (game?.players && game?.players.length) {
      //TODO: We did this because sometimes it is not returning the player_address and as objects
      return game.players.map((p: any) => {
        return {
          coin_feeds: p[0],
          player_address: p[1],
          captain_coin: p[2],
          champion_id: p[3],
          score: p[4],
        } as Player;
      });
    }
  }, [game?.players, game]);

  const onCloseSelectDialog = useCallback((ev: any) => {
    setIsChaptainCoin(false);
    setOpen(false);
  }, []);

  const onSelectCoin = useCallback(
    (coin: CoinFeed, isCaptain: boolean) => {
      if (isCaptain) {
        setCaptainCoin(coin);
        setIsChaptainCoin(false);
      } else {
        if (selectedCoins) {
          setSelectedCoins(selectedCoins?.concat(coin));
        } else {
          setSelectedCoins([coin]);
        }
      }
      setOpen(false);
    },
    [selectedCoins],
  );

  const onDeleteCoin = useCallback(
    (index: number) => {
      if (selectedCoins) {
        const new_coins = [...selectedCoins];
        new_coins.splice(index, 1);
        setSelectedCoins(new_coins || []);
      }
    },
    [selectedCoins],
  );

  const handleBack = useCallback(
    (ev: any) => {
      if (history.length > 0) {
        history.goBack();
      } else {
        history.push(listGamesRoute);
      }
      //history.push(listGamesRoute)
    },
    [listGamesRoute],
  );

  const onEnterGame = useCallback(
    (ev: any) => {
      if (game?.amount_to_play && captainCoin && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          createNotification({
            title: 'Join Game',
            body: `Joined Game ${game.address}`,
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

        onJoinGameCallback(
          selectedCoins.map((c) => c.address) || [],
          game?.amount_to_play.toString(),
          captainCoin?.address,
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
        );
      }
    },
    [game, selectedCoins, captainCoin, refetch, chainId],
  );

  const isLoading = useMemo(() => gameQuery.isLoading, [gameQuery.isLoading]);

  const started = useMemo(() => game?.started, [game?.started]);
  const finished = useMemo(() => game?.finished, [game?.finished]);
  const aborted = useMemo(() => game?.aborted, [game?.aborted]);
  const totalPlayers = useMemo(
    () => game?.num_players.toNumber(),
    [game?.num_players],
  );
  const currentPlayers = useMemo(() => game?.players.length, [game?.players]);
  const gameFull = useMemo(() => {
    if (totalPlayers && currentPlayers) {
      return totalPlayers === currentPlayers;
    }
  }, [started, totalPlayers, currentPlayers]);

  const isDisabled = useMemo(() => {
    return (
      selectedCoins?.length === (game?.num_coins?.toNumber() || 0) - 1 &&
      captainCoin !== undefined
    );
  }, [selectedCoins, game?.num_coins, captainCoin]);

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  return (
    <Grid container spacing={2}>
      {!IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
        <Grid item xs={12} sm={12} xl={12}>
          <Alert severity='info'>
            To play this game you need to connect your wallet to Polygon network
          </Alert>
        </Grid>
      )}

      {chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
        <SelectCoinLeagueDialog
          chainId={chainId}
          open={open}
          selectedCoins={selectedCoins.concat(captainCoin ? captainCoin : [])}
          onSelectCoin={onSelectCoin}
          onClose={onCloseSelectDialog}
          isCaptainCoin={isCaptainCoin}
        />
      )}
      <Grid item xs={12} sm={12} xl={12}>
        <TickerTapeTV />
      </Grid>

      <Grid item xs={12} sm={12} xl={12}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
            Dashboard
          </Link>
          <Link color='inherit' component={RouterLink} to={listGamesRoute}>
            Games
          </Link>
          <Link
            color='inherit'
            component={RouterLink}
            to={enterGameRoute(address)}>
            {truncateAddress(address)}
          </Link>
        </Breadcrumbs>
      </Grid>

      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={4} xl={4}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h5' style={{margin: 5}}>
            Game #{truncateAddress(address)}
            <CopyButton size='small' copyText={account || ''} tooltip='Copied!'>
              <FileCopy color='inherit' style={{fontSize: 16}} />
            </CopyButton>
          </Typography>

          {finished && <Chip label='Ended' color='primary' />}
          {aborted && <Chip label='Aborted' color='primary' />}
          {started && !finished && !aborted && (
            <Chip label='Started' color='primary' />
          )}
        </Box>
      </Grid>
      <Hidden xsDown={true}>
        <Grid item sm={5} xl={5}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={3} xl={3}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
        <Box pr={2}>
            <SwapButton/>
          </Box>
          <Box pr={2}>
            <ShareButton shareText={`Coin leagues Game #Id ${address}`} />
          </Box>
          <Box pr={2}>
            <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
          </Box>
          <Box pr={2}>
            <MaticBridgeButton />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={4}>
        {game && <SimpleCardGame {...game} />}
        {isLoading && <SimpleCardGameSkeleton />}
      </Grid>
      <Grid item xs={6} sm={4}>
        {game && (
          <CardPrize
            prizePool={Number(
              ethers.utils.formatEther(
                game.amount_to_play.mul(game.num_players),
              ),
            )}
          />
        )}
        {game && (
          <Paper className={classes.gameTypePaper}>
            <Box display={'flex'}>
              <Typography variant='subtitle2' style={{color: '#7A8398'}}>
                Game Type:
              </Typography>
              <Typography
                variant='h5'
                style={{color: '#fff', marginLeft: '20px'}}>
                {game.game_type === GameType.Winner ? 'Bull' : 'Bear'}
              </Typography>
            </Box>
          </Paper>
        )}

        {isLoading && <CardPrizeSkeleton />}
        {isLoading && (
          <Paper className={classes.gameTypePaper}>
            <Box display={'flex'}>
              <Typography variant='subtitle2' style={{color: '#7A8398'}}>
                Game Type:
              </Typography>
              <Skeleton>
                <Typography
                  variant='h5'
                  style={{color: '#fff', marginLeft: '20px'}}>
                  Winner
                </Typography>
              </Skeleton>
            </Box>
          </Paper>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {game && (
          <CardInfoPlayers
            num_players={game.num_players.toNumber()}
            current_players={game.players.length}
          />
        )}
        {game && started && !aborted && !finished && (
          <Box pt={2}>
            <Countdown address={game.address} />
          </Box>
        )}
        {isLoading && <CardInfoPlayersSkeleton />}
      </Grid>
      {/*
        <Grid item xs={12} sm={12}>
          <ChartAccordion />
        </Grid>
      */}

      {!player &&
        !isLoading &&
        !gameFull &&
        !aborted &&
        IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
          <>
            <Grid item xs={12} md={6} alignContent='space-around'>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6' style={{margin: 5}}>
                    Choose Captain Currency{' '}
                    {captainCoin === undefined ? '0' : '1'}/ 1
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    disabled={isDisabled}
                    onClick={onOpenSelectCaptainDialog}
                    startIcon={<CryptocurrencyIcon />}
                    endIcon={<ExpandMoreIcon />}
                    variant='outlined'>
                    {'Choose your Captain'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    {captainCoin && (
                      <Grid item xs={12}>
                        <CoinItem
                          coin={captainCoin}
                          handleDelete={() => setCaptainCoin(undefined)}
                          index={0}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {game?.num_coins.toNumber() !== 1 && (
              <Grid item xs={12} md={6} alignContent='space-around'>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h6' style={{margin: 5}}>
                      Choose Currencies {selectedCoins?.length}/
                      {(game?.num_coins.toNumber() || 0) - 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      disabled={isDisabled}
                      onClick={onOpenSelectDialog}
                      startIcon={<CryptocurrencyIcon />}
                      endIcon={<ExpandMoreIcon />}
                      variant='outlined'>
                      {'Choose your Coins'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      {selectedCoins?.map((c, i) => (
                        <Grid item xs={12} key={i}>
                          <CoinItem
                            coin={c}
                            key={i}
                            handleDelete={() => onDeleteCoin(i)}
                            index={i}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}

      {!player &&
        !isLoading &&
        !gameFull &&
        !aborted &&
        IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
          <Grid item xs={12} md={12}>
            <Grid container spacing={4} justifyContent={'flex-end'}>
              <Grid item xs={12} md={6}>
                <Grid container>
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
                    <Box display={'flex'} justifyContent={'center'} p={2}>
                      <Button
                        disabled={
                          !isDisabled ||
                          submitState !== SubmitState.None ||
                          !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
                        }
                        size={'large'}
                        onClick={onEnterGame}
                        variant={'contained'}
                        color={
                          submitState === SubmitState.Error
                            ? 'default'
                            : 'primary'
                        }>
                        <ButtonState
                          state={submitState}
                          defaultMsg={'ENTER GAME'}
                          confirmedMsg={'You Entered Game'}
                        />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      {player && player?.player_address && (
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='h6' style={{margin: 5}}>
                Your Coins
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <OnePlayerTable
                data={players?.map((p) => {
                  return {
                    hash: p?.player_address,
                    score: p?.score?.toNumber() || 0,
                    captainCoin: p.captain_coin,
                    coins: (p?.coin_feeds as unknown as string[]) || [],
                  };
                })}
                address={address}
                account={account}
                winner={winner}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      {players && (
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='h6' style={{margin: 5}}>
                Players
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <PlayersTable
                data={players.map((p) => {
                  return {
                    hash: p?.player_address,
                    score: p?.score?.toNumber() || 0,
                    captainCoin: p.captain_coin,
                    coins: (p?.coin_feeds as unknown as string[]) || [],
                  };
                })}
                address={address}
                finished={finished}
                hideCoins={!started}
                account={account}
                winner={winner}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      {!gameFull && (
        <Grid item xs={12}>
          <WaitingPlayers />
        </Grid>
      )}
      {isLoading && (
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Skeleton>
                <Typography variant='h6' style={{margin: 5}}>
                  Players
                </Typography>
              </Skeleton>
            </Grid>
            <Grid item xs={12}>
              <PlayersTableSkeleton players={5} />
            </Grid>
            {!gameFull && (
              <Grid item xs={12}>
                <WaitingPlayers />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {currentPlayers && currentPlayers > 0 && !started ? (
        <Grid item xs={12}>
          <StartGame address={address} />
        </Grid>
      ) : null}
      {started && !finished && !aborted && (
        <Grid item xs={12}>
          <EndGame address={address} />
        </Grid>
      )}
    </Grid>
  );
}

export default GameEnter;
