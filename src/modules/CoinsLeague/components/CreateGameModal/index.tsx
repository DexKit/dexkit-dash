import React, {useCallback, useState} from 'react';

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

import {makeStyles} from '@material-ui/core/styles';
import {ReactComponent as TransferIcon} from 'assets/images/icons/bitcoin-convert-white.svg';
import CloseIcon from '@material-ui/icons/Close';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';
import {GameParams} from 'types/coinsleague';
import {ethers} from 'ethers';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red } from '@material-ui/core/colors';

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

const CreateGameModal = (props: Props) => {
  const classes = useStyles();
  const {onGameCreateCallback, refetch} = useCoinsLeagueFactory();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const {open, setOpen} = props;
  const [coins, setCoins] = useState<number>();
  const [gameType, setGameType] = useState('winner-game');
  const [entryAmount, setEntryAmount] = useState<number>();
  const [duration, setGameDuration] = useState<number>();
  const [totalPlayers, setTotalPlayers] = useState<number>();
  const [tx, setTx] = useState<string>();
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameType((event.target as HTMLInputElement).value);
  }
  const onCreateGame = useCallback(
    (ev?: any) => {
      if (totalPlayers && entryAmount && duration && coins) {
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


        const params: GameParams = {
          numPlayers: totalPlayers,
          duration,
          amountUnit: ethers.utils.parseEther(String(entryAmount)),
          numCoins: coins,
          abortTimestamp: Math.round((new Date().getTime())/1000 + duration * 3),
        };
        console.log('Callaback called');
        onGameCreateCallback(params,
          {
            onConfirmation: onConfirmTx,
            onError,
            onSubmit: onSubmitTx,
          },
          
          
          );
      }
    },
    [coins, gameType, entryAmount, duration, totalPlayers],
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
              <CloseIcon style={{color: '#fff'}} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container className={classes.innerContent} spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h6' style={{fontWeight: 600}}>
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
            <FormLabel className={classes.label}>Entry Amount</FormLabel>
            <Select
              variant='outlined'
              placeholder='Select'
              onChange={(event) => setEntryAmount(Number(event.target.value))}
              style={{
                color: '#fff',
                borderRadius: 6,
                backgroundColor: '#3C4255',
              }}>
              <MenuItem value={0.01}>0.01 Matic</MenuItem>
              <MenuItem value={1}>1 Matic</MenuItem>
              <MenuItem value={5}>5 Matic</MenuItem>
              <MenuItem value={10}>10 Matic</MenuItem>
              <MenuItem value={50}>50 Matic</MenuItem>
              <MenuItem value={100}>100 Matic</MenuItem>
              <MenuItem value={500}>500 Matic</MenuItem>
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
          style={{marginRight: 10}}>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
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
                  style: {color: '#fff', backgroundColor: '#3C4255'},
                }}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
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
                  style: {color: '#fff', backgroundColor: '#3C4255'},
                }}>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
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
              style={{fontSize: '1.25rem', fontWeight: 600}}>
              Game type
            </FormLabel>
            <RadioGroup value={gameType}>
              <FormControlLabel
                value='winner-game'
                label='Winner Game'
                onClick={() => setGameType('winner-game')}
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
              <FormControlLabel
                value='loser-game'
                onClick={() => setGameType('loser-game')}
                label='Loser Game'
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Button
          fullWidth
          variant={'contained'}
          color={
            submitState === SubmitState.Error ? 'default' : 'primary'
          }
          className={classes.button}
          onClick={onCreateGame}
          disabled={!coins || !entryAmount || !totalPlayers || !duration}>
          {GetButtonState(
                    submitState,
                    'CREATE GAME',
                    'Game Created',
                  )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
