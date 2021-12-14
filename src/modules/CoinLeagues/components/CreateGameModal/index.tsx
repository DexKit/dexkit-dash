import React, { useCallback, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as TransferIcon } from 'assets/images/icons/bitcoin-convert-white.svg';
import CloseIcon from '@material-ui/icons/Close';
import {
  useCoinLeaguesFactoryCreateGameCallback,
  useCoinLeaguesFactoryRoutes,
  useCoinLeaguesFactoryTotalGames,
  useIsNFTGame,
} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import { GameParams } from 'types/coinsleague';
import { ethers } from 'ethers';
import { ButtonState } from '../ButtonState';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import { ChainId } from 'types/blockchain';
import { useWeb3 } from 'hooks/useWeb3';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import { GET_CHAIN_NATIVE_COIN } from 'shared/constants/Blockchain';
import { GET_LEAGUES_CHAIN_ID } from 'modules/CoinLeagues/utils/constants';

import { getTransactionScannerUrl } from 'utils/blockchain';
import { NotificationType, TxNotificationMetadata } from 'types/notifications';
import { useNotifications } from 'hooks/useNotifications';
import { DISABLE_CHAMPIONS_ID } from 'modules/CoinLeagues/constants';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 15,
    width: '60%',
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  formControl: {
    padding: theme.spacing(0.5),
  },
  radio: {
    width: '100%',
    borderRadius: 6,
    border: '1px solid #525C75',
    margin: theme.spacing(0.5),
    backgroundColor: '#3C4255',
  },
  textField: {
    marginRight: '5px',
    color: '#fff',
    borderRadius: 6,
    padding: '5px',
    backgroundColor: '#3C4255',
  },
  label: {
    color: '#fff',
    flex: 'auto',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  input: {
    borderRadius: 6,
    border: '1px solid #525C75',
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1rem',
    justifyContent: 'center',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  innerContent: {
    color: '#fff',
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    justifyContent: 'space-between',
  },
}));

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

enum SubmitState {
  None,
  WaitingWallet,
  Submitted,
  Error,
  Confirmed,
}

