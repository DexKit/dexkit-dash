import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@material-ui/core';
import {ArrowForward} from '@material-ui/icons';
import {useFormik} from 'formik';
import {useToggler} from 'hooks/useToggler';
import moment from 'moment';

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import CoinSelect from '../components/CoinSelect';
import GameDescriptionPaper from '../components/GameDescriptionPaper';
import SelectChampionDialog from '../components/SelectChampionDialog';
import {
  GET_CHAMPIONS_COINS,
  GET_NFT_LEAGUE_FACTORY_ADDRESS,
  NFT_LEAGUE_MULTIPLIERS,
  NFT_LEAGUE_SUPPORTED_NETWORKS,
} from '../constants';

import * as yup from 'yup';

import {useModuleStyle} from '../styles/index';
import {useBattleFactoryCallbacks} from '../hooks/useBattleFactoryCallbacks';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {ethers} from 'ethers';
import {Alert} from '@material-ui/lab';
import CreateGameDialog from '../components/CreateGameDialog';
import {useWeb3} from 'hooks/useWeb3';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {ChainId} from 'types/blockchain';
import {useChainInfo} from 'hooks/useChainInfo';
import {NetworkSupportCard} from 'shared/components/NetworkSupportCard';
import {isSupportedBlockchain} from '../utils/blockchain';

const BULL = 0;
const BEAR = 1;

interface GameParams {
  tokenId?: string;
  startsAt: string;
  entryAmount: number;
  gameType: number;
  multiplier: number;
  duration: number;
  rarity: number;
}

const GameParamsSchema = yup.object().shape({
  tokenId: yup.string().required(),
  startsAt: yup.string().required(),
  entryAmount: yup.number().required(),
  gameType: yup.number().required(),
  multiplier: yup.number().required(),
  duration: yup.number().required(),
  rarity: yup.number().optional(),
});

const MINUTE = 1 * 60;
const HOUR = 60 * MINUTE;
const FOUR_HOURS = 4 * HOUR;
const EIGHT_HOURS = 8 * HOUR;
const DAY = 24 * HOUR;
const ONE_WEEK = DAY * 7;

