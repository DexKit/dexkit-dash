import React, {useCallback, useState} from 'react';

import {useIntl} from 'react-intl';

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
import {
  useCoinLeaguesFactory,
  useCoinLeaguesFactoryRoutes,
} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {GameParams} from 'types/coinsleague';
import {ethers} from 'ethers';
import {ButtonState} from '../ButtonState';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeagues/utils/constants';
import {ChainId} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {useHistory} from 'react-router-dom';

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

const CreateGameModal = (props: Props) => {
  const classes = useStyles();
  const {chainId} = useWeb3();
  const history = useHistory();
  const {messages} = useIntl();
  const {onGameCreateCallback, refetchCreated} = useCoinLeaguesFactory();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const {open, setOpen} = props;
  const [coins, setCoins] = useState<number>();
  const [gameType, setGameType] = useState('winner-game');
  const [entryAmount, setEntryAmount] = useState<number>();
  const [duration, setGameDuration] = useState<number>();
  const [totalPlayers, setTotalPlayers] = useState<number>();
  const [tx, setTx] = useState<string>('asda');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameType((event.target as HTMLInputElement).value);
  }

  const onCreateGame = useCallback(() => {
    if (totalPlayers && entryAmount && duration && coins) {
      setSubmitState(SubmitState.WaitingWallet);
      const onSubmitTx = (tx: string) => {
        setTx(tx);
        setSubmitState(SubmitState.Submitted);
      };
      const onConfirmTx = () => {
        setSubmitState(SubmitState.Confirmed);
        refetchCreated().then((r) => {
          if (r.data && r.data[0].length) {
            // Sent user to created game
            history.push(enterGameRoute(`${r.data[0][r.data[0].length - 1]}`));
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
        abortTimestamp: Math.round(new Date().getTime() / 1000 + duration * 3),
        type: gameType === 'winner-game' ? 0 : 1,
      };
      onGameCreateCallback(params, {
        onConfirmation: onConfirmTx,
        onError,
        onSubmit: onSubmitTx,
      });
    }
  }, [coins, gameType, entryAmount, duration, totalPlayers, enterGameRoute]);

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
                <Typography variant='h6'>
                  {messages['app.createGame']}
                </Typography>
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
              {messages['app.basicInformation']}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle2'>
              {messages['app.coinLeagues.warning.createGame']}
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>
              {messages['app.selectLevel']}
            </FormLabel>
            <Select
              variant='outlined'
              placeholder={messages['app.select'] as string}
              onChange={(event) => setEntryAmount(Number(event.target.value))}
              style={{
                color: '#fff',
                borderRadius: 6,
                backgroundColor: '#3C4255',
              }}>
              {/*   <MenuItem value={0.01}>Beginner - 0.01 Matic</MenuItem>
              <MenuItem value={0.1}>Beginner - 0.1 Matic</MenuItem>*/}
              <MenuItem value={1}>
                {messages['app.beginner']} - 1 Matic
              </MenuItem>
              <MenuItem value={5}>
                {messages['app.intermediate']} - 5 Matic
              </MenuItem>
              <MenuItem value={10}>
                {messages['app.advanced']} - 10 Matic
              </MenuItem>
              {/*   <MenuItem value={50}>50 Matic</MenuItem>
              <MenuItem value={100}>100 Matic</MenuItem>
            <MenuItem value={500}>500 Matic</MenuItem>*/}
            </Select>
          </FormControl>
        </Grid>

        <Grid container className={classes.innerContent}>
          <FormControl fullWidth size='small' className={classes.formControl}>
            <FormLabel className={classes.label}>
              {messages['app.gameDuration']}
            </FormLabel>
            <Select
              variant='outlined'
              placeholder={messages['app.select'] as string}
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
          style={{marginRight: 10}}>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
                {messages['app.howManyCoins']}?
              </FormLabel>
              <Select
                value={coins}
                variant='outlined'
                placeholder={messages['app.select'] as string}
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
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size='small' className={classes.formControl}>
              <FormLabel className={classes.label} style={{marginRight: 5}}>
                {messages['app.totalPlayers']}
              </FormLabel>
              <Select
                value={totalPlayers}
                onChange={(event) =>
                  setTotalPlayers(Number(event.target.value))
                }
                variant='outlined'
                placeholder={messages['app.select'] as string}
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
                <MenuItem value={3}>3</MenuItem>
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
              {messages['app.gameType']}
            </FormLabel>
            <RadioGroup value={gameType}>
              <FormControlLabel
                value='winner-game'
                label='Bull'
                onClick={() => setGameType('winner-game')}
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
              <FormControlLabel
                value='loser-game'
                onClick={() => setGameType('loser-game')}
                label='Bear'
                labelPlacement='start'
                className={classes.radio}
                control={<Radio style={{color: '#ffa552'}} />}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

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
                ? (messages['app.createGame'] as string).toUpperCase()
                : (messages['app.connectWalletPolygon'] as string)
            }
            confirmedMsg={messages['app.gameCreated'] as string}
          />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
