import React, {useCallback, useMemo, useState, useEffect} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {List, Paper} from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TickerTapeTV from '../../components/TickerTapeTV';
import {HOME_ROUTE} from 'shared/constants/routes';
import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {ethers, BigNumber} from 'ethers';
import {ChampionMetaItem, CoinFeed} from 'modules/CoinLeague/utils/types';
import {CoinItem} from 'modules/CoinLeague/components/CoinItem';
import {ChampionItem} from 'modules/CoinLeague/components/ChampionItem';
import IconButton from '@material-ui/core/IconButton';

import Box from '@material-ui/core/Box';
import {useTheme} from '@material-ui/core';

import {GameType, Player} from 'types/coinleague';
import PlayersTable from 'modules/CoinLeague/components/PlayersTable';
import OnePlayerTable from 'modules/CoinLeague/components/OnePlayerTable';
import {WaitingPlayers} from 'modules/CoinLeague/components/WaitingPlayers';
import {useWeb3} from 'hooks/useWeb3';
import {
  GET_LEAGUES_CHAIN_ID,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeague/utils/constants';
import {ChainId, SupportedNetworkType} from 'types/blockchain';
import Countdown from 'modules/CoinLeague/components/Countdown';
import CountdownStartsAt from 'modules/CoinLeague/components/CountdownStartsAt';
import {CopyButton} from 'shared/components/CopyButton';
import {FileCopy} from '@material-ui/icons';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import PlayersTableSkeleton from 'modules/CoinLeague/components/PlayersTable/index.skeleton';
import Skeleton from '@material-ui/lab/Skeleton';
import {ShareButton} from 'shared/components/ShareButton';
import Alert from '@material-ui/lab/Alert';
import {
  useCoinLeaguesFactoryRoutes,
  useIsNFTGame,
} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import SwapButton from 'shared/components/SwapButton';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';

import {SelectCoinLeagueDialog} from 'modules/CoinLeague/components/SelectCoins/index.modal';
import SelectChampionDialog from 'modules/CoinLeague/components/SelectChampion/index.modal';
import {
  AFFILIATE_FIELD,
  CREATOR_PRIZES_ADDRESSES,
  PriceFeeds,
} from 'modules/CoinLeague/constants';
import {useTokensMultipliers} from 'modules/CoinLeague/hooks/useMultipliers';
import UpdateGameMetadataModal from 'modules/CoinLeague/components/UpdateGameMetadataModal';
import {useGameMetadata} from 'modules/CoinLeague/hooks/useGameMetadata';
import ViewGameMetadataModal from 'modules/CoinLeague/components/ViewGameMetadataModal';
import RemoveGameMetadataModal from 'modules/CoinLeague/components/RemoveGameMetadataModal';

import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useGameProfilesState} from 'modules/CoinLeague/hooks/useGameProfilesState';
import {GET_LABEL_FROM_DURATION, strPad} from 'modules/CoinLeague/utils/time';

import {GET_GAME_LEVEL} from 'modules/CoinLeague/utils/game';
import GameActions from 'modules/CoinLeague/components/v2/GameActions';
import {useGameJoin} from 'modules/CoinLeague/hooks/v2/useGameJoin';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
import {useMobile} from 'hooks/useMobile';
import {useCoinLeagueFactory} from 'modules/CoinLeague/hooks/useCoinLeagueFactoryV3';
import {useCoinToPlay} from 'modules/CoinLeague/hooks/useCoinToPlay';
import {useTokenBalanceAndAllowance} from 'modules/CoinLeague/hooks/useTokenBalanceAndAllowance';

//import {AAdsCoinleagueBanner} from 'modules/CoinLeagues/components/AAds';

type Params = {
  id: string;
};

type Props = RouteComponentProps<Params>;