export const NFTLeagueCreateGamePage = () => {
  const classes = useModuleStyle();

  const {chainId} = useLeaguesChainInfo();

  const {createNotification} = useNotifications();

  const {getTransactionScannerUrl} = useChainInfo();

  const {account} = useWeb3();

  const theme = useTheme();

  const [isBittokenCoin, setIsBittokenCoin] = useState(false);

  const selectTokenToggler = useToggler();

  const createGameToggler = useToggler();

  const [errorMessage, setErrorMessage] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const [gameCreatedId, setGameCreatedId] = useState<number>();

  const [transactionHash, setTransactionHash] = useState<string>();

  const {messages, formatMessage} = useIntl();

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const battleFactory = useBattleFactoryCallbacks(
    GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
  );

  const handleSubmit = useCallback(() => {
    createGameToggler.toggle();
  }, [createGameToggler]);

  const handleValidate = useCallback(
    (values) => {
      const errors: any = {};

      if (values.entryAmount <= 0) {
        errors.entryAmount =
          messages['nftLeague.entryAmountMustBeLargeThanZero'];
      }

      if (moment(values.startsAt).isBefore(moment())) {
        errors.startsAt = messages['nftLeague.theGameMustStartInTheFuture'];
      }

      return errors;
    },
    [messages],
  );

  const formik = useFormik<GameParams>({
    initialValues: {
      tokenId: undefined,
      startsAt: '',
      entryAmount: 1.0,
      gameType: BULL,
      multiplier: NFT_LEAGUE_MULTIPLIERS[0],
      duration: HOUR,
      rarity: 0,
    },
    validationSchema: GameParamsSchema,
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  const handleSelect = useCallback(
    (asset: {
      contractAddress: string;
      tokenId: string;
      image: string;
      rarity?: number;
    }) => {
      selectTokenToggler.set(false);
      formik.setFieldValue('tokenId', asset.tokenId);

      if (asset.rarity === 0) {
        setIsBittokenCoin(true);
      } else {
        setIsBittokenCoin(false);
      }
    },
    [formik, selectTokenToggler],
  );

  const handleConfirmCreate = useCallback(() => {
    const values = formik.values;

    setLoading(true);

    battleFactory.onCreateAndJoinGameCallback(
      parseInt(values?.tokenId || '0'),
      values.rarity,
      values.multiplier,
      values.gameType,
      values.duration || 0,
      moment(values.startsAt).unix(),
      ethers.utils.parseUnits(values.entryAmount.toString(), 'ether'),
      {
        onConfirmation: (id: number) => {
          setGameCreatedId(id);
          setLoading(false);
          setTransactionConfirmed(true);
        },
        onError: (err: any) => {
          setLoading(false);

          if (err.data) {
            setErrorMessage(err.data.message);

            return;
          }

          if (err.message) {
            setErrorMessage(err.message);
          }
        },
        onSubmit: (hash: string) => {
          setTransactionHash(hash);
          createNotification({
            title: messages['nftLeague.creatingNFTLeagueGame'] as string,
            body: messages['nftLeague.creatingGame'] as string,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId as ChainId, hash),
            urlCaption: messages['nftLeague.viewTransaction'] as string,
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: hash,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        },
      },
    );
  }, [
    chainId,
    battleFactory,
    formik.values,
    createNotification,
    messages,
    getTransactionScannerUrl,
  ]);

  const handleOpenSelectToken = useCallback(() => {
    selectTokenToggler.set(true);
  }, [selectTokenToggler]);

  const handleCloseDialog = useCallback(() => {
    selectTokenToggler.set(false);
  }, [selectTokenToggler]);

  const handleCloseCreateDialog = useCallback(() => {
    createGameToggler.set(false);
    setLoading(false);
    setTransactionHash(undefined);
    setTransactionConfirmed(false);
    setErrorMessage(undefined);
    setGameCreatedId(undefined);
  }, [createGameToggler]);

  const handleClear = useCallback(() => {
    formik.setFieldValue('tokenId', undefined);
  }, [formik]);

  return (
    <>
      <CreateGameDialog
        dialogProps={{
          open: createGameToggler.show,
          onClose: handleCloseCreateDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        onConfirm={handleConfirmCreate}
        loading={loading}
        transactionHash={transactionHash}
        confirmed={transactionConfirmed}
        gameId={gameCreatedId}
        errorMessage={errorMessage}
      />
      <SelectChampionDialog
        dialogProps={{
          open: selectTokenToggler.show,
          onClose: handleCloseDialog,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        onSelect={handleSelect}
        address={account}
      />
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              useBackUriFromRouter={true}
              title={messages['nftLeague.createGame'] as string}
              breadcrumbs={[
                {caption: 'Wallet', uri: '/'},
                {caption: 'NFT League', uri: '/nft-league'},
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            {!isSupportedBlockchain(chainId) && (
              <NetworkSupportCard
                supportedChains={NFT_LEAGUE_SUPPORTED_NETWORKS}
              />
            )}
          </Grid>

          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleClearError}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <GameDescriptionPaper />
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    color='textPrimary'
                    className={classes.boldText}
                    variant='subtitle1'>
                    <IntlMessages id='nftLeague.createGame' />
                  </Typography>
                  <Typography variant='body1'>
                    <IntlMessages id='nftLeague.parametersOfTheGame' />
                  </Typography>
                </Grid>
                <Grid item xs={12} container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label={formatMessage({
                        id: 'nftLeague.entryAmount',
                        defaultMessage: 'Entry amount (Matic)',
                      })}
                      fullWidth
                      value={formik.values.entryAmount}
                      onChange={formik.handleChange}
                      variant='outlined'
                      type='number'
                      name='entryAmount'
                      error={Boolean(formik.errors.entryAmount)}
                      helperText={
                        formik.errors.entryAmount &&
                        String(formik.errors.entryAmount)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant='outlined'>
                      <InputLabel>
                        <IntlMessages id='nftLeague.duration' />
                      </InputLabel>
                      <Select
                        label={formatMessage({
                          id: 'nftLeague.duration',
                          defaultMessage: 'Duration',
                        })}
                        fullWidth
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        variant='outlined'
                        type='number'
                        name='duration'
                        error={Boolean(formik.errors.duration)}>
                        <MenuItem value={MINUTE}>1 Minute</MenuItem>
                        <MenuItem value={HOUR}>1 Hour</MenuItem>
                        <MenuItem value={FOUR_HOURS}>4 Hours</MenuItem>
                        <MenuItem value={EIGHT_HOURS}>8 Hours</MenuItem>
                        <MenuItem value={DAY}>1 Day</MenuItem>
                        <MenuItem value={ONE_WEEK}>1 Week</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label={messages['nftLeague.startsAt'] as string}
                      fullWidth
                      type='datetime-local'
                      variant='outlined'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formik.values.startsAt}
                      onChange={formik.handleChange}
                      name='startsAt'
                      error={Boolean(formik.errors.startsAt)}
                      helperText={
                        formik.errors.startsAt && String(formik.errors.startsAt)
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <FormControl variant='outlined' fullWidth>
                      <InputLabel>
                        <IntlMessages id='nftLeague.gameType' />
                      </InputLabel>
                      <Select
                        label={messages['nftLeague.gameType'] as string}
                        fullWidth
                        variant='outlined'
                        value={formik.values.gameType}
                        onChange={formik.handleChange}
                        name='gameType'>
                        <MenuItem value={BULL}>Bull</MenuItem>
                        <MenuItem value={BEAR}>Bear</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {isBittokenCoin && (
                    <Grid item xs={12} sm={4}>
                      <FormControl variant='outlined' fullWidth>
                        <InputLabel>
                          <IntlMessages id='nftLeague.coinType' />
                        </InputLabel>
                        <Select
                          label={messages['nftLeague.coinType'] as string}
                          fullWidth
                          variant='outlined'
                          value={formik.values.rarity}
                          onChange={formik.handleChange}
                          name='rarity'>
                          {GET_CHAMPIONS_COINS(chainId).map(
                            (coin: string, index: number) => (
                              <MenuItem value={index + 1}>{coin}</MenuItem>
                            ),
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    color='textPrimary'
                    className={classes.boldText}
                    variant='subtitle1'>
                    <IntlMessages id='nftLeague.chooseYourNft' />
                  </Typography>
                  <Typography variant='body1'>
                    <IntlMessages id='nftLeague.chooseAnNftThatYouThinkWillGoUpOrDown' />
                  </Typography>
                </Grid>
                <Grid item xs={12} container spacing={4}>
                  <Grid item xs={12} sm={4}>
                    <CoinSelect
                      onClick={handleOpenSelectToken}
                      tokenId={formik.values.tokenId}
                      onClear={handleClear}
                      hasError={Boolean(formik.errors.tokenId)}
                    />
                    {Boolean(formik.errors.tokenId) && (
                      <Typography
                        variant='caption'
                        style={{color: theme.palette.error.main}}>
                        {formik.errors.tokenId}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    color='textPrimary'
                    className={classes.boldText}
                    variant='subtitle1'>
                    <IntlMessages id='nftLeague.multiplyYourPower' />
                  </Typography>
                  <Typography variant='body1'>
                    <IntlMessages id='nftLeague.multiplyYourPowerDescription' />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant='outlined' fullWidth>
                    <InputLabel>
                      <IntlMessages id='nftLeague.multiplier' />
                    </InputLabel>
                    <Select
                      variant='outlined'
                      onChange={formik.handleChange}
                      value={formik.values.multiplier}
                      name='multiplier'
                      label={messages['nftLeague.multiplier'] as string}
                      fullWidth>
                      {NFT_LEAGUE_MULTIPLIERS.map(
                        (value: number, index: number) => (
                          <MenuItem key={index} value={value}>
                            {value}x
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    disabled={!formik.isValid}
                    startIcon={<ArrowForward />}
                    variant='contained'
                    color='primary'>
                    <IntlMessages id='nftLeague.createGame' />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default NFTLeagueCreateGamePage;
