import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
  Button,
  Switch,
  Avatar,
  InputAdornment,
  IconButton,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import {useHistory, useLocation, useParams} from 'react-router';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import _ from 'lodash';
import TokenInput, {PaymentToken} from '../../components/sell/TokenInput';
import {useAsset} from '../../hooks/detail';
import {useWeb3} from 'hooks/useWeb3';
import {getOpenSeaPort} from 'utils/opensea';
import moment, {Moment} from 'moment';
import {isAddress} from 'ethers/lib/utils';
import {Alert, Skeleton} from '@material-ui/lab';
import DaysSelect, {
  DAYS_SELECT_OPTIONS,
  Option,
} from '../../components/sell/DaysSelect';
import PasteIconButton from 'shared/components/PasteIconButton';
import {DateTimePicker} from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

interface RouteParams {
  address: string;
  token: string;
}

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: 700,
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
  img: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
  },
  avatar: {
    backgroundColor: theme.palette.common.white,
    width: theme.spacing(5),
    height: theme.spacing(5),
    minWidth: theme.spacing(5),
    minHeight: theme.spacing(5),
  },
  assetImage: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
  },
  assetImageSkeleton: {
    display: 'block',
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
  },
}));

const SALE_BY_PRICE = 'p';
const SALE_HIGHEST_BID = 'h';

interface Props {}

