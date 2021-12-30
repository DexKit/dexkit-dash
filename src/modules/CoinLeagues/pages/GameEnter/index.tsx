import React, {useCallback, useMemo, useState, useEffect} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TickerTapeTV from '../../components/TickerTapeTV';
import CardPrize from '../../components/CardPrize';
import SimpleCardGame from '../../components/SimpleCardGame';
import {HOME_ROUTE} from 'shared/constants/routes';
import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
  useLocation,
} from 'react-router-dom';
import CardInfoPlayers from 'modules/CoinLeagues/components/CardInfoPlayers';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {ethers, BigNumber} from 'ethers';
import CardInfoPlayersSkeleton from 'modules/CoinLeagues/components/CardInfoPlayers/index.skeleton';
import CardPrizeSkeleton from 'modules/CoinLeagues/components/CardPrize/index.skeleton';
import {ReactComponent as CryptocurrencyIcon} from 'assets/images/icons/cryptocurrency.svg';
import {ChampionMetaItem, CoinFeed} from 'modules/CoinLeagues/utils/types';
import SimpleCardGameSkeleton from 'modules/CoinLeagues/components/SimpleCardGame/index.skeleton';
import {CoinItem} from 'modules/CoinLeagues/components/CoinItem';
import {ChampionItem} from 'modules/CoinLeagues/components/ChampionItem';
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
import {ChainId, SupportedNetworkType} from 'types/blockchain';
import {EndGame} from 'modules/CoinLeagues/components/EndGame';
import {StartGame} from 'modules/CoinLeagues/components/StartGame';
import {ButtonState} from 'modules/CoinLeagues/components/ButtonState';
import Countdown from 'modules/CoinLeagues/components/Countdown';
import CountdownStartsAt from 'modules/CoinLeagues/components/CountdownStartsAt';
import {useNotifications} from 'hooks/useNotifications';

import {CopyButton} from 'shared/components/CopyButton';
import {FileCopy} from '@material-ui/icons';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import Hidden from '@material-ui/core/Hidden';
import PlayersTableSkeleton from 'modules/CoinLeagues/components/PlayersTable/index.skeleton';
import Skeleton from '@material-ui/lab/Skeleton';
import {ShareButton} from 'shared/components/ShareButton';
import Alert from '@material-ui/lab/Alert';
import {
  useCoinLeaguesFactoryRoutes,
  useIsNFTGame,
} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import SwapButton from 'shared/components/SwapButton';
import {useIntl} from 'react-intl';
import {useActiveChainBalance} from 'hooks/balance/useActiveChainBalance';
import {useDispatch} from 'react-redux';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';

