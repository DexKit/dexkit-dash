import React, {useCallback, useEffect, useState} from 'react';
import {BigNumber, fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {ChainId} from 'types/blockchain';
import {GasInfo, OrderSide, Steps, Token} from 'types/app';
import {fetchQuote} from 'services/rest/0x-api';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  Box,
  IconButton,
  Popover,
  Collapse,
  Paper,
  Chip,
  LinearProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ApproveStep from './ApproveStep';
import ConvertStep from './ConvertStep';
import MarketStep from './MarketStep';
import LimitStep from './LimitStep';
import DoneStep from './DoneStep';
import LoadingStep from './LoadingStep';
import {useStyles} from './index.style';
import {getExpirationTimeFromSeconds} from 'utils/time_utils';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {getGasEstimationInfoAsync} from 'services/gasPriceEstimation';
import {EthereumNetwork} from '../../../../../../__generated__/globalTypes';
import {useNativeCoinPriceUSD} from 'hooks/useNativeCoinPriceUSD';
import {
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {FEE_PERCENTAGE, FEE_RECIPIENT} from 'shared/constants/Blockchain';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {ErrorIcon, WalletAddIcon} from 'shared/components/Icons';

import {ReactComponent as EmptyWalletImage} from 'assets/images/empty-wallet.svg';
import {SwapQuoteResponse} from 'types/zerox';

interface Props {
  isMarket: boolean;
  isConvert: boolean;
  balances: GetMyBalance_ethereum_address_balances[];
  steps: Steps[];
  currentStep: Steps | undefined;
  currentStepIndex: number;
  tokenWrapper: Token;
  tokenFrom: Token;
  tokenTo: Token;
  amountFrom: number;
  allowanceTarget: string;
  price: number;
  expiry: number;
  account: string;
  networkName: EthereumNetwork;
  chainId: ChainId;
  loading: boolean;
  error: Error | string | undefined;
  isRequestConfirmed: boolean;
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onRequestConfirmed: (value: boolean) => void;
  onShifting: (step: Steps) => void;
}

const OrderContent: React.FC<Props> = (props) => {
  const {
    isMarket,
    isConvert,
    balances,
    currentStep,
    currentStepIndex,
    tokenWrapper,
    tokenFrom,
    tokenTo,
    amountFrom,
    allowanceTarget,
    account,
    chainId,
    expiry,
    price,
    loading,
    error,
    isRequestConfirmed,
    onClose,
    networkName,
    onNext,
    onLoading,
    onRequestConfirmed,
    onShifting,
  } = props;

  const classes = useStyles();
  const {data} = useNativeCoinPriceUSD(networkName);
  const [quote, setQuote] = useState<SwapQuoteResponse>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [slippage, setSlippage] = useState(0.03);
  const [gasAmount, setGasAmount] = useState(new BigNumber(0));
  const [selectedGasPrice, setSelectedGasPrice] = useState<string>('');
  /* eslint-disable */
  const [displayGasPrice, setDisplayGasPrice] = useState<string>('0');
  const [selectedGasOption, setSelectedGasOption] = useState('default');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isPriceInverted, setIsPriceInverted] = useState<boolean>(false);

  const amountFromFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  const REFRESH_RATE_SECONDS = 10;
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (
      (currentStep === Steps.CONVERT ||
        currentStep === Steps.MARKET ||
        currentStep === Steps.LIMIT) &&
      !isRequestConfirmed
    ) {
      fetchInfo();
      setSeconds(0);
    } else if (currentStepIndex === -1) {
      onLoading(false);
    }
  }, [currentStep, slippage, selectedGasPrice]);

  useEffect(() => {
    let interval: any = null;

    if (seconds < REFRESH_RATE_SECONDS) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      if (
        (currentStep === Steps.CONVERT ||
          currentStep === Steps.MARKET ||
          currentStep === Steps.LIMIT) &&
        !isRequestConfirmed
      ) {
        fetchInfo();
        setSeconds(0);
      }
    }

    return () => clearInterval(interval);
  }, [seconds]);

  const fetchInfo = () => {
    if (isConvert) {
      getGasInfo()
        .then((e) => {
      
          updateSelectedGasPrice(e.gasPriceInWei);

          setSellAmount(amountFrom);

          setBuyAmount(amountFrom);

          if (currentStepIndex === -1) {
            onLoading(false);
          }
        })
        .catch((e) => {
          onNext(false, e);
        });
    } else {
      fetchQuote(
        {
          isMarket: isMarket,
          baseToken: tokenFrom,
          quoteToken: tokenTo,
          chainId: chainId,
          orderSide: OrderSide.Sell,
          makerAmount: amountFromFn,
          // Parameters used to prevalidate quote at final
          allowedSlippage: slippage,
          ethAccount: props.account,
          buyTokenPercentage: FEE_PERCENTAGE,
          feeRecipient: FEE_RECIPIENT,
          affiliateAddress: FEE_RECIPIENT,
          intentOnFill: true,
        },
        networkName,
      )
        .then((e) => {
          setQuote(e);
          setSellAmount(
            toTokenUnitAmount(e.sellAmount, tokenFrom.decimals).toNumber(),
          );
          setBuyAmount(
            toTokenUnitAmount(e.buyAmount, tokenTo.decimals).toNumber(),
          );

          const gas = new BigNumber(e.gas);
          const gasPrice = new BigNumber(e.gasPrice);

          setGasAmount(gas);

          updateSelectedGasPrice(gasPrice, gas);

          if (currentStepIndex === -1) {
            onLoading(false);
          }
        })
        .catch((e) => {
          onNext(false, e);
        });
    }
  };

  const getGasInfo = async (): Promise<GasInfo> => {
    return await getGasEstimationInfoAsync();
  };

  const updateSelectedGasPrice = (gasPrice: BigNumber, gas?: BigNumber) => {
    let newGasPrice;

    switch (selectedGasOption) {
      case 'low':
        newGasPrice = (gasPrice.toNumber() * 0.8).toString();
        break;
      case 'default':
        newGasPrice = (gasPrice.toNumber() * 1).toString();
        break;
      case 'fast':
        newGasPrice = (gasPrice.toNumber() * 1.6).toString();
        break;
    }

    if (newGasPrice) {
      handleChangeSelectedGasPrice(newGasPrice, selectedGasOption);

      if (gas) {
        updateFee(new BigNumber(newGasPrice), gas);
      }
    } else {
      if (gas) {
        updateFee(new BigNumber(selectedGasPrice), gas);
      }
    }
  };

  const updateFee = (gasPrice: BigNumber, gas?: BigNumber) => {
    if (isMarket) {
      const feeFn = (gas || gasAmount).multipliedBy(gasPrice);
      setFee(toTokenUnitAmount(feeFn, 18).toNumber());
    } else {
      setFee(new BigNumber(0).toNumber());
    }
  };

  const handleChangeSelectedGasPrice = (
    newSelectedGasPrice: string,
    gasOption: string,
  ) => {
    setSelectedGasOption(gasOption);

    setSelectedGasPrice(newSelectedGasPrice);

    updateFee(new BigNumber(newSelectedGasPrice));

    const newDisplayGasPrice = (
      parseInt(newSelectedGasPrice) / Math.pow(10, 9)
    ).toFixed(2);

    setDisplayGasPrice(newDisplayGasPrice);
  };

  const handleClickGuaranteedPrice = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseGuaranteedPrice = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const invertPrice = () => {
    setIsPriceInverted(!isPriceInverted);
  };

  const expirySeconds = getExpirationTimeFromSeconds(new BigNumber(expiry));
  const expiryFn = new Date(expirySeconds.toNumber() * 1000);
  const limitReceive = (amountFrom * price).toFixed(6);

  let displayPrice;
  let displayGuaranteedPrice;
  let firstSymbol;
  let secondSymbol;

  const validPrice = isMarket ? quote?.price || 0 : price;
  const validGuarenteedPrice = isMarket ? quote?.guaranteedPrice || 0 : price;

  if (isPriceInverted) {
    displayPrice = parseFloat(
      (validPrice === 0 ? 0 : 1 / Number(validPrice)).toString(),
    ).toFixed(6);
    displayGuaranteedPrice = parseFloat(
      (validGuarenteedPrice === 0
        ? 0
        : 1 / Number(validGuarenteedPrice)
      ).toString(),
    ).toFixed(6);
    firstSymbol = tokenFrom.symbol;
    secondSymbol = tokenTo.symbol;
  } else {
    displayPrice = parseFloat(validPrice.toString()).toFixed(6);
    displayGuaranteedPrice = parseFloat(
      validGuarenteedPrice.toString(),
    ).toFixed(6);
    firstSymbol = tokenTo.symbol;
    secondSymbol = tokenFrom.symbol;
  }
  const {usdFormatter} = useUSDFormatter();

  const estimatedFeeUSD = data ? usdFormatter.format(fee * data) : null;

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((value) => !value);
  }, []);

  return (
    <>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Box
              mr={2}
              display='flex'
              justifyContent='center '
              alignItems='center '
              alignContent='center'>
              <WalletAddIcon className={classes.iconColor} />
            </Box>
            <Typography variant='body1'>
              {isConvert
                ? `Convert ${tokenFrom.symbol} to ${tokenTo.symbol}`
                : 'Review ' + (isMarket ? 'Market' : 'Limit') + ' Order'}
            </Typography>
          </Box>
          <Box>
            <IconButton size='small' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      {!loading ? (
        <Box>
          {(currentStep === Steps.CONVERT ||
            currentStep === Steps.MARKET ||
            currentStep === Steps.LIMIT) && (
            <LinearProgress
              variant='determinate'
              value={(seconds / REFRESH_RATE_SECONDS) * 100}
            />
          )}
        </Box>
      ) : null}
      <DialogContent dividers>
        {loading && currentStepIndex === -1 ? (
          <Box
            display='flex'
            flexDirection='column'
            alignContent='center'
            justifyContent='center'>
            <Typography variant='h6' align='center'>
              Loading your order...
            </Typography>
          </Box>
        ) : (
          <>
            {loading &&
            currentStep !== Steps.MARKET &&
            currentStep !== Steps.LIMIT ? (
              <Box
                display='flex'
                flexDirection='column'
                alignContent='center'
                justifyContent='center'>
                {currentStep === Steps.CONVERT && (
                  <>
                    <Typography variant='h6' align='center'>
                      You are converting{' '}
                      {GET_NATIVE_COIN_FROM_NETWORK_NAME(
                        networkName,
                      ).toUpperCase()}{' '}
                      to{' '}
                      {GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME(
                        networkName,
                      ).toUpperCase()}{' '}
                      for trading on DexKit
                    </Typography>
                  </>
                )}
                {currentStep === Steps.APPROVE && (
                  <Box p={4}>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'
                      justifyContent='center'>
                      <EmptyWalletImage />
                    </Box>
                    <Typography variant='h6' align='center'>
                      You are approving {tokenFrom.symbol} for trading on DexKit
                    </Typography>
                  </Box>
                )}
                {currentStep === Steps.APPROVE_WRAPPER && (
                  <>
                    <Typography variant='h6' align='center'>
                      You are approving {tokenWrapper.symbol} for trading on
                      DexKit
                    </Typography>
                  </>
                )}

                {/* {(currentStep === Steps.MARKET ||
                      currentStep === Steps.LIMIT) && (
                      <>
                        <Typography variant='h6' align='center'>
                          Please confirm your order on your wallet
                        </Typography>
                      </>
                    )} */}
              </Box>
            ) : (
              <>
                {currentStep === Steps.ERROR && (
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignContent='center'
                    justifyContent='center'>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'>
                      <ErrorIcon />
                    </Box>

                    <Typography gutterBottom variant='h5' align='center'>
                      An error has happened
                    </Typography>
                    <Typography align='center' variant='body1'>
                      {String(error)}
                    </Typography>
                  </Box>
                )}

                {currentStep === Steps.APPROVE && (
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignContent='center'
                    justifyContent='center'>
                    <Typography variant='h6' align='center'>
                      To proceed with this request,
                    </Typography>
                    <Typography variant='h6' align='center'>
                      we would like to request for your approval to use{' '}
                      {tokenFrom.symbol}
                    </Typography>
                  </Box>
                )}

                {currentStep === Steps.DONE && (
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignContent='center'
                    justifyContent='center'>
                    <Typography align='center'>
                      <CheckCircleOutlineIcon
                        style={{marginBottom: 20, width: 100, height: 100}}
                      />
                    </Typography>

                    <Typography variant='h6' align='center'>
                      {isConvert ? 'Conversion ' : 'Order '}completed!
                    </Typography>
                  </Box>
                )}

                {(currentStep === Steps.CONVERT ||
                  currentStep === Steps.MARKET ||
                  currentStep === Steps.LIMIT) && (
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        justify='space-between'
                        alignItems='center'>
                        <Grid item>
                          <Typography className={classes.label} variant='body1'>
                            {isConvert ? 'Convert' : 'Send'}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value} variant='body1'>
                            {sellAmount}{' '}
                            <Chip size='small' label={tokenFrom.symbol} />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid
                        container
                        justify='space-between'
                        alignItems='center'>
                        <Grid item>
                          <Typography className={classes.label} variant='body1'>
                            {isConvert ? 'To' : 'Receive'}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value} variant='body1'>
                            {isMarket || isConvert
                              ? buyAmount.toFixed(6)
                              : limitReceive}{' '}
                            <Chip size='small' label={tokenTo.symbol} />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {!isConvert && (
                      <>
                        <Grid item xs={12}>
                          <Grid
                            container
                            justify='space-between'
                            alignItems='center'>
                            <Grid item>
                              <Typography
                                className={classes.label}
                                variant='body1'>
                                At Price
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                className={classes.value}
                                variant='body1'>
                                ${displayPrice}{' '}
                                <Chip label={firstSymbol} size='small' /> per{' '}
                                <Chip size='small' label={secondSymbol} />
                                <IconButton
                                  style={{marginLeft: 5}}
                                  size='small'
                                  onClick={invertPrice}>
                                  <SyncAltIcon fontSize='small' />
                                </IconButton>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid
                            container
                            justify='space-between'
                            alignItems='center'>
                            <Grid item>
                              <Typography
                                variant='body1'
                                className={classes.label}>
                                Estimated Fee
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                className={classes.value}
                                variant='body1'>
                                {fee.toFixed(6)}{' '}
                                <Chip
                                  size='small'
                                  label={GET_NATIVE_COIN_FROM_NETWORK_NAME(
                                    networkName,
                                  ).toUpperCase()}
                                />{' '}
                                ({estimatedFeeUSD})
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {!isMarket && !isConvert && (
                      <Grid item xs={12}>
                        <Grid
                          container
                          alignItems='center'
                          justify='space-between'>
                          <Grid item>
                            <Typography variant='body1'>Expiry</Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant='body1'>
                              {expiryFn.toLocaleDateString() +
                                ' - ' +
                                expiryFn.toLocaleTimeString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    {isMarket && !isConvert && (
                      <Grid item xs={12}>
                        <Box py={2}>
                          <Paper variant='outlined'>
                            <Box p={4}>
                              <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'>
                                <Typography variant='body1'>
                                  Advanced
                                </Typography>
                                <IconButton
                                  size='small'
                                  onClick={handleToggleAdvanced}>
                                  {showAdvanced ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                </IconButton>
                              </Box>
                              <Collapse in={showAdvanced}>
                                <Box pt={2}>
                                  <Grid
                                    container
                                    justify='space-between'
                                    alignItems='center'
                                    spacing={2}>
                                    <Grid item xs={12}>
                                      <Typography>
                                        Slippage{' '}
                                        <IconButton
                                          size='small'
                                          className={classes.textSecondary}
                                          onClick={handleClickGuaranteedPrice}>
                                          <HelpOutlineIcon fontSize='small' />
                                        </IconButton>
                                      </Typography>

                                      <Popover
                                        id={popoverId}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleCloseGuaranteedPrice}
                                        anchorOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'center',
                                        }}>
                                        <Box padding={3}>
                                          <Typography
                                            className={classes.textSecondary}>
                                            Guaranteed Price
                                          </Typography>
                                          <Typography
                                            className={classes.textPrimary}
                                            align='right'>
                                            {`${displayGuaranteedPrice} ${firstSymbol} per ${secondSymbol}`}
                                          </Typography>
                                        </Box>
                                      </Popover>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        id='slippage_inp'
                                        variant='outlined'
                                        type='number'
                                        inputProps={{
                                          min: 0,
                                          max: 1,
                                          step: 0.01,
                                        }}
                                        value={slippage}
                                        onChange={(e) => {
                                          setSlippage(Number(e.target.value));
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Collapse>
                            </Box>
                          </Paper>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions style={{display: 'block'}}>
        <Box p={4}>
          {loading ? (
            <LoadingStep currentStepIndex={currentStepIndex} />
          ) : (
            <>
              {currentStep === Steps.CONVERT && (
                <ConvertStep
                  step={currentStep}
                  tokenFrom={tokenFrom}
                  amountFrom={amountFromFn}
                  account={account}
                  chainId={chainId}
                  networkName={networkName}
                  balances={balances}
                  selectedGasPrice={selectedGasPrice}
                  onNext={onNext}
                  onLoading={onLoading}
                  onRequestConfirmed={onRequestConfirmed}
                  onShifting={onShifting}
                />
              )}
              {currentStep === Steps.APPROVE && (
                <ApproveStep
                  step={currentStep}
                  tokenFrom={tokenFrom}
                  amountFrom={amountFrom}
                  allowanceTarget={allowanceTarget}
                  account={account}
                  chainId={chainId}
                  onNext={onNext}
                  onLoading={onLoading}
                  onShifting={onShifting}
                />
              )}
              {currentStep === Steps.APPROVE_WRAPPER && (
                <ApproveStep
                  step={currentStep}
                  tokenFrom={tokenFrom}
                  amountFrom={amountFrom}
                  allowanceTarget={allowanceTarget}
                  account={account}
                  chainId={chainId}
                  onNext={onNext}
                  onLoading={onLoading}
                  onShifting={onShifting}
                />
              )}

              {currentStep === Steps.MARKET && quote && (
                <MarketStep
                  account={account}
                  quote={quote}
                  tokenFrom={tokenFrom}
                  tokenTo={tokenTo}
                  selectedGasPrice={selectedGasPrice}
                  onNext={onNext}
                  onLoading={onLoading}
                  onRequestConfirmed={onRequestConfirmed}
                />
              )}
              {currentStep === Steps.LIMIT && (
                <LimitStep
                  tokenFrom={tokenFrom}
                  tokenTo={tokenTo}
                  amountFrom={amountFrom}
                  price={price}
                  expiry={expiry}
                  account={account}
                  quote={quote}
                  selectedGasPrice={selectedGasPrice}
                  onNext={onNext}
                  onLoading={onLoading}
                  onRequestConfirmed={onRequestConfirmed}
                />
              )}

              {currentStep === Steps.DONE && (
                <DoneStep step={currentStep} onClose={onClose} />
              )}
            </>
          )}
        </Box>
      </DialogActions>
    </>
  );
};

export default OrderContent;