export default (props: Props) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const {getProvider} = useWeb3();
  const history = useHistory();

  const {address, token}: RouteParams = useParams();

  const userAccountAddress = useDefaultAccount();

  const [showSuccess, setShowSuccess] = useState(false);
  const [listing, setListing] = useState(false);
  const [saleType, setSaleType] = useState(SALE_BY_PRICE);
  const [tokenIndex, setTokenIndex] = useState(0);

  const [hasEndingPrice, setHasEndingPrice] = useState(false);

  const [startingPrice, setStartingPrice] = useState(0);
  const [endingPrice, setEndingPrice] = useState(0);
  const [expiration, setExpiration] = useState(0);
  const [listingTime, setListingTime] = useState(0);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [customExpiration, setCustomExpiration] = useState<Moment>();
  const [customScheduleTime, setCustomScheduleTime] = useState<Moment>();

  const {state} = useLocation<{assets: any[]}>();

  const [bundleName, setBundleName] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');

  const [assets, setAssets] = useState<any[]>([]);

  const [customScheduleTimeDate, setCustomScheduleTimeDate] = useState(false);

  const [customExpirationDate, setCustomExpirationDate] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  // FIX: replace this
  const [paymentToken, setPaymentToken] = useState<PaymentToken>({
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    imageUrl:
      'https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg',
    decimals: 18,
    usdPrice: 0,
  });

  const {getAsset, loading, data, error} = useAsset();

  useEffect(() => {
    if (state) {
      setAssets(state.assets);
      history.replace({state: {}});
    }
  }, [state]);

  useEffect(() => {
    if (!userAccountAddress) {
      history.replace('/connect-wallet');
    }
  }, []);

  useEffect(() => {
    getAsset(address, token);
  }, [getAsset, address, token]);

  const getPaymentTokens = useCallback((asset: any) => {
    if (!asset) {
      return [];
    }

    return asset?.collection?.payment_tokens?.map((pt: any) => ({
      imageUrl: pt.image_url,
      symbol: pt.symbol,
      decimals: pt.decimals,
      address: pt.address,
      usdPrice: pt.usdPrice,
    }));
  }, []);

  const handleChangeToken = useCallback(
    (index: number) => {
      if (data) {
        let tokens = getPaymentTokens(data);
        setPaymentToken(tokens[index]);
        setTokenIndex(index);
      }
    },
    [data, getPaymentTokens],
  );

  const handleChangeStartingPrice = useCallback((amount) => {
    setStartingPrice(amount);
  }, []);

  const handleChangeEndingPrice = useCallback((amount) => {
    setEndingPrice(amount);
  }, []);

  const handleChangeHasEnding = useCallback((e: ChangeEvent<any>) => {
    if (!e.target.checked) {
      setEndingPrice(0);
    }

    setHasEndingPrice(e.target.checked);
  }, []);

  const handleIsPrivateChange = useCallback((e: ChangeEvent<any>) => {
    setIsPrivate(e.target.checked);
  }, []);

  const handleBuyerAddressChange = useCallback((e) => {
    setBuyerAddress(e.target.value);
  }, []);

  const handleCloseError = useCallback((e) => {
    setErrorMessage('');
  }, []);

  const canSubmit = useCallback(() => {
    if (startingPrice == 0) {
      return false;
    }

    if (hasEndingPrice && endingPrice == 0) {
      return false;
    }

    if (hasEndingPrice && expiration == 0) {
      return false;
    }

    if (isPrivate && buyerAddress == '') {
      return false;
    }

    return true;
  }, [
    startingPrice,
    buyerAddress,
    endingPrice,
    hasEndingPrice,
    isPrivate,
    expiration,
  ]);

  const handlePostOrder = useCallback(async () => {
    if (userAccountAddress) {
      const provider = getProvider();

      const openseaPort = await getOpenSeaPort(provider);

      let params: any = {
        paymentTokenAddress: paymentToken.address,
        accountAddress: userAccountAddress,
        startAmount: startingPrice,
        assets,
      };

      if (endingPrice) {
        params.endAmount = endingPrice;
      }

      if (listingTime > 0) {
        params.listingTime = listingTime;
      }

      if (isPrivate && buyerAddress) {
        params.buyerAddress = buyerAddress;
      }

      if (expiration > 0) {
        params.expirationTime = expiration;
      }

      setListing(true);

      openseaPort
        .createBundleSellOrder({...params})
        .then((order: any) => {
          setShowSuccess(true);
        })
        .catch((reason) => {
          setListing(false);
          setErrorMessage(reason.message);
        });
    }
  }, [
    assets,
    paymentToken,
    userAccountAddress,
    getProvider,
    startingPrice,
    endingPrice,
    saleType,
    isPrivate,
    buyerAddress,
    expiration,
    listingTime,
  ]);

  const handleChangeExpiration = useCallback((e: ChangeEvent<any>) => {
    const option: Option = DAYS_SELECT_OPTIONS[e.target.value];

    if (option.custom) {
      setCustomExpirationDate(true);
      setExpiration(moment().unix());
    } else {
      setCustomExpirationDate(false);
      setExpiration(option.days);
    }
  }, []);

  const handleCustomExpiration = useCallback((e: any) => {
    const value: Moment = e;
    setCustomExpiration(e);
    setExpiration(value.unix());
  }, []);

  const handleCustomScheduleTime = useCallback((e: any) => {
    const value: Moment = e;
    setCustomScheduleTime(e);
    setListingTime(value.unix());
  }, []);

  const [hasScheduleTime, setHasScheduleTime] = useState(false);

  const handleScheduleTime = useCallback((e: ChangeEvent<any>) => {
    if (e.target.checked) {
      setListingTime(0);
    }

    setHasScheduleTime(e.target.checked);
  }, []);

  const handleListingTimeChange = useCallback((e: ChangeEvent<any>) => {
    const option: Option = DAYS_SELECT_OPTIONS[e.target.value];

    if (option.custom) {
      setCustomScheduleTimeDate(true);
      setListingTime(moment().unix());
    } else {
      setCustomScheduleTimeDate(false);
      setListingTime(option.days);
    }
  }, []);

  const handlePaste = useCallback((text: string) => {
    setBuyerAddress(text);
  }, []);

  const getEndingPriceError = useCallback(
    (start: number, end: number): undefined | string => {
      let error = undefined;

      if (end == 0) {
        error = messages['nfts.sell.expire.greaterThanZero'].toString();
      }

      if (end > start) {
        error = messages[
          'nfts.sell.expire.greaterThanStartingPrice'
        ].toString();
      }

      return error;
    },
    [messages],
  );

  const handleCustomExpirationClose = useCallback(() => {
    setExpiration(0);
    setCustomExpirationDate(false);
  }, []);

  const handleCustomScheduleTimeClose = useCallback(() => {
    setListingTime(0);
    setCustomScheduleTimeDate(false);
  }, []);

  return (
    <Box py={{xs: 8}}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={4}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                alignContent='center'>
                <Grid item>
                  <IconButton component={RouterLink} to='/nfts/wallet/'>
                    <KeyboardBackspaceIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.bundle.backtToWallet' />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Grid container spacing={8}>
                {errorMessage != '' ? (
                  <Grid item xs={12}>
                    <Alert onClose={handleCloseError} severity='error'>
                      {errorMessage}
                    </Alert>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant='outlined'
                        label={messages[
                          'nfts.bundle.bundleNameLabel'
                        ].toString()}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant='outlined'
                        label={messages[
                          'nfts.bundle.bundleDescriptionLabel'
                        ].toString()}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {!hasEndingPrice ? (
                  <>
                    <Grid item xs={12}>
                      <Grid
                        container
                        justify='space-between'
                        alignItems='center'
                        spacing={2}>
                        <Grid item>
                          <Typography
                            variant='body1'
                            className={classes.boldText}>
                            <IntlMessages id='nfts.sell.priceRow' />
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            <IntlMessages id='nfts.sell.priceRowDescription' />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TokenInput
                            tokenIndex={tokenIndex}
                            tokens={getPaymentTokens(data)}
                            amount={startingPrice || 0}
                            onChangeToken={handleChangeToken}
                            onChangeAmount={handleChangeStartingPrice}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
                <Grid item xs={12}>
                  <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography variant='body1' className={classes.boldText}>
                        <IntlMessages id='nfts.sell.includeEndingPrice' />
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        <IntlMessages id='nfts.sell.includeEndingPriceDescription' />
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Switch
                        color='primary'
                        checked={hasEndingPrice}
                        onChange={handleChangeHasEnding}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {hasEndingPrice ? (
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      spacing={2}>
                      <Grid item>
                        <Typography
                          variant='body1'
                          className={classes.boldText}>
                          <IntlMessages id='nfts.sell.startingPrice' />
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <IntlMessages id='nfts.sell.startingPriceDescription' />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TokenInput
                          tokenIndex={tokenIndex}
                          tokens={getPaymentTokens(data)}
                          amount={startingPrice || 0}
                          onChangeToken={handleChangeToken}
                          onChangeAmount={handleChangeStartingPrice}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                {hasEndingPrice ? (
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      spacing={2}>
                      <Grid item>
                        <Typography
                          variant='body1'
                          className={classes.boldText}>
                          <IntlMessages id='nfts.sell.endingPrice' />
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <IntlMessages id='nfts.sell.endingPriceDescription' />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TokenInput
                          amount={endingPrice}
                          tokens={getPaymentTokens(data)}
                          tokenIndex={tokenIndex}
                          onChangeAmount={handleChangeEndingPrice}
                          onChangeToken={handleChangeToken}
                          error={getEndingPriceError(
                            startingPrice,
                            endingPrice,
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                {!hasEndingPrice ? (
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      spacing={2}>
                      <Grid item>
                        <Typography
                          variant='body1'
                          className={classes.boldText}>
                          <IntlMessages id='nfts.sell.scheduleForFutureTime' />
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          <IntlMessages id='nfts.sell.scheduleForFutureTimeDescription' />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems='center'
                          alignContent='center'
                          spacing={2}>
                          {hasScheduleTime && !customScheduleTimeDate ? (
                            <Grid item>
                              <DaysSelect
                                emptyLabel={messages[
                                  'nfts.sell.expiration'
                                ].toString()}
                                variant='outlined'
                                value={DAYS_SELECT_OPTIONS.findIndex(
                                  (o: Option) => o.days == listingTime,
                                )}
                                onChange={handleListingTimeChange}
                              />
                            </Grid>
                          ) : null}
                          {customScheduleTimeDate ? (
                            <Grid item>
                              <DateTimePicker
                                format='DD/MM/YYYY HH:mm'
                                minDate={moment()}
                                label='Expiration'
                                inputVariant='outlined'
                                value={customScheduleTime}
                                onChange={handleCustomScheduleTime}
                                ampm={false}
                              />
                            </Grid>
                          ) : null}
                          {customScheduleTimeDate ? (
                            <Grid item>
                              <IconButton
                                onClick={handleCustomScheduleTimeClose}>
                                <CloseIcon />
                              </IconButton>
                            </Grid>
                          ) : null}
                          <Grid item>
                            <Switch
                              color='primary'
                              checked={hasScheduleTime}
                              onChange={handleScheduleTime}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography variant='body1' className={classes.boldText}>
                        <IntlMessages id='nfts.sell.privacy' />
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        <IntlMessages id='nfts.sell.privacyDescription' />
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Switch
                        color='primary'
                        checked={isPrivate}
                        onChange={handleIsPrivateChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {isPrivate ? (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      placeholder={messages[
                        'nfts.sell.buyerAddress'
                      ].toString()}
                      value={buyerAddress}
                      error={!isAddress(buyerAddress) && buyerAddress != ''}
                      helperText={
                        !isAddress(buyerAddress) && buyerAddress != ''
                          ? messages['nfts.sell.invalidAddress'].toString()
                          : undefined
                      }
                      onChange={handleBuyerAddressChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end' variant='standard'>
                            <PasteIconButton onPaste={handlePaste} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box mb={4}>
                <Grid container spacing={2}>
                  {!hasEndingPrice ? (
                    <Grid item xs={12}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'>
                        <Typography>
                          <IntlMessages id='nfts.sell.price' />
                        </Typography>
                        <Typography>
                          <Grid
                            container
                            alignItems='center'
                            alignContent='center'
                            spacing={2}>
                            <Grid item>
                              <Avatar className={classes.avatar}>
                                <img
                                  src={paymentToken.imageUrl}
                                  className={classes.img}
                                />
                              </Avatar>
                            </Grid>
                            <Grid item>{startingPrice.toFixed(2)}</Grid>
                            <Grid item>{paymentToken.symbol}</Grid>
                          </Grid>
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                  {hasEndingPrice ? (
                    <Grid item xs={12}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'>
                        <Typography>
                          <IntlMessages id='nfts.sell.startingPrice' />
                        </Typography>
                        <Typography>
                          <Grid
                            container
                            alignItems='center'
                            alignContent='center'
                            spacing={2}>
                            <Grid item>
                              <Avatar className={classes.avatar}>
                                <img
                                  src={paymentToken.imageUrl}
                                  className={classes.img}
                                />
                              </Avatar>
                            </Grid>
                            <Grid item>{startingPrice.toFixed(2)}</Grid>
                            <Grid item>{paymentToken.symbol}</Grid>
                          </Grid>
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                  {hasEndingPrice ? (
                    <Grid item xs={12}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'>
                        <Typography>
                          <IntlMessages id='nfts.sell.endingPrice' />
                        </Typography>
                        <Typography>
                          <Grid
                            container
                            alignItems='center'
                            alignContent='center'
                            spacing={2}>
                            <Grid item>
                              <Avatar className={classes.avatar}>
                                <img
                                  src={paymentToken.imageUrl}
                                  className={classes.img}
                                />
                              </Avatar>
                            </Grid>
                            <Grid item>{endingPrice.toFixed(2)}</Grid>
                            <Grid item>{paymentToken.symbol}</Grid>
                          </Grid>
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                  {expiration > 0 ? (
                    <Grid item xs={12}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'>
                        <Typography>
                          <IntlMessages id='nfts.sell.expiresIn' />
                        </Typography>
                        <Typography>
                          {moment
                            .unix(expiration)
                            .format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                  {hasEndingPrice && endingPrice == 0 ? (
                    <Grid item xs={12}>
                      <Alert severity='warning'>
                        <IntlMessages id='nfts.sell.endingPriceIsZero' />
                      </Alert>
                    </Grid>
                  ) : null}
                  <Grid item xs={12}>
                    <Button
                      disabled={!canSubmit()}
                      onClick={handlePostOrder}
                      variant='contained'
                      color='primary'
                      fullWidth
                      size='large'>
                      <IntlMessages id='nfts.sell.postYourListing' />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    gutterBottom
                    style={{fontWeight: 800}}
                    variant='body1'>
                    <IntlMessages id='nfts.sell.fees' />
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    <IntlMessages id='nfts.sell.listingFeeDescription' />
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
