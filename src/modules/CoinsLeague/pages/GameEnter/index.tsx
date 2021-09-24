import React, {useCallback, useMemo, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import CardPrize from '../../components/CardPrize';
import SimpleCardGame from '../../components/SimpleCardGame';
import {COINSLEAGUE_ROUTE, HOME_ROUTE} from 'shared/constants/routes';
import {
  Link as RouterLink,
  RouteComponentProps,
  useHistory,
} from 'react-router-dom';
import CardInfoPlayers from 'modules/CoinsLeague/components/CardInfoPlayers';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';
import {truncateAddress} from 'utils/text';
import {ethers} from 'ethers';
import CardInfoPlayersSkeleton from 'modules/CoinsLeague/components/CardInfoPlayers/index.skeleton';
import CardPrizeSkeleton from 'modules/CoinsLeague/components/CardPrize/index.skeleton';
import {ReactComponent as CryptocurrencyIcon} from 'assets/images/icons/cryptocurrency.svg';
import {CoinFeed} from 'modules/CoinsLeague/utils/types';
import SimpleCardGameSkeleton from 'modules/CoinsLeague/components/SimpleCardGame/index.skeleton';
import {SelectCoinLeagueDialog} from 'modules/CoinsLeague/components/SelectCoins/index.modal';
import {CoinItem} from 'modules/CoinsLeague/components/CoinItem';
import IconButton from '@material-ui/core/IconButton';

import Box from '@material-ui/core/Box';
import {Player} from 'types/coinsleague';
import PlayersTable from 'modules/CoinsLeague/components/PlayersTable';
import OnePlayerTable from 'modules/CoinsLeague/components/OnePlayerTable';
import {WaitingPlayers} from 'modules/CoinsLeague/components/WaitingPlayers';
import Chip from '@material-ui/core/Chip';
import {useWeb3} from 'hooks/useWeb3';
import {ExplorerURL} from 'modules/CoinsLeague/utils/constants';
import {ChainId} from 'types/blockchain';
import {EndGame} from 'modules/CoinsLeague/components/EndGame';
import {StartGame} from 'modules/CoinsLeague/components/StartGame';
import {ButtonState} from 'modules/CoinsLeague/components/ButtonState';
import Countdown from 'modules/CoinsLeague/components/Countdown';
import {ShareButton} from 'shared/components/ShareButton';
import {CopyButton} from 'shared/components/CopyButton';
import {FileCopy} from '@material-ui/icons';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import CoinsLeagueBanner from 'assets/images/banners/coinsleague.svg';
import Hidden from '@material-ui/core/Hidden';
import PlayersTableSkeleton from 'modules/CoinsLeague/components/PlayersTable/index.skeleton';
import Skeleton from '@material-ui/lab/Skeleton';
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

  const {address} = params;
  const {game, gameQuery, refetch, onJoinGameCallback, winner} =
    useCoinsLeague(address);
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);

  const [selectedCoins, setSelectedCoins] = useState<CoinFeed[]>([]);
  const [open, setOpen] = useState(false);
  const [tx, setTx] = useState<string>();

  const onOpenSelectDialog = useCallback((ev: any) => {
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
            score: p[2],
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
    if (account && game?.players && game?.players.length) {
      //TODO: We did this because sometimes it is not returning the player_address and as objects
      return game.players.map((p: any) => {
        return {
          coin_feeds: p[0],
          player_address: p[1],
          score: p[2],
        } as Player;
      });
    }
  }, [account, game?.players, game]);

  const onCloseSelectDialog = useCallback((ev: any) => {
    setOpen(false);
  }, []);

  const onSelectCoin = useCallback(
    (coin: CoinFeed) => {
      if (selectedCoins) {
        setSelectedCoins(selectedCoins?.concat(coin));
      } else {
        setSelectedCoins([coin]);
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

  const handleBack = useCallback((ev: any) => {
    history.push(COINSLEAGUE_ROUTE);
  }, []);

  const onEnterGame = useCallback(
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

        onJoinGameCallback(
          selectedCoins.map((c) => c.address),
          game?.amount_to_play.toString(),
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
        );
      }
    },
    [game, selectedCoins, refetch],
  );

  const isLoading = useMemo(() => gameQuery.isLoading, [gameQuery.isLoading]);

  const started = useMemo(() => game?.started, [game?.started]);
  const finished = useMemo(() => game?.finished, [game?.finished]);
  const aborted = useMemo(() => game?.aborted, [game?.aborted]);
  const totalPlayers = useMemo(() => game?.num_players, [game?.num_players]);
  const currentPlayers = useMemo(() => game?.players.length, [game?.players]);
  const gameFull = useMemo(() => {
    if (totalPlayers && currentPlayers) {
      return totalPlayers === currentPlayers;
    }
  }, [started, totalPlayers, currentPlayers]);

  const isDisabled = useMemo(() => {
    return selectedCoins?.length === game?.num_coins;
  }, [selectedCoins, game?.num_coins]);

  const isDisabledToStart = useMemo(() => {
    return selectedCoins?.length !== game?.num_coins;
  }, [selectedCoins, game?.num_coins]);

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
      {(chainId === ChainId.Mumbai || chainId === ChainId.Matic) && (
        <SelectCoinLeagueDialog
          chainId={chainId}
          open={open}
          onSelectCoin={onSelectCoin}
          onClose={onCloseSelectDialog}
        />
      )}
      <Grid item xs={12} sm={12} xl={12}>
        <Breadcrumbs
          style={{color: '#fff', fontSize: '0.75rem'}}
          separator={<NavigateNextIcon fontSize='small' />}>
          <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
            Dashboard
          </Link>
          <Link color='inherit' component={RouterLink} to={COINSLEAGUE_ROUTE}>
            Games
          </Link>
          <Link
            color='inherit'
            component={RouterLink}
            to={`${COINSLEAGUE_ROUTE}/${address}`}>
            {truncateAddress(address)}
          </Link>
        </Breadcrumbs>
      </Grid>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={8} sm={4} xl={4}>
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
      <Grid item xs={4} sm={3} xl={3}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ShareButton shareText={`Coin leagues Game #Id ${address}`} />
          <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
          <MaticBridgeButton/>
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
        {isLoading && <CardPrizeSkeleton />}
      </Grid>
      <Grid item xs={6} sm={4}>
        {game && (
          <CardInfoPlayers
            num_players={game.num_players}
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

      {!player && !isLoading && !gameFull && !aborted && (
        <Grid item xs={12} md={6} alignContent='space-around'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5' style={{margin: 5}}>
                Choose Currencies {selectedCoins?.length}/{game?.num_coins || 0}
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
                      handleDelete={onDeleteCoin}
                      index={i}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {!player && !isLoading && !gameFull && !aborted && (
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
                  <Button
                    disabled={!isDisabled || submitState !== SubmitState.Error}
                    onClick={onEnterGame}
                    variant={'contained'}
                    color={
                      submitState === SubmitState.Error ? 'default' : 'primary'
                    }>
                    <ButtonState
                      state={submitState}
                      defaultMsg={'ENTER GAME'}
                      confirmedMsg={'You Entered Game'}
                    />
                  </Button>
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
                data={{
                  hash: player?.player_address,
                  score: player?.score?.toNumber() || 0,
                  coins: (player?.coin_feeds as unknown as string[]) || [],
                }}
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
                    coins: (p?.coin_feeds as unknown as string[]) || [],
                  };
                })}
                address={address}
                account={account}
                winner={winner}
              />
            </Grid>
            {!gameFull && (
              <Grid item xs={12}>
                <WaitingPlayers />
              </Grid>
            )}
          </Grid>
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

      {currentPlayers && currentPlayers > 0 && !started && (
        <Grid item xs={12}>
          <StartGame address={address} />
        </Grid>
      )}
      {started && !finished && !aborted && (
        <Grid item xs={12}>
          <EndGame address={address} />
        </Grid>
      )}
    </Grid>
  );
}

export default GameEnter;
