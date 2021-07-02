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
  CardHeader,
  Grid,
  Select,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Collapse,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Avatar,
  Snackbar,
  Slider,
} from '@material-ui/core';

import AssetCard from '../AssetCard';
import {useHistory, useParams} from 'react-router';
import AssetsSkeleton from '../AssetsSkeleton';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import useFetch from 'use-http';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import CollectionListSkeleton from '../CollectionListSkeleton';
import useIsMounted from 'hooks/useIsMounted';
import CollectionsCard from '../CollectionsList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import FilterListIcon from '@material-ui/icons/FilterList';
import ErrorIcon from '@material-ui/icons/Error';

import _ from 'lodash';
import CollectionsList from '../CollectionsList';
import {truncateTokenAddress} from 'utils';
import SearchIcon from '@material-ui/icons/Search';
import {useIntersect} from 'hooks/useIntersect';
import {FormatListBulletedOutlined} from '@material-ui/icons';
import {getWindowUrl} from 'utils/browser';
import SaleTypeButton from '../components/sell/SaleTypeButton';
import TokenInput, {PaymentToken} from '../components/sell/TokenInput';
import {useAsset} from '../hooks/detail';
import {useWeb3} from 'hooks/useWeb3';
import {getOpenSeaPort} from 'utils/opensea';
import moment from 'moment';
import TimedeltaSelect from '../components/detail/TimedeltaSelect';
import {isAddress} from 'ethers/lib/utils';
import CreateSellOrderDialog from '../components/sell/CreateSellOrderDialog';
import {Alert, Skeleton} from '@material-ui/lab';
import DaysSelect from '../components/sell/DaysSelect';

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

