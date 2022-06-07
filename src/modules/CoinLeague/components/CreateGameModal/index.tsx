import React, {useCallback, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogContent from '@material-ui/core/DialogContent';

import {ReactComponent as TransferIcon} from 'assets/images/icons/bitcoin-convert-white.svg';
import {
  useCoinLeaguesFactoryCreateGameCallback,
  useCoinLeaguesFactoryRoutes,
  useCoinLeaguesFactoryTotalGames,
  useIsNFTGame,
} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import {GameParams} from 'types/coinsleague';
import {ethers} from 'ethers';
import {ButtonState} from '../ButtonState';
import {
  ExplorerURL,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from 'modules/CoinLeague/utils/constants';
import {ChainId} from 'types/blockchain';
import {useHistory} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useNotifications} from 'hooks/useNotifications';
import {DISABLE_CHAMPIONS_ID} from 'modules/CoinLeague/constants';
import {GET_GAME_LEVEL_AMOUNTS_UNITS} from 'modules/CoinLeague/utils/game';
import {GameLevel} from 'modules/CoinLeague/constants/enums';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {InputLabel} from '@material-ui/core';

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
  const {open, setOpen} = props;
  const isNFTGame = useIsNFTGame();
  const {chainId, coinSymbol} = useLeaguesChainInfo();
  const history = useHistory();
  const {messages} = useIntl();
  const {createNotification} = useNotifications();
  const {onGameCreateCallback} = useCoinLeaguesFactoryCreateGameCallback();
  const totalFactoryGames = useCoinLeaguesFactoryTotalGames();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();
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

  const [championRoom, setChampionRoom] = useState<number>(
    Number(DISABLE_CHAMPIONS_ID),
  );
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
              title: `Created Game ${
                isNFTGame ? 'on NFT room' : 'on Main Room'
              }`,
              body: `Created Game at ${new Date().toLocaleTimeString()} ${
                isNFTGame ? 'on NFT room' : 'on Main Room'
              }`,
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
            abortTimestamp: Math.round(startDate / 1000 + duration * 3),
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
      chainId,
    ],
  );

  const goToExplorer = useCallback(
    (_ev: any) => {
      if (
        chainId === ChainId.Mumbai ||
        chainId === ChainId.Matic ||
        chainId === ChainId.Binance
      ) {
        window.open(`${ExplorerURL[chainId]}${tx}`);
      }
    },
    [tx, chainId],
  );

  return (
    <Dialog fullWidth maxWidth='sm' open={open}>
      <CustomDialogTitle
        title={messages['app.coinLeagues.createGame'] as string}
        icon={<TransferIcon style={{width: '1rem', height: '1rem'}} />}
        onClose={() => setOpen(false)}
      />

      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant='subtitle2'>
              <IntlMessages id='app.coinLeagues.warning.createGame' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.selectLevel' />
              </InputLabel>
              <Select
                label={<IntlMessages id='app.coinLeagues.selectLevel' />}
                variant='outlined'
                fullWidth
                onChange={(event) =>
                  setEntryAmount(Number(event.target.value))
                }>
                {/* <MenuItem value={0.1}>Beginner - 0.1 Matic</MenuItem>*/}
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Beginner,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.beginner' /> -{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(GameLevel.Beginner, chainId)}{' '}
                  {coinSymbol}
                </MenuItem>
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Intermediate,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.intermediate' />-{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Intermediate,
                    chainId,
                  )}{' '}
                  {coinSymbol}
                </MenuItem>
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Advanced,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.advanced' /> -{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(GameLevel.Advanced, chainId)}{' '}
                  {coinSymbol}
                </MenuItem>
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Expert,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.expert' /> -{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(GameLevel.Expert, chainId)}{' '}
                  {coinSymbol}
                </MenuItem>
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.Master,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.master' /> -{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(GameLevel.Master, chainId)}{' '}
                  {coinSymbol}
                </MenuItem>
                <MenuItem
                  value={GET_GAME_LEVEL_AMOUNTS_UNITS(
                    GameLevel.GrandMaster,
                    chainId,
                  )}>
                  <IntlMessages id='app.coinLeagues.grandMaster' /> -{' '}
                  {GET_GAME_LEVEL_AMOUNTS_UNITS(GameLevel.GrandMaster, chainId)}{' '}
                  {coinSymbol}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.gameDuration' />
              </InputLabel>
              <Select
                label={<IntlMessages id='app.coinLeagues.gameDuration' />}
                variant='outlined'
                placeholder={messages['app.coinLeagues.select'] as string}
                onChange={(event) =>
                  setGameDuration(Number(event.target.value))
                }
                fullWidth>
                {process.env.NODE_ENV === 'development' && (
                  <MenuItem value={60 * 5}>5 minutes</MenuItem>
                )}
                <MenuItem value={60 * 60}>1 hr</MenuItem>
                <MenuItem value={4 * 60 * 60}>4 hrs</MenuItem>
                <MenuItem value={8 * 60 * 60}>8 hrs</MenuItem>
                <MenuItem value={24 * 60 * 60}>24 hrs</MenuItem>
                <MenuItem value={7 * 24 * 60 * 60}>1 week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.howManyCoins' />
              </InputLabel>
              <Select
                label={<IntlMessages id='app.coinLeagues.howManyCoins' />}
                value={coins}
                variant='outlined'
                fullWidth
                onChange={(event) => setCoins(Number(event.target.value))}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel>
                <IntlMessages id='app.coinLeagues.totalPlayers' />
              </InputLabel>
              <Select
                label={<IntlMessages id='app.coinLeagues.totalPlayers' />}
                value={totalPlayers}
                onChange={(event) =>
                  setTotalPlayers(Number(event.target.value))
                }
                fullWidth
                variant='outlined'>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth component='fieldset'>
              <FormLabel>
                <IntlMessages id='app.coinLeagues.gameType' />
              </FormLabel>
              <RadioGroup row value={gameType}>
                <FormControlLabel
                  value='winner-game'
                  label='Bull'
                  onClick={() => setGameType('winner-game')}
                  labelPlacement='end'
                  control={<Radio color='primary' />}
                />
                <FormControlLabel
                  value='loser-game'
                  onClick={() => setGameType('loser-game')}
                  label='Bear'
                  labelPlacement='end'
                  control={<Radio color='primary' />}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel shrink>
                <IntlMessages
                  id='coinLeague.startDate'
                  defaultMessage='Start Date'
                />
              </InputLabel>
              <TextField
                id='datetime-local'
                type='datetime-local'
                label={
                  <IntlMessages
                    id='coinLeague.startDate'
                    defaultMessage='Start Date'
                  />
                }
                fullWidth
                variant='outlined'
                defaultValue={new Date(startDate)}
                onChange={(event) =>
                  setStartDate(Number(new Date(event.target.value).getTime()))
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel>
                <IntlMessages
                  id='coinLeague.howManyGames'
                  defaultMessage='How many Games?'
                />
              </InputLabel>
              <Select
                label={
                  <IntlMessages
                    id='coinLeague.howManyGames'
                    defaultMessage='How many Games?'
                  />
                }
                fullWidth
                value={totalGames}
                onChange={(event) => setTotalGames(Number(event.target.value))}
                variant='outlined'>
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
          {isNFTGame && (
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>
                  <IntlMessages
                    id='coinLeague.selectChampionRoom'
                    defaultMessage='Select Champion Room'
                  />
                </InputLabel>
                <Select
                  label={
                    <IntlMessages
                      id='coinLeague.selectChampionRoom'
                      defaultMessage='Select Champion Room'
                    />
                  }
                  fullWidth
                  value={championRoom}
                  onChange={(event) =>
                    setChampionRoom(Number(event.target.value))
                  }
                  variant='outlined'>
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
            </Grid>
          )}

          {submitState === SubmitState.WaitingWallet && totalGames > 1 && (
            <Grid item xs={12}>
              Please confirm all {totalGames} tx&#39;s in your wallet.
            </Grid>
          )}

          {(submitState === SubmitState.Confirmed ||
            submitState === SubmitState.Submitted) &&
            totalGames > 1 && (
              <Grid item xs={12}>
                Submitted tx&#39;s {submittedGames}/{totalGames} and Confirmed
                tx &#39; s on chain {confirmedGames}/{totalGames}
              </Grid>
            )}
        </Grid>

        <Grid container justifyContent='center'>
          <Grid item xs={12}>
            {tx && (
              <Button variant='text' onClick={goToExplorer}>
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
          <Grid item xs={12}>
            <Button
              fullWidth
              variant='contained'
              color={submitState === SubmitState.Error ? 'default' : 'primary'}
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
                    ? (
                        messages['app.coinLeagues.createGame'] as string
                      ).toUpperCase()
                    : (messages[
                        'app.coinLeagues.connectWalletPolygon'
                      ] as string)
                }
                confirmedMsg={messages['app.coinLeagues.gameCreated'] as string}
              />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