const CreateGameModal = (props: Props) => {
  const { open, setOpen } = props;
  const isNFTGame = useIsNFTGame();
  const classes = useStyles();
  const { chainId } = useWeb3();
  const history = useHistory();
  const { createNotification } = useNotifications();
  const { onGameCreateCallback } = useCoinLeaguesFactoryCreateGameCallback();
  const totalFactoryGames = useCoinLeaguesFactoryTotalGames();
  const { enterGameRoute } = useCoinLeaguesFactoryRoutes();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const [coins, setCoins] = useState<number>();
  const [gameType, setGameType] = useState('winner-game');
  const [entryAmount, setEntryAmount] = useState<number>();
  const [duration, setGameDuration] = useState<number>();
  const [startDate, setStartDate] = useState<number>(new Date().getTime());
  const [totalPlayers, setTotalPlayers] = useState<number>();
  const [totalGames, setTotalGames] = useState<number>(1);
  const [submittedGames, setSubmittedGames] = useState<number>(0);
  const [confirmedGames, setConfirmedGames] = useState<number>(0);
  const [tx, setTx] = useState<string>('asda');
  const [championRoom, setChampionRoom] = useState<number>(Number(DISABLE_CHAMPIONS_ID));
  /* function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameType((event.target as HTMLInputElement).value);
  }*/
  const onCreateGame = useCallback(
    (_ev?: any) => {
      if (totalPlayers && entryAmount && duration && coins && chainId) {
        setSubmittedGames(0);
        setConfirmedGames(0);
        let confirmed = 0;
        let submitted = 0;
        for (let index = 0; index < totalGames; index++) {
          setSubmitState(SubmitState.WaitingWallet);
          /* eslint-disable */
          const onSubmitTx = (tx: string) => {
            /* eslint-disable */
            confirmed++;
            setSubmittedGames(confirmed);
            setTx(tx);
            setSubmitState(SubmitState.Submitted);
            createNotification({
              title: `Created Game ${isNFTGame && 'on NFT room'}`,
              body: `Created Game at ${new Date().toLocaleTimeString()} ${isNFTGame && 'on NFT room'}`,
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
            /* eslint-disable */
            submitted++;
            setConfirmedGames(submitted);
            setSubmitState(SubmitState.Confirmed);
            totalFactoryGames.refetch().then((r) => {
              if (totalGames === 1) {
                if (r.data) {
                  // Sent user to created game
                  history.push(enterGameRoute(`${r.data - 1}`));
                }
              }
            });
          };
          const onError = () => {
            setSubmitState(SubmitState.Error);
            setTimeout(() => {
              setSubmitState(SubmitState.None);
            }, 3000);
          };

          const params: GameParams = {
            numPlayers: totalPlayers,
            duration,
            amountUnit: ethers.utils.parseEther(String(entryAmount)),
            numCoins: coins,
            abortTimestamp: Math.round(
              new Date().getTime() / 1000 + duration * 3,
            ),
            startTimestamp: Math.floor(startDate / 1000),
            type: gameType === 'winner-game' ? 0 : 1,
            isNFT: isNFTGame,
            championRoom: championRoom,
          };
          onGameCreateCallback(params, {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          });
        }
      }
    },
    [
      coins,
      gameType,
      entryAmount,
      duration,
      totalPlayers,
      enterGameRoute,
      history,
      onGameCreateCallback,
      totalFactoryGames.refetch,
      createNotification,
      isNFTGame,
      championRoom,
      totalFactoryGames,
      totalGames,
      startDate,
      chainId
    ],
  );

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (chainId === ChainId.Mumbai || chainId === ChainId.Matic) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Grid container spacing={2} justifyContent={'flex-start'}>
              <Grid item>
                <TransferIcon />
              </Grid>
              <Grid item>
                <Typography variant='h6'>Create a game</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => setOpen(false)} size='small'>
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container className={classes.innerContent} spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h6' style={{ fontWeight: 600 }}>
              Basic information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle2'>
              Answer all of the options below to continue
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>Select Level</FormLabel>
            <Select
              variant='outlined'
              placeholder='Select'
              onChange={(event) => setEntryAmount(Number(event.target.value))}
              style={{
                color: '#fff',
                borderRadius: 6,
                backgroundColor: '#3C4255',
              }}>
              {/* <MenuItem value={0.1}>Beginner - 0.1 Matic</MenuItem>*/}
              <MenuItem value={1}>
                Beginner - 1{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
              <MenuItem value={5}>
                Intermediate - 5{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
              <MenuItem value={10}>
                Advanced - 10{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
              <MenuItem value={50}>
                Expert - 50{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
              <MenuItem value={250}>
                Master - 250{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
              <MenuItem value={500}>
                Grand Master - 500{' '}
                {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>Game duration</FormLabel>
            <Select
              variant='outlined'
              placeholder='Select'
              onChange={(event) => setGameDuration(Number(event.target.value))}
              style={{
                color: '#fff',
                borderRadius: 6,
                backgroundColor: '#3C4255',
              }}>
              {/*   <MenuItem value={60 * 5}>5 minutes</MenuItem>*/}
              <MenuItem value={60 * 60}>1 hr</MenuItem>
              <MenuItem value={4 * 60 * 60}>4 hrs</MenuItem>
              <MenuItem value={8 * 60 * 60}>8 hrs</MenuItem>
              <MenuItem value={24 * 60 * 60}>24 hrs</MenuItem>
              <MenuItem value={7 * 24 * 60 * 60}>1 week</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          container
          className={classes.innerContent}
          style={{ marginRight: 10 }}>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{ marginRight: 5 }}>
                How many coins?
              </FormLabel>
              <Select
                value={coins}
                variant='outlined'
                placeholder='Select'
                onChange={(event) => setCoins(Number(event.target.value))}
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: { color: '#fff', backgroundColor: '#3C4255' },
                }}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{ marginRight: 5 }}>
                Total players
              </FormLabel>
              <Select
                value={totalPlayers}
                onChange={(event) =>
                  setTotalPlayers(Number(event.target.value))
                }
                variant='outlined'
                placeholder='Select'
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: { color: '#fff', backgroundColor: '#3C4255' },
                }}>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid
          container
          className={`${classes.innerContent} ${classes.formControl}`}>
          <FormControl fullWidth component='fieldset'>
            <FormLabel
              className={classes.label}
              style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Game type
            </FormLabel>
            <RadioGroup value={gameType}>
              <FormControlLabel
                value='winner-game'
                label='Bull'
                onClick={() => setGameType('winner-game')}
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{ color: '#ffa552' }} />}
              />
              <FormControlLabel
                value='loser-game'
                onClick={() => setGameType('loser-game')}
                label='Bear'
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{ color: '#ffa552' }} />}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid
          container
          className={`${classes.innerContent} ${classes.formControl}`}>
          <Grid item xs={12}>
            <FormControl fullWidth component='fieldset'>
              <FormLabel
                className={classes.label}
                style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Start Date
              </FormLabel>
              <TextField
                id='datetime-local'
                type='datetime-local'
                defaultValue={new Date(startDate)}
                onChange={(event) =>
                  setStartDate(Number(new Date(event.target.value).getTime()))
                }
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{ marginRight: 5 }}>
                How many Games?
              </FormLabel>
              <Select
                value={totalGames}
                onChange={(event) => setTotalGames(Number(event.target.value))}
                variant='outlined'
                placeholder='Select'
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: { color: '#fff', backgroundColor: '#3C4255' },
                }}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {isNFTGame && <Grid item xs={12}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{ marginRight: 5 }}>
                Select Champion Room
              </FormLabel>
              <Select
                value={championRoom}
                onChange={(event) => setChampionRoom(Number(event.target.value))}
                variant='outlined'
                placeholder='Select'
                style={{
                  marginRight: 5,
                  color: '#fff',
                  borderRadius: 6,
                  backgroundColor: '#3C4255',
                }}
                inputProps={{
                  style: { color: '#fff', backgroundColor: '#3C4255' },
                }}>
                <MenuItem value={Number(DISABLE_CHAMPIONS_ID)}>All</MenuItem>
                {/* <MenuItem value={0}>BITTOKEN</MenuItem>
                <MenuItem value={1}>BITCOIN</MenuItem>
                <MenuItem value={2}>ETHEREUM</MenuItem>
                <MenuItem value={3}>CHAINLINK</MenuItem>
                <MenuItem value={4}>POLKADOT</MenuItem>
                <MenuItem value={5}>UNISWAP</MenuItem>
                <MenuItem value={6}>CARDANO</MenuItem>
              <MenuItem value={7}>DOGE</MenuItem>*/}
              </Select>
            </FormControl>
          </Grid>}
        </Grid>

        {submitState === SubmitState.WaitingWallet && totalGames > 1 && (
          <Grid container justifyContent={'center'}>
            <Grid item xs>
              Please confirm all {totalGames} tx&#39;s in your wallet.
            </Grid>
          </Grid>
        )}

        {(submitState === SubmitState.Confirmed ||
          submitState === SubmitState.Submitted) &&
          totalGames > 1 && (
            <Grid container justifyContent={'center'}>
              <Grid item xs>
                Submitted tx&#39;s {submittedGames}/{totalGames} and Confirmed
                tx &#39; s on chain {confirmedGames}/{totalGames}
              </Grid>
            </Grid>
          )}

        <Grid container justifyContent={'center'}>
          <Grid item xs>
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
        </Grid>

        <Button
          fullWidth
          variant={'contained'}
          color={submitState === SubmitState.Error ? 'default' : 'primary'}
          className={classes.button}
          onClick={onCreateGame}
          disabled={
            !coins ||
            !entryAmount ||
            !totalPlayers ||
            !duration ||
            submitState !== SubmitState.None ||
            !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
          }>
          <ButtonState
            state={submitState}
            defaultMsg={
              IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId)
                ? 'CREATE GAME'
                : 'Connect Wallet on Polygon'
            }
            confirmedMsg={'Game Created'}
          />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
