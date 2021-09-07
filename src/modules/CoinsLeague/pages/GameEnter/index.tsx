import React, {useCallback, useMemo, useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
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
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import {red} from '@material-ui/core/colors';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import {Player} from 'types/coinsleague';
import PlayersTable from 'modules/CoinsLeague/components/PlayersTable';

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
const GetButtonState = (
  state: SubmitState,
  defaultMsg: string,
  confirmedMsg: string,
) => {
  switch (state) {
    case SubmitState.WaitingWallet:
      return (
        <>
          <CircularProgress color={'secondary'} />
          Waiting Wallet
        </>
      );
    case SubmitState.Error:
      return (
        <>
          <Icon style={{color: red[500]}}>error</Icon>
          Error
        </>
      );
    case SubmitState.Submitted:
      return (
        <>
          <CircularProgress color={'secondary'} />
          Waiting for Confirmation
        </>
      );
    case SubmitState.Confirmed:
      return <>{confirmedMsg}</>;

    default:
      return defaultMsg;
  }
};

function GameEnter(props: Props) {
  const classes = useStyles();
  const {
    match: {params},
  } = props;
  const history = useHistory();
  const account = useDefaultAccount();
  const {address} = params;
  const {game, gameQuery, refetch, onJoinGameCallback, onStartGameCallback} =
    useCoinsLeague(address);
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);

  const [selectedCoins, setSelectedCoins] = useState<CoinFeed[]>([]);
  const [open, setOpen] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
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
        console.log('selectedCoins');
        console.log(selectedCoins);

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

  const onStartGame = useCallback(
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

        onStartGameCallback({
          onConfirmation: onConfirmTx,
          onError,
          onSubmit: onSubmitTx,
        });
      }
    },
    [game, refetch],
  );

  const isLoading = useMemo(() => gameQuery.isLoading, [gameQuery.isLoading]);

  const started = useMemo(() => game?.started, [game]);
  const finished = useMemo(() => game?.finished, [gameQuery.data]);
  const totalPlayers = useMemo(() => game?.num_players, [game]);
  const currentPlayers = useMemo(() => game?.players.length, [game]);
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
      window.open(`https://mumbai.polygonscan.com/tx/${tx}`);
    },
    [tx],
  );

  return (
    <Container maxWidth='xl' className={classes.container}>
      <SelectCoinLeagueDialog
        open={open}
        onSelectCoin={onSelectCoin}
        onClose={onCloseSelectDialog}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} xl={12}>
          <Grid container>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.75rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                Dashboard
              </Link>
              <Link
                color='inherit'
                component={RouterLink}
                to={COINSLEAGUE_ROUTE}>
                Games
              </Link>
              <Link
                color='inherit'
                component={RouterLink}
                to={`${COINSLEAGUE_ROUTE}/enter/${address}`}>
                {truncateAddress(address)}
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid container xs={12} xl={12} sm={12}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h5' style={{margin: 5}}>
              Game #{truncateAddress(address)}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          {game && <SimpleCardGame {...game} />}
          {isLoading && <SimpleCardGameSkeleton />}
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={4}>
          {game && (
            <CardInfoPlayers
              num_players={game.num_players}
              current_players={game.players.length}
            />
          )}
          {isLoading && <CardInfoPlayersSkeleton />}
        </Grid>

        {!player && !isLoading && !gameFull && (
          <Grid item xs={12} md={6} alignContent='space-around'>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h5' style={{margin: 5}}>
                  Choose Currencies {selectedCoins?.length}/
                  {game?.num_coins || 0}
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
                    <Grid item xs={12}>
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

        {!player && !isLoading && !gameFull && (
          <Grid item xs={12} md={12}>
            <Grid container spacing={4} justifyContent={'flex-end'}>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12} md={12}>
                    {tx && (
                      <Button variant={'text'} onClick={goToExplorer}>
                        {SubmitState.Submitted
                          ? 'Submitted Tx'
                          : SubmitState.Error
                          ? 'Tx Error'
                          : 'Confirmed Tx'}
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      disabled={!isDisabled}
                      onClick={onEnterGame}
                      variant={'contained'}
                      color={
                        submitState === SubmitState.Error
                          ? 'default'
                          : 'primary'
                      }>
                      {GetButtonState(
                        submitState,
                        'ENTER GAME',
                        'You Entered Game',
                      )}
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
                <PlayersTable
                  data={[
                    {
                      hash: player?.player_address,
                      score: player?.score?.toNumber() || 0,
                      coins: (player?.coin_feeds as unknown as string[]) || [],
                      showClaim: false,
                      claimed: false,
                    },
                
                  ]}
                  address={address}
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
                      showClaim: false,
                      claimed: false,
                    };
                  })}
                  address={address}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        {currentPlayers && currentPlayers > 0 && (
          <Grid item xs={12}>
            <Paper>
              <Box m={2}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={9}>
                    {!gameFull && (
                      <Typography variant='h6' style={{margin: 5}}>
                        Waiting For Players
                      </Typography>
                    )}
                    <Typography variant='h6' style={{margin: 5}}>
                      {currentPlayers} / {totalPlayers}
                    </Typography>
                    {gameFull && (
                      <Typography variant='h6' style={{margin: 5}}>
                        Everybody is here
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box m={2}>
                      <Button
                        disabled={!gameFull}
                        onClick={onStartGame}
                        fullWidth
                        variant={'contained'}
                        color={
                          submitState === SubmitState.Error
                            ? 'default'
                            : 'primary'
                        }>
                        {GetButtonState(
                          submitState,
                          'START GAME',
                          'Game Started',
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default GameEnter;