import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import {SelectCoinLeagueDialog} from 'modules/CoinLeagues/components/SelectCoins/index.modal';
import SelectChampionDialog from 'modules/CoinLeagues/components/SelectChampion/index.modal';
import {
  AFFILIATE_FIELD,
  CREATOR_PRIZES_ADDRESSES,
  DISABLE_CHAMPIONS_ID,
} from 'modules/CoinLeagues/constants';
import {useTokensMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
import UpdateGameMetadataModal from 'modules/CoinLeagues/components/UpdateGameMetadataModal';
import {useGameMetadata} from 'modules/CoinLeagues/hooks/useGameMetadata';
import {ReactComponent as CrownIcon} from 'assets/images/icons/crown.svg';
import ViewGameMetadataModal from 'modules/CoinLeagues/components/ViewGameMetadataModal';
import RemoveGameMetadataModal from 'modules/CoinLeagues/components/RemoveGameMetadataModal';

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
    borderRadius: 6,
    backgroundColor: '#2e3243',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  crownIconContainer: {
    color: 'yellow',
  },
}));
type Params = {
  id: string;
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
  const dispatch = useDispatch();
  const {account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const {balance} = useActiveChainBalance();

  const {search} = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const isNFTGame = useIsNFTGame();
  const {createNotification} = useNotifications();

  const {messages} = useIntl();
  const {id} = params;
  const {game, gameQuery, refetch, onJoinGameCallback, winner, addressQuery} =
    useCoinLeagues(id);
  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const gameMetaQuery = useGameMetadata(id);
  const tokensMultipliersQuery = useTokensMultipliers();

  const [selectedCoins, setSelectedCoins] = useState<CoinFeed[]>([]);
  const [captainCoin, setCaptainCoin] = useState<CoinFeed>();
  const [champion, setChampion] = useState<ChampionMetaItem>();
  const [open, setOpen] = useState(false);
  const [openUpdateGameMetadataModal, setOpenUpdateGameMetadataModal] =
    useState(false);
  const [openRemoveGameMetadataModal, setOpenRemoveGameMetadataModal] =
    useState(false);
  const [openShowGameMetadataModal, setOpenShowGameMetadataModal] =
    useState(false);
  const [openChampionDialog, setOpenChampionDialog] = useState(false);
  const [isCaptainCoin, setIsChaptainCoin] = useState(false);
  const [tx, setTx] = useState<string>();

  const onOpenSelectDialog = useCallback((ev: any) => {
    setOpen(true);
  }, []);

  const onOpenSelectCaptainDialog = useCallback((ev: any) => {
    setIsChaptainCoin(true);
    setOpen(true);
  }, []);

  const onOpenSelectChampionDialog = useCallback((ev: any) => {
    setOpenChampionDialog(true);
  }, []);

  // TODO: We are doing this to user see connected account
  useEffect(() => {
    if (account && account !== defaultAccount) {
      dispatch(
        setDefaultAccount({
          account: {
            address: account,
            label: account,
            networkType: SupportedNetworkType.evm,
          },
          type: SupportedNetworkType.evm,
        }),
      );
    }
  }, [account, defaultAccount, dispatch]);

  const gamePlayers = game?.players;

  const player = useMemo(() => {
    if (account && gamePlayers && gamePlayers.length) {
      //TODO: We did this because sometimes it is not returning the player_address and as objects
      return gamePlayers
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
  }, [account, gamePlayers]);

  const players = useMemo(() => {
    if (gamePlayers && gamePlayers.length) {
      //TODO: We did this because sometimes it is not returning the player_address and as objects
      return gamePlayers.map((p: any) => {
        return {
          coin_feeds: p[0],
          player_address: p[1],
          captain_coin: p[2],
          champion_id: p[3],
          score: p[4],
        } as Player;
      });
    }
  }, [gamePlayers]);
  const onCloseSelectChampionDialog = useCallback(() => {
    setChampion(undefined);
    setOpenChampionDialog(false);
  }, []);

  const onCloseSelectDialog = useCallback(() => {
    setIsChaptainCoin(false);
    setOpen(false);
  }, []);

  const onSelectChampion = useCallback((champ: ChampionMetaItem) => {
    setChampion(champ);
    setOpenChampionDialog(false);
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
    [listGamesRoute, history],
  );
  const affiliateField = query.get(AFFILIATE_FIELD);
  const amountToPlay = game?.amount_to_play;
  const onEnterGame = useCallback(
    (ev: any) => {
      if (amountToPlay && captainCoin && chainId) {
        setSubmitState(SubmitState.WaitingWallet);
        const onSubmitTx = (tx: string) => {
          setTx(tx);
          createNotification({
            title: `Join Game ${isNFTGame ? 'on NFT Room' : 'on Main Room'}`,
            body: `Joined Game ${id} ${
              isNFTGame ? 'on NFT Room' : 'Main Room'
            }`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, tx),
            urlCaption: messages['app.coinLeagues.viewTransaction'] as string,
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
          amountToPlay.toString(),
          captainCoin?.address,
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
          affiliateField,
          champion?.id || DISABLE_CHAMPIONS_ID,
        );
      }
    },
    [
      amountToPlay,
      champion,
      isNFTGame,
      selectedCoins,
      captainCoin,
      refetch,
      chainId,
      id,
      affiliateField,
      onJoinGameCallback,
      createNotification,
      messages,
    ],
  );

  const isLoading = gameQuery.isLoading || addressQuery.isLoading;
  const started = game?.started;
  const finished = game?.finished;
  const aborted = game?.aborted;
  const totalPlayers = game?.num_players.toNumber();

  const sufficientFunds = useMemo(() => {
    if (amountToPlay && balance) {
      const amount = BigNumber.from(amountToPlay);
      const balBN = BigNumber.from(balance);
      return balBN.gt(amount);
    }
    return false;
  }, [amountToPlay, balance]);

  const currentPlayers = game?.players.length;

  const gameFull = useMemo(() => {
    if (totalPlayers && currentPlayers) {
      return totalPlayers === currentPlayers;
    }
  }, [totalPlayers, currentPlayers]);
  const numCoins = game?.num_coins;
  const isDisabled = useMemo(() => {
    return (
      selectedCoins?.length === (numCoins?.toNumber() || 0) - 1 &&
      captainCoin !== undefined
    );
  }, [selectedCoins, numCoins, captainCoin]);

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  const prizePool = useMemo(() => {
    if (amountToPlay && currentPlayers) {
      if (started) {
        return Number(
          ethers.utils.formatEther(amountToPlay.mul(currentPlayers)),
        );
      } else {
        if (totalPlayers) {
          return Number(
            ethers.utils.formatEther(amountToPlay.mul(totalPlayers)),
          );
        }
      }
    }
    if (amountToPlay && totalPlayers) {
      return Number(ethers.utils.formatEther(amountToPlay.mul(totalPlayers)));
    }
  }, [amountToPlay, currentPlayers, started, totalPlayers]);
  const url = new URL(window.location.href);

  const urlShare = useMemo(() => {
    if (account) {
      url.searchParams.set(AFFILIATE_FIELD, account);
      return url.href;
    } else {
      return url.href;
    }
  }, [url, account]);

  const isGameMetadataEditor = useMemo(() => {
    return CREATOR_PRIZES_ADDRESSES.map((a) => a.toLowerCase()).includes(
      account?.toLowerCase() || '',
    );
  }, [account]);

  return (
    <Grid container spacing={4} alignItems={'center'}>
      <UpdateGameMetadataModal
        open={openUpdateGameMetadataModal}
        setOpen={setOpenUpdateGameMetadataModal}
        id={id}
        gameMetadata={gameMetaQuery.data}
      />
      {gameMetaQuery.data && (
        <ViewGameMetadataModal
          open={openShowGameMetadataModal}
          setOpen={setOpenShowGameMetadataModal}
          gameMetadata={gameMetaQuery.data}
        />
      )}

      {gameMetaQuery.data && (
        <RemoveGameMetadataModal
          open={openRemoveGameMetadataModal}
          setOpen={setOpenRemoveGameMetadataModal}
          game={gameMetaQuery.data}
          id={id}
        />
      )}
      {!IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
        <Grid item xs={12} sm={12} xl={12}>
          <Alert severity='info'>
            <IntlMessages id='coinLeagues.warning.connectPolygon' />
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

      {chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && isNFTGame && (
        <SelectChampionDialog
          chainId={chainId}
          open={openChampionDialog}
          selectedChampion={champion}
          onSelectChampion={onSelectChampion}
          onClose={onCloseSelectChampionDialog}
        />
      )}
      <Grid item xs={12} sm={12} xl={12}>
        <TickerTapeTV />
      </Grid>

      <Grid item xs={12} sm={12} xl={12}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
            <IntlMessages id='app.coinLeagues.dashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to={listGamesRoute}>
            <IntlMessages id='app.coinLeagues.games' />
          </Link>
          <Link color='inherit' component={RouterLink} to={enterGameRoute(id)}>
            {id}
          </Link>
        </Breadcrumbs>
      </Grid>

      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img
            src={CoinsLeagueBanner}
            style={{borderRadius: '12px'}}
            alt={'Coinleague Banner'}
          />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={4} xl={4}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h5' style={{margin: 5}}>
            {gameMetaQuery.data ? `${gameMetaQuery.data.title} -` : null} Game #
            {id}
            <CopyButton size='small' copyText={urlShare} tooltip='URL Copied!'>
              <FileCopy color='inherit' style={{fontSize: 16}} />
            </CopyButton>
          </Typography>
          {gameMetaQuery.data && (
            <IconButton
              onClick={() => setOpenShowGameMetadataModal(true)}
              className={classes.crownIconContainer}>
              <CrownIcon />
            </IconButton>
          )}

          {isGameMetadataEditor && (
            <IconButton onClick={() => setOpenUpdateGameMetadataModal(true)}>
              <EditIcon />
            </IconButton>
          )}
          {gameMetaQuery.data && isGameMetadataEditor && (
            <IconButton onClick={() => setOpenRemoveGameMetadataModal(true)}>
              <DeleteIcon />
            </IconButton>
          )}

          {finished && (
            <Chip label={messages['app.coinLeagues.ended']} color='primary' />
          )}
          {aborted && (
            <Chip label={messages['app.coinLeagues.aborted']} color='primary' />
          )}
          {started && !finished && !aborted && (
            <Chip
              label={messages['app.coinLeagues.started'] as string}
              color='primary'
            />
          )}
        </Box>
      </Grid>
      <Hidden xsDown={true}>
        <Grid item sm={5} xl={5}>
          <img
            src={CoinsLeagueBanner}
            style={{borderRadius: '12px'}}
            alt={'Coinleague Banner'}
          />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={3} xl={3}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <Box pr={2}>
            <SwapButton />
          </Box>
          <Box pr={2}>
            <ShareButton
              shareText={`${messages['app.coinLeagues.coinsLeagueGame']} #Id ${id}`}
            />
          </Box>
          <Box pr={2}>
            <BuyCryptoButton
              btnMsg={`Buy ${GET_CHAIN_NATIVE_COIN(
                GET_LEAGUES_CHAIN_ID(chainId),
              )}`}
              defaultCurrency={GET_CHAIN_NATIVE_COIN(
                GET_LEAGUES_CHAIN_ID(chainId),
              )}
            />
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
        {game && <CardPrize prizePool={prizePool} />}
        {game && (
          <Container className={classes.gameTypePaper}>
            <Box
              display={'flex'}
              justifyContent={'start'}
              alignItems={'center'}
              alignContent={'center'}>
              <Typography variant='subtitle2' style={{color: '#7A8398'}}>
                <IntlMessages id='coinLeagues.warning.gameType' />:
              </Typography>
              <Typography
                variant='h6'
                style={{
                  color:
                    game?.game_type === GameType.Winner ? '#60A561' : '#F76F8E',
                  marginLeft: '10px',
                  fontWeight: 500,
                }}>
                {game?.game_type === GameType.Winner ? 'Bull' : 'Bear'}
              </Typography>
            </Box>
          </Container>
        )}

        {isLoading && <CardPrizeSkeleton />}
        {isLoading && (
          <Container className={classes.gameTypePaper}>
            <Box display={'flex'}>
              <Typography variant='subtitle2' style={{color: '#7A8398'}}>
                <IntlMessages id='app.coinLeagues.gameType' />:
              </Typography>
              <Skeleton>
                <Typography
                  variant='h5'
                  style={{color: '#fff', marginLeft: '20px'}}>
                  <IntlMessages id='app.coinLeagues.winner' />
                </Typography>
              </Skeleton>
            </Box>
          </Container>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {game && (
          <CardInfoPlayers
            num_players={game.num_players.toNumber()}
            current_players={game.players.length}
          />
        )}
        {game && started && !aborted && !finished && id && (
          <Box pt={2}>
            <Countdown id={id} />
          </Box>
        )}
        {game && !started && !aborted && !finished && id && (
          <Box pt={2}>
            <CountdownStartsAt id={id} />
          </Box>
        )}
        {isLoading && <CardInfoPlayersSkeleton />}
      </Grid>
      {/*
        <Grid item xs={12} sm={12}>
          <ChartAccordion />
        </Grid>
      */}

      {game &&
        !player &&
        !isLoading &&
        !gameFull &&
        !aborted &&
        !started &&
        IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
          <>
            <Grid item xs={12} md={6} alignContent='space-around'>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h6' style={{margin: 5}}>
                    {
                      messages[
                        'coinLeagues.page.gameEnter.captain.chooseCurrency'
                      ]
                    }{' '}
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
                    <IntlMessages id='coinLeagues.page.gameEnter.captain.choose' />
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
              {isNFTGame && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h6' style={{margin: 5}}>
                      Choose Champion {champion === undefined ? '0' : '1'}/ 1
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      disabled={champion !== undefined}
                      onClick={onOpenSelectChampionDialog}
                      startIcon={<CryptocurrencyIcon />}
                      endIcon={<ExpandMoreIcon />}
                      variant='outlined'>
                      {'Choose your Champion'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    {champion && (
                      <ChampionItem
                        champion={champion}
                        handleDelete={() => setChampion(undefined)}
                      />
                    )}
                  </Grid>
                  {account && tokensMultipliersQuery?.data && (
                    <Grid item xs={12}>
                      <Alert severity='info'>
                        {tokensMultipliersQuery.data.isHoldingMultiplier
                          ? 'Congrats you are holding 50 KIT or 200 to boost from 1.2 to 1.3 your captain multiplier. Your champions multiplier it will multiply by 1.3 now!'
                          : 'Hold 50 KIT or 200 BITT to boost your captain multiplier to 1.3. Your champions multiplier it will multiply by 1.2 instead of 1.3!'}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>

            {game?.num_coins.toNumber() !== 1 && (
              <Grid item xs={12} md={6} alignContent='space-around'>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h6' style={{margin: 5}}>
                      <IntlMessages id='coinLeagues.page.gameEnter.chooseCurrencies' />{' '}
                      {selectedCoins?.length}/
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
                      <IntlMessages id='coinLeagues.page.gameEnter.chooseCoins' />
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

      {game &&
        !player &&
        !isLoading &&
        !gameFull &&
        !started &&
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
                          !sufficientFunds ||
                          !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
                          (isNFTGame && champion === undefined)
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
                          defaultMsg={
                            sufficientFunds
                              ? (messages[
                                  'app.coinLeagues.enterGame'
                                ] as string)
                              : `Insufficient ${GET_CHAIN_NATIVE_COIN(
                                  GET_LEAGUES_CHAIN_ID(chainId),
                                )} Funds`
                          }
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
                <IntlMessages id='app.coinLeagues.yourCoins' />
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
                type={game?.game_type}
                id={id}
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
                <IntlMessages id='app.coinLeagues.players' />
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
                type={game?.game_type}
                id={id as string}
                finished={finished}
                hideCoins={!started}
                account={account}
                winner={winner}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      {!gameFull && !started && (
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
                  <IntlMessages id='app.coinLeagues.players' />
                </Typography>
              </Skeleton>
            </Grid>
            <Grid item xs={12}>
              <PlayersTableSkeleton players={5} />
            </Grid>
            {game && !gameFull && !started && (
              <Grid item xs={12}>
                <WaitingPlayers />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {currentPlayers && currentPlayers > 0 && !started ? (
        <Grid item xs={12}>
          <StartGame id={id} />
        </Grid>
      ) : null}
      {started && !finished && !aborted && (
        <Grid item xs={12}>
          <EndGame id={id} />
        </Grid>
      )}
    </Grid>
  );
}

export default GameEnter;