function GameEnter(props: Props) {
  const theme = useTheme();
  const {
    match: {params},
  } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const {account} = useWeb3();
  const {chainId} = useLeaguesChainInfo();
  const defaultAccount = useDefaultAccount();

  const isBalanceVisible = useIsBalanceVisible();

  const [maxSelectedCoins, setMaxSelectedCoins] = useState<number>();

  const {search} = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const isNFTGame = useIsNFTGame();

  const {messages} = useIntl();
  const {id} = params;
  const {game, gameQuery, refetch, winner} = useCoinLeagueFactory(id);

  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();

  const gameMetaQuery = useGameMetadata(id);
  const tokensMultipliersQuery = useTokensMultipliers();

  const [selectedCoins, setSelectedCoins] = useState<CoinFeed[]>([]);
  const [captainCoin, setCaptainCoin] = useState<CoinFeed>();
  const [champion, setChampion] = useState<ChampionMetaItem>();
  const [open, setOpen] = useState(false);
  const [editCoins, setEditCoins] = useState(false);
  const [openUpdateGameMetadataModal, setOpenUpdateGameMetadataModal] =
    useState(false);
  const [openRemoveGameMetadataModal, setOpenRemoveGameMetadataModal] =
    useState(false);
  const [openShowGameMetadataModal, setOpenShowGameMetadataModal] =
    useState(false);
  const [openChampionDialog, setOpenChampionDialog] = useState(false);
  const [isCaptainCoin, setIsCaptainCoin] = useState(false);

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  const onOpenSelectDialog = useCallback(
    (ev: any) => {
      setOpen(true);
      setMaxSelectedCoins((game?.num_coins?.toNumber() || 0) - 1);
    },
    [game],
  );

  const onOpenSelectCaptainDialog = useCallback((ev: any) => {
    setIsCaptainCoin(true);
    setMaxSelectedCoins(1);
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
            champion_id: p[4],
            score: p[3],
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
          champion_id: p[4],
          score: p[3],
        } as Player;
      });
    }
  }, [gamePlayers]);
  const onCloseSelectChampionDialog = useCallback(() => {
    setChampion(undefined);
    setOpenChampionDialog(false);
  }, []);

  const onCloseSelectDialog = useCallback(() => {
    setIsCaptainCoin(false);
    setOpen(false);
  }, []);

  const onSelectChampion = useCallback((champ: ChampionMetaItem) => {
    setChampion(champ);
    setOpenChampionDialog(false);
  }, []);

  const onSelectCoins = useCallback(
    (coins: CoinFeed[]) => {
      if (isCaptainCoin) {
        setCaptainCoin(coins[0]);
        setIsCaptainCoin(false);
      } else {
        setSelectedCoins(coins);
      }

      setOpen(false);
    },
    [isCaptainCoin],
  );

  const onSelectCoin = useCallback(
    (coin: CoinFeed, isCaptain: boolean) => {
      if (isCaptain) {
        if (captainCoin === undefined) {
          setCaptainCoin(coin);
        } else {
          let index = selectedCoins.indexOf(coin);

          if (index > -1) {
            let newCoins = [...selectedCoins];

            newCoins.splice(index, 1);

            setSelectedCoins(newCoins);
            setCaptainCoin(undefined);
          }
        }

        setIsCaptainCoin(false);
        setOpen(false);
      } else {
        let index = selectedCoins.indexOf(coin);

        if (index > -1) {
          let newCoins = [...selectedCoins];

          newCoins.splice(index, 1);

          setSelectedCoins(newCoins);
        } else {
          setSelectedCoins([...selectedCoins, coin]);
        }
      }
    },
    [selectedCoins, captainCoin],
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

  const handleJoinConfirm = useCallback(() => {
    refetch();
  }, [refetch]);

  const gameJoin = useGameJoin({game, onConfirm: handleJoinConfirm});

  const coinToPlay = useCoinToPlay(chainId, game?.coin_to_play);
  const currencySymbol = coinToPlay?.symbol || '';

  const coinToPlayBalanceQuery = useTokenBalanceAndAllowance(
    coinToPlay?.address,
  );
  const coinToPlayBalance = coinToPlayBalanceQuery.data;
  const isLoading = gameQuery.isLoading || coinToPlayBalanceQuery.isLoading;

  const onEnterGame = useCallback(() => {
    if (
      !amountToPlay ||
      !coinToPlay ||
      !captainCoin ||
      !chainId ||
      !coinToPlayBalance
    ) {
      return;
    }
    const onJoin = () => {
      gameJoin.join(
        selectedCoins.map((c) => c.address) || [],
        amountToPlay.toString(),
        captainCoin?.address,
        isNFTGame,
        affiliateField,
      );
    };
    // if no balance we need to approve first and then join
    if (amountToPlay.gt(coinToPlayBalance?.allowance)) {
      gameJoin.approveToken(coinToPlay, onJoin);
    } else {
      onJoin();
    }
  }, [
    gameJoin,
    amountToPlay,
    coinToPlay,
    coinToPlayBalance,
    isNFTGame,
    selectedCoins,
    captainCoin,
    chainId,
    affiliateField,
  ]);

  const started = game?.started;
  const finished = game?.finished;
  const aborted = game?.aborted;
  const totalPlayers = game?.num_players?.toNumber();

  const currentPlayers = game?.players?.length;

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

  const sufficientFunds = useMemo(() => {
    if (amountToPlay && coinToPlayBalance) {
      const amount = BigNumber.from(amountToPlay);
      const balBN = BigNumber.from(coinToPlayBalance.balance);
      return balBN.gt(amount);
    }
    if (isLoading) {
      return true;
    }

    return false;
  }, [amountToPlay, coinToPlayBalance, isLoading]);

  const prizePool = useMemo(() => {
    if (amountToPlay && currentPlayers && coinToPlay) {
      if (started) {
        return Number(
          ethers.utils.formatUnits(
            amountToPlay.mul(currentPlayers),
            coinToPlay.decimals,
          ),
        );
      } else {
        if (totalPlayers) {
          return Number(
            ethers.utils.formatUnits(
              amountToPlay.mul(totalPlayers),
              coinToPlay.decimals,
            ),
          );
        }
      }
    }
    if (amountToPlay && totalPlayers && coinToPlay) {
      return Number(
        ethers.utils.formatUnits(
          amountToPlay.mul(totalPlayers),
          coinToPlay.decimals,
        ),
      );
    }
  }, [amountToPlay, currentPlayers, started, totalPlayers, coinToPlay]);
  const url = new URL(window.location.href);

  const urlShare = useMemo(() => {
    if (chainId) {
      if (chainId === ChainId.Matic) {
        url.searchParams.set('network', EthereumNetwork.matic);
      }
      if (chainId === ChainId.Binance) {
        url.searchParams.set('network', EthereumNetwork.bsc);
      }
    }
    if (account) {
      url.searchParams.set(AFFILIATE_FIELD, account);
      return url.href;
    } else {
      return url.href;
    }
  }, [url, account, chainId]);

  const isGameMetadataEditor = useMemo(() => {
    return CREATOR_PRIZES_ADDRESSES.map((a) => a.toLowerCase()).includes(
      account?.toLowerCase() || '',
    );
  }, [account]);

  const userProfiles = useGameProfilesState(
    players?.map((p) => p.player_address),
  );
  const userProfile = useMemo(() => {
    if (userProfiles) {
      return userProfiles.profiles.find(
        (p) => p.address.toLowerCase() === account?.toLowerCase(),
      );
    }
  }, [userProfiles, account]);

  const isMobile = useMobile();

  return (
    <>
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

      {chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
        <SelectCoinLeagueDialog
          //@ts-ignore
          chainId={chainId}
          open={open}
          selectedCoins={
            isCaptainCoin && captainCoin !== undefined
              ? [captainCoin]
              : selectedCoins !== undefined
              ? selectedCoins
              : []
          }
          onSelectCoin={onSelectCoin}
          onSelectCoins={onSelectCoins}
          onClose={onCloseSelectDialog}
          isCaptainCoin={isCaptainCoin}
          maxSelectedCoins={maxSelectedCoins}
          captainCoin={captainCoin}
        />
      )}

      {chainId && IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && isNFTGame && (
        <SelectChampionDialog
          //@ts-ignore
          chainId={chainId}
          open={openChampionDialog}
          selectedChampion={champion}
          onSelectChampion={onSelectChampion}
          onClose={onCloseSelectChampionDialog}
        />
      )}
      <Box p={4}>
        <Grid container spacing={4} alignItems={'center'}>
          {!IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
            <Grid item xs={12} sm={12} xl={12}>
              <Alert severity='info'>
                <IntlMessages
                  id='coinLeagues.warning.connectPolygon'
                  defaultMessage='Connect to Polygon'
                />
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TickerTapeTV />
          </Grid>

          <Grid item xs={12}>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <Grid container spacing={2}>
                  {!isMobile && (
                    <Grid item xs={12}>
                      <Breadcrumbs>
                        <Link
                          color='inherit'
                          component={RouterLink}
                          to={HOME_ROUTE}>
                          <IntlMessages id='app.coinLeagues.dashboard' />
                        </Link>
                        <Link
                          color='inherit'
                          component={RouterLink}
                          to={listGamesRoute}>
                          <IntlMessages id='app.coinLeagues.games' />
                        </Link>
                      </Breadcrumbs>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <IconButton size='small' onClick={handleBack}>
                          <ArrowBackIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Typography variant='h5'>
                          {gameMetaQuery.data
                            ? `${gameMetaQuery.data.title} -`
                            : null}{' '}
                          Game #{id}{' '}
                          <CopyButton
                            size='small'
                            copyText={urlShare}
                            tooltip='URL Copied!'>
                            <FileCopy color='inherit' style={{fontSize: 16}} />
                          </CopyButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={4}
                  alignItems='center'
                  alignContent='center'>
                  <Grid item>
                    <SwapButton />
                  </Grid>
                  <Grid item>
                    <ShareButton
                      shareText={`${messages['app.coinLeagues.coinsLeagueGame']} #Id ${id}`}
                    />
                  </Grid>
                  <Grid item>
                    <BuyCryptoButton
                      btnMsg={`Buy ${GET_CHAIN_NATIVE_COIN(
                        GET_LEAGUES_CHAIN_ID(chainId),
                      )}`}
                      defaultCurrency={GET_CHAIN_NATIVE_COIN(
                        GET_LEAGUES_CHAIN_ID(chainId),
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <BuyCryptoButton
                      btnMsg={`Buy ${currencySymbol || 'USDT'}`}
                      defaultCurrency={currencySymbol.toUpperCase() || 'USDT'}
                    />
                  </Grid>
                  <Grid item>
                    <MaticBridgeButton />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {!sufficientFunds && game !== undefined && !game.started && (
            <Grid item xs={12}>
              <Alert severity='error'>
                <IntlMessages
                  id='coinLeague.insufficientFunds'
                  defaultMessage={`Insufficient {coinSymbol} Funds`}
                  values={{coinSymbol: coinToPlay?.symbol}}
                />
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper>
              <Box p={4}>
                <Grid container spacing={4}>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      ID
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? game?.id?.toNumber() : <Skeleton />}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant='caption'
                      color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.status'
                        defaultMessage='Status'
                      />
                    </Typography>
                    <Box>
                      <Typography variant='subtitle1'>
                        {game === undefined ? (
                          <Skeleton />
                        ) : (
                          <>
                            {finished && messages['app.coinLeagues.ended']}
                            {aborted && messages['app.coinLeagues.aborted']}
                            {started &&
                              !finished &&
                              !aborted &&
                              (messages['app.coinLeagues.started'] as string)}
                            {!started &&
                              !finished &&
                              !aborted &&
                              (messages['coinLeague.waiting'] as string)}
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.gameLevel'
                        defaultMessage='Level'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        GET_GAME_LEVEL(
                          game.amount_to_play,
                          chainId,
                          game.coin_to_play,
                        )
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.entryAmount'
                        defaultMessage='Entry amount'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        <>
                          {ethers.utils.formatUnits(
                            game.amount_to_play,
                            coinToPlay?.decimals,
                          )}{' '}
                          {currencySymbol}
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages id='app.coinLeagues.gameType' />
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      style={{
                        color:
                          game?.game_type === GameType.Winner
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}>
                      {game === undefined ? (
                        <Skeleton />
                      ) : game?.game_type === GameType.Winner ? (
                        'Bull'
                      ) : (
                        'Bear'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.numOfCoins'
                        defaultMessage='Coins'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        strPad(game?.num_coins.toNumber())
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.players'
                        defaultMessage='Players'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        <>
                          {strPad(game?.players.length)}/
                          {strPad(game?.num_players.toNumber())}
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.prize'
                        defaultMessage='Prize'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        <>
                          {prizePool} {currencySymbol}
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='coinLeague.duration'
                        defaultMessage='Duration'
                      />
                    </Typography>
                    <Typography variant='subtitle1'>
                      {game !== undefined ? (
                        GET_LABEL_FROM_DURATION(game.duration.toNumber())
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>

                  {game && !started && !aborted && !finished && id && (
                    <Grid item>
                      <Typography variant='caption' color='textSecondary'>
                        <IntlMessages
                          id='coinLeague.startAt'
                          defaultMessage='Starts at'
                        />
                      </Typography>
                      <Typography variant='subtitle1'>
                        <CountdownStartsAt id={String(game.id.toNumber())} />
                      </Typography>
                    </Grid>
                  )}
                  {game && started && !aborted && !finished && id && (
                    <Grid item>
                      <Typography variant='caption' color='textSecondary'>
                        <IntlMessages
                          id='coinLeague.endsIn'
                          defaultMessage='Ends in'
                        />
                      </Typography>
                      <Typography variant='subtitle1'>
                        <Countdown id={id} />
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Grid>
          {!game?.finished && (
            <Grid item xs={12}>
              <GameActions
                onEditMetadata={
                  isGameMetadataEditor
                    ? () => setOpenUpdateGameMetadataModal(true)
                    : undefined
                }
                onShowMetadata={
                  gameMetaQuery.data
                    ? () => setOpenShowGameMetadataModal(true)
                    : undefined
                }
                onRemoveMetadata={
                  gameMetaQuery.data && isGameMetadataEditor
                    ? () => setOpenRemoveGameMetadataModal(true)
                    : undefined
                }
                onCanEditCoins={() => {
                  if (editCoins) {
                    setEditCoins(false);
                  } else {
                    const coins =
                      PriceFeeds[
                        chainId as
                          | ChainId.Matic
                          | ChainId.Mumbai
                          | ChainId.Binance
                      ];
                    if (player?.coin_feeds && player.captain_coin) {
                      const captainCoin = player.captain_coin;
                      const addressFeeds = player.coin_feeds.map((c: any) =>
                        c.toLowerCase(),
                      );
                      setCaptainCoin(
                        coins.find(
                          (c) =>
                            c.address.toLowerCase() ===
                            captainCoin.toLowerCase(),
                        ),
                      );
                      setSelectedCoins(
                        coins.filter((c) =>
                          addressFeeds.includes(c.address.toLowerCase()),
                        ),
                      );
                    }

                    setEditCoins(true);
                  }
                }}
                canEnterGame={
                  game &&
                  (!player || editCoins) &&
                  !isLoading &&
                  !gameFull &&
                  !started &&
                  !aborted &&
                  IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) &&
                  amountToPlay &&
                  captainCoin &&
                  sufficientFunds &&
                  selectedCoins.length === (game?.num_coins.toNumber() || 0) - 1
                }
                player={player}
                game={game}
                coinToPlay={coinToPlay}
                coinToPlayBalance={coinToPlayBalance}
                onEnterGame={onEnterGame}
                onRefetch={handleRefetch}
                enterLoading={gameJoin.isLoading}
              />
            </Grid>
          )}
          {game &&
            (!player || editCoins) &&
            !isLoading &&
            !gameFull &&
            !aborted &&
            !started &&
            IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) && (
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={isMobile ? 12 : true}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          disabled={isDisabled}
                          onClick={onOpenSelectCaptainDialog}
                          endIcon={<ExpandMoreIcon />}
                          variant='outlined'>
                          <IntlMessages id='coinLeagues.page.gameEnter.captain.choose' />
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <List disablePadding>
                          {captainCoin && (
                            <CoinItem
                              coin={captainCoin}
                              handleDelete={() => setCaptainCoin(undefined)}
                              index={0}
                            />
                          )}
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                  {isNFTGame && (
                    <Grid item xs={isMobile ? 12 : true}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            disabled={champion !== undefined}
                            onClick={onOpenSelectChampionDialog}
                            endIcon={<ExpandMoreIcon />}
                            variant='outlined'>
                            <IntlMessages
                              id='coinLeague.chooseYourChampion'
                              defaultMessage='Choose your Champion'
                            />{' '}
                            {champion === undefined ? '0' : '1'} / 1
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
                                ? 'Congrats you are holding 50 KIT to boost from 1.2 to 1.3 your captain multiplier. Your champions multiplier it will multiply by 1.3 now!'
                                : 'Hold 50 KIT to boost your captain multiplier to 1.3. Your champions multiplier it will multiply by 1.2 instead of 1.3!'}
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {game?.num_coins.toNumber() !== 1 && (
                    <Grid item xs={isMobile ? 12 : true}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            disabled={isDisabled}
                            onClick={onOpenSelectDialog}
                            endIcon={
                              <>
                                {selectedCoins?.length}/
                                {(game?.num_coins.toNumber() || 0) - 1}
                              </>
                            }
                            variant='outlined'>
                            <IntlMessages id='coinLeagues.page.gameEnter.chooseCoins' />
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <List disablePadding>
                            {selectedCoins?.map((c, i) => (
                              <CoinItem
                                coin={c}
                                key={i}
                                handleDelete={() => onDeleteCoin(i)}
                                index={i}
                              />
                            ))}
                          </List>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

          {player && player?.player_address && (
            <Grid item xs={12}>
              <OnePlayerTable
                data={players?.map((p) => {
                  return {
                    hash: p?.player_address,
                    score: BigNumber.from(p?.score || 0).toNumber(),
                    captainCoin: p.captain_coin,
                    coins: (p?.coin_feeds as unknown as string[]) || [],
                  };
                })}
                type={game?.game_type}
                id={id}
                account={account}
                winner={winner}
                profile={userProfile}
                prizePool={prizePool}
                currentPlayers={game?.players.length}
              />
            </Grid>
          )}
          {players && (
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='subtitle1'>
                    <IntlMessages id='app.coinLeagues.players' />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <PlayersTable
                    data={players.map((p) => {
                      return {
                        hash: p?.player_address,
                        score: BigNumber.from(p?.score || 0).toNumber(),
                        captainCoin: p.captain_coin,
                        coins: (p?.coin_feeds as unknown as string[]) || [],
                      };
                    })}
                    type={game?.game_type}
                    id={id as string}
                    finished={finished}
                    hideCoins={!started || !isBalanceVisible}
                    account={account}
                    winner={winner}
                    userProfiles={userProfiles.profiles}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          {isLoading ? (
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
              </Grid>
            </Grid>
          ) : (
            game &&
            !gameFull &&
            !started && (
              <Grid item xs={12}>
                <WaitingPlayers />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </>
  );
}

export default GameEnter;