export default () => {
  const theme = useTheme();
  const userAddress = useDefaultAccount();
  const isUpXs = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const history = useHistory();
  const {messages} = useIntl();
  const {getProvider} = useWeb3();
  const {address, token}: RouteParams = useParams();

  const userAccountAddress = useDefaultAccount();

  const [showSuccess, setShowSuccess] = useState(false);
  const [listing, setListing] = useState(false);
  const [saleType, setSaleType] = useState(SALE_BY_PRICE);
  const [tokenIndex, setTokenIndex] = useState(0);

  const [hasEndingPrice, setHasEndingPrice] = useState(false);

  const [startingPrice, setStartingPrice] = useState(0);
  const [endingPrice, setEndingPrice] = useState(0);
  const [reservePrice, setReservePrice] = useState(0);
  const [expiration, setExpiration] = useState(0);
  const [listingTime, setListingTime] = useState(0);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        console.log(tokens[index], index);
        setPaymentToken(tokens[index]);
        setTokenIndex(index);
      }
    },
    [data, getPaymentTokens],
  );

  const handleChangeStartingPrice = useCallback((amount) => {
    setStartingPrice(amount);
  }, []);

  const handleChangeReservePrice = useCallback((amount) => {
    setReservePrice(amount);
  }, []);

  const handleChangeEndingPrice = useCallback((amount) => {
    setEndingPrice(amount);
  }, []);

  const handleSelectByPrice = useCallback(() => {
    setSaleType(SALE_BY_PRICE);
  }, []);

  const handleSelectHighestBid = useCallback(() => {
    setSaleType(SALE_HIGHEST_BID);
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

  const handleExpirationSelect = useCallback((e) => {
    setExpiration(e);
  }, []);

  const handleListingTimeSelect = useCallback((e) => {
    setListingTime(e);
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

    if (isPrivate && buyerAddress == '') {
      return false;
    }

    return true;
  }, [startingPrice, buyerAddress, endingPrice, hasEndingPrice, isPrivate]);

  const handlePostOrder = useCallback(async () => {
    if (userAccountAddress) {
      const provider = getProvider();

      const openseaPort = await getOpenSeaPort(provider);
      console.log(paymentToken.address);

      let params: any = {
        paymentTokenAddress: paymentToken.address,
        accountAddress: userAccountAddress,
        asset: {
          tokenId: token,
          tokenAddress: address,
          schemaName: data?.asset_contract?.schema_name,
        },
        startAmount: startingPrice,
      };

      if (endingPrice) {
        params.endAmount = endingPrice;
      }

      if (listingTime) {
        params.listingTime = listingTime;
      }

      if (isPrivate && buyerAddress) {
        params.buyerAddress = buyerAddress;
      }

      if (saleType == SALE_HIGHEST_BID) {
        params.waitForHighestBid = true;
        params.englishAuctionReservePrice = reservePrice;
      }

      if (expiration > 0) {
        params.expirationTime = expiration;
      }

      setListing(true);

      openseaPort
        .createSellOrder({...params})
        .then((order: any) => {
          setShowSuccess(true);
        })
        .catch((reason) => {
          setListing(false);
          setErrorMessage(reason.message);
        });
    }
  }, [
    data,
    token,
    paymentToken,
    address,
    userAccountAddress,
    getProvider,
    startingPrice,
    reservePrice,
    endingPrice,
    saleType,
    isPrivate,
    buyerAddress,
    expiration,
  ]);

  const handleChangeExpiration = useCallback((e: ChangeEvent<any>) => {
    setExpiration(e.target.value);
  }, []);

  const [hasScheduleTime, setHasScheduleTime] = useState(false);

  const handleScheduleTime = useCallback((e: ChangeEvent<any>) => {
    if (e.target.checked) {
      setListingTime(0);
    }

    setHasScheduleTime(e.target.checked);
  }, []);

  const handleListingTimeChange = useCallback((e: ChangeEvent<any>) => {
    setListingTime(parseInt(e.target.value));
  }, []);

  return (
    <>
      <CreateSellOrderDialog
        asset={data}
        open={listing}
        success={showSuccess}
      />
      <Box pt={{xs: 8}}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Card>
              <CardContent>
                <Box mb={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Typography variant='body1' color='textSecondary'>
                        You are listing:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {loading ? (
                        <Skeleton className={classes.assetImageSkeleton} />
                      ) : (
                        <img
                          src={data?.image_url}
                          className={classes.assetImage}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Typography gutterBottom variant='caption'>
                        {loading ? <Skeleton /> : data?.collection?.name}
                      </Typography>
                      <Typography gutterBottom variant='h5'>
                        {loading ? <Skeleton /> : data?.name}
                      </Typography>
                      <Typography gutterBottom variant='body1'>
                        {loading ? (
                          <Skeleton variant='text' />
                        ) : (
                          data?.description
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={8}>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <SaleTypeButton
                            active={saleType == SALE_BY_PRICE}
                            header='Set Price'
                            subheader='Sell at a fixed or declining price'
                            onClick={handleSelectByPrice}
                          />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <SaleTypeButton
                            active={saleType == SALE_HIGHEST_BID}
                            header='Highest Bid'
                            subheader='Auction to the highest bidder'
                            onClick={handleSelectHighestBid}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {errorMessage != '' ? (
                    <Grid item xs={12}>
                      <Alert onClose={handleCloseError} severity='error'>
                        {errorMessage}
                      </Alert>
                    </Grid>
                  ) : null}
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
                              Price
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Will be on sale until you transfer this item or
                              cancel it.
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

                      {saleType == SALE_HIGHEST_BID ? (
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
                                Reserve Price
                              </Typography>
                              <Typography variant='body2' color='textSecondary'>
                                Create a hidden limit by setting a reserve
                                price.
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TokenInput
                                tokenIndex={tokenIndex}
                                tokens={getPaymentTokens(data)}
                                amount={reservePrice || 0}
                                onChangeToken={handleChangeToken}
                                onChangeAmount={handleChangeReservePrice}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : null}
                    </>
                  ) : null}
                  {saleType != SALE_HIGHEST_BID ? (
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
                            Include ending price
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            Adding an ending price will allow this listing to
                            expire, or for the price to be reduced until a buyer
                            is found.
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
                  ) : null}
                  {hasEndingPrice && saleType != SALE_HIGHEST_BID ? (
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
                            Starting Price
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            Will be on sale until you transfer this item or
                            cancel it.
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
                  {hasEndingPrice && saleType != SALE_HIGHEST_BID ? (
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
                            Ending Price
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            Must be less than or equal to the starting price.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <TokenInput
                            amount={endingPrice}
                            tokens={getPaymentTokens(data)}
                            tokenIndex={tokenIndex}
                            onChangeAmount={handleChangeEndingPrice}
                            onChangeToken={handleChangeToken}
                            error={
                              endingPrice < 0 || endingPrice > startingPrice
                                ? 'greater than the starting price'
                                : undefined
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  {hasEndingPrice || saleType == SALE_HIGHEST_BID ? (
                    <Grid item xs={12}>
                      <Grid
                        container
                        justify='space-between'
                        alignItems='center'
                        alignContent='center'
                        spacing={2}>
                        <Grid item>
                          <Typography variant='body1'>
                            Expiration date
                          </Typography>
                          <Typography variant='body2'>
                            Your listing will automatically end at this time. No
                            need to cancel it!
                          </Typography>
                        </Grid>
                        <Grid item>
                          <DaysSelect
                            displayEmpty
                            emptyLabel='Expiration'
                            variant='outlined'
                            value={expiration}
                            onChange={handleChangeExpiration}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  {!hasEndingPrice && saleType != SALE_HIGHEST_BID ? (
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
                            Schedule for a future time
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            You can schedule this listing to only be buyable at
                            a future date
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            alignItems='center'
                            alignContent='center'
                            spacing={2}>
                            {hasScheduleTime ? (
                              <Grid item>
                                <DaysSelect
                                  emptyLabel='Expiration'
                                  variant='outlined'
                                  value={listingTime}
                                  onChange={handleListingTimeChange}
                                />
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
                  {saleType != SALE_HIGHEST_BID ? (
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
                            Privacy
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            You can keep your listing public, or your can
                            specify one address that's allowed to buy it.
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
                  ) : null}
                  {isPrivate ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='Buyer address'
                        value={buyerAddress}
                        error={!isAddress(buyerAddress) && buyerAddress != ''}
                        helperText={
                          !isAddress(buyerAddress) && buyerAddress != ''
                            ? 'Invalid Address'
                            : undefined
                        }
                        onChange={handleBuyerAddressChange}
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardHeader title={<IntlMessages id='nfts.sell.summary' />} />
              <CardContent>
                <Box mb={4}>
                  <Grid container spacing={2}>
                    {!hasEndingPrice ? (
                      <Grid item xs={12}>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'>
                          <Typography>Price</Typography>
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
                          <Typography>Starting price</Typography>
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
                          <Typography>Ending price</Typography>
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
                          <Typography>Expires in</Typography>
                          <Typography>
                            {moment
                              .unix(expiration)
                              .format('DD/MM/YYYY HH:mm:ss')}
                          </Typography>
                        </Box>
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
                        Post your listing
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={4}>
                  {/* <Grid item xs={12}>
                    <Typography
                      gutterBottom
                      style={{fontWeight: 800}}
                      variant='body1'>
                      Bounty
                    </Typography>
                    <Slider defaultValue={30} />
                  </Grid> */}
                  <Grid item xs={12}>
                    <Typography
                      gutterBottom
                      style={{fontWeight: 800}}
                      variant='body1'>
                      Fees
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Listing is free! At the time of the sale, the following
                      2.5% fees will be deducted.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
