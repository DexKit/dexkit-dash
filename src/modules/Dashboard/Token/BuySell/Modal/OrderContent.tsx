import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useNetwork} from 'hooks/useNetwork';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import BigNumber from 'bignumber.js';
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
  CircularProgress,
  IconButton,
  Popover,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {ArrowDownwardOutlined} from '@material-ui/icons';
import ApproveStep from './ApproveStep';
import ErrorStep from './ErrorStep';
import ConvertStep from './ConvertStep';
import MarketStep from './MarketStep';
import LimitStep from './LimitStep';
import DoneStep from './DoneStep';
import ProgressBar from './ProgressBar';
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
import {FEE_RECIPIENT} from 'shared/constants/Blockchain';

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

const GasOptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const GasOption = styled.div<{isSelected: boolean}>`
  padding: 5px 0px;
  width: 90px;
  background-color: ${(props) =>
    props.isSelected ? '#ff7149' : 'transparent'};
  border: 1px solid grey;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OrderContent: React.FC<Props> = (props) => {
  const {
    isMarket,
    isConvert,
    balances,
    steps,
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
    onNext,
    onLoading,
    onRequestConfirmed,
    onShifting,
  } = props;

  const classes = useStyles();
  const networkName = useNetwork();
  const {data} = useNativeCoinPriceUSD(networkName);
  const [quote, setQuote] = useState<any>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [slippage, setSlippage] = useState(0.03);
  const [gasAmount, setGasAmount] = useState(new BigNumber(0));
  const [defaultGasPrice, setDefaultGasPrice] = useState('0');
  const [selectedGasPrice, setSelectedGasPrice] = useState<string>('');
  const [displayGasPrice, setDisplayGasPrice] = useState<string>('0');
  const [initGasPrice, setInitGastPrice] = useState<number | undefined>();
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
      console.log('OrderContent: data changed');
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
        console.log('OrderContent: refresh');
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
          setDefaultGasPrice(e.gasPriceInWei.toString());

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
          buyTokenPercentage: undefined,
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
          setDefaultGasPrice(gasPrice.toNumber().toString());

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

  const handleChangeDisplayGasPrice = (newDisplayGasPrice: string) => {
    setSelectedGasOption('manual');

    setDisplayGasPrice(newDisplayGasPrice);

    const newSelectedGasPrice = (
      parseFloat(newDisplayGasPrice) * Math.pow(10, 9)
    ).toString();

    setSelectedGasPrice(newSelectedGasPrice);

    updateFee(new BigNumber(newSelectedGasPrice));
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
      (validPrice === 0 ? 0 : 1 / validPrice).toString(),
    ).toFixed(6);
    displayGuaranteedPrice = parseFloat(
      (validGuarenteedPrice === 0 ? 0 : 1 / validGuarenteedPrice).toString(),
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

  const lowGasPrice = (parseInt(defaultGasPrice) * 0.8).toString();
  const displayLowGas = (parseInt(lowGasPrice) / Math.pow(10, 9)).toFixed(2);

  const displayDefaultGas = (
    parseInt(defaultGasPrice) / Math.pow(10, 9)
  ).toFixed(2);

  const fastGasPrice = (parseInt(defaultGasPrice) * 1.6).toString();
  const displayFastGas = (parseInt(fastGasPrice) / Math.pow(10, 9)).toFixed(2);
  const {usdFormatter} = useUSDFormatter();

  const estimatedFeeUSD = data ? usdFormatter.format(fee * data) : null;

  return (
    <>
      <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            style={{
              width: 48,
              height: 48,
            }}>
            {(currentStep === Steps.CONVERT ||
              currentStep === Steps.MARKET ||
              currentStep === Steps.LIMIT) && (
              <CircularProgress
                size={20}
                variant='determinate'
                value={(seconds / REFRESH_RATE_SECONDS) * 100}
              />
            )}
          </Box>
          <Typography
            className={classes.textPrimary}
            variant='h5'
            align='center'>
            {isConvert
              ? `Convert ${tokenFrom.symbol} to ${tokenTo.symbol}`
              : 'Review ' + (isMarket ? 'Market' : 'Limit') + ' Order'}
          </Typography>
          <Typography align='right'>
            <IconButton aria-label='close' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
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
                  <>
                    <Typography variant='h6' align='center'>
                      You are approving {tokenFrom.symbol} for trading on DexKit
                    </Typography>
                  </>
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
                    <Typography align='center'>
                      <ErrorOutlineIcon
                        style={{marginBottom: 20, width: 100, height: 100}}
                      />
                    </Typography>

                    <Typography variant='h6' align='center'>
                      An error has happened
                    </Typography>
                  </Box>
                )}

                {currentStep === Steps.APPROVE && (
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignContent='center'
                    justifyContent='center'>
                    {/* <Typography align='center'>
                      <CheckCircleOutlineIcon
                        style={{marginBottom: 20, width: 100, height: 100}}
                      />
                    </Typography> */}

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
                  <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'>
                    <Grid
                      style={{paddingRight: 8, paddingBottom: 2}}
                      item
                      xs={6}>
                      <Typography
                        variant='h6'
                        className={classes.titleSecondary}
                        align='center'>
                        {isConvert ? 'Convert' : 'Send'}
                      </Typography>
                    </Grid>
                    <Grid
                      style={{paddingLeft: 8, paddingBottom: 2}}
                      item
                      xs={6}>
                      <Typography
                        className={classes.valueSend}
                        variant='h6'
                        align='center'>{`${sellAmount} ${tokenFrom.symbol}`}</Typography>
                    </Grid>

                    <Grid item xs={6} />
                    <Grid item xs={6}>
                      <Box
                        color='grey.400'
                        textAlign='center'
                        className={classes.textRes}>
                        <ArrowDownwardOutlined />
                      </Box>
                    </Grid>

                    <Grid
                      style={{
                        paddingRight: 8,
                        paddingTop: 0,
                        paddingBottom: 16,
                      }}
                      item
                      xs={6}>
                      <Typography
                        variant='h6'
                        className={classes.titleSecondary}
                        align='center'>
                        {isConvert ? 'To' : 'Receive'}
                      </Typography>
                    </Grid>
                    <Grid
                      style={{paddingLeft: 8, paddingTop: 0, paddingBottom: 16}}
                      item
                      xs={6}>
                      <Typography
                        className={classes.valueReceive}
                        variant='h6'
                        align='center'>
                        {(isMarket || isConvert
                          ? buyAmount.toFixed(6)
                          : limitReceive) +
                          ' ' +
                          tokenTo.symbol}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid
                        container
                        justify='center'
                        alignItems='center'
                        spacing={3}
                        style={{marginBottom: 10}}
                        className={classes.contentBox}>
                        {!isConvert && (
                          <>
                            <Grid style={{paddingTop: 0}} item xs={12}>
                              <Grid container>
                                <Grid style={{padding: 0}} item xs={12} sm={3}>
                                  <Typography className={classes.textSecondary}>
                                    At Price
                                  </Typography>
                                </Grid>
                                <Grid style={{padding: 0}} item xs={12} sm={9}>
                                  <Typography
                                    className={classes.textPrimary}
                                    align='right'>
                                    {`${displayPrice} ${firstSymbol} per ${secondSymbol}`}
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

                            <Grid style={{paddingTop: 0}} item xs={12}>
                              <Grid container>
                                <Grid style={{padding: 0}} item xs={12} sm={4}>
                                  <Typography className={classes.textSecondary}>
                                    Estimated Fee
                                  </Typography>
                                </Grid>
                                <Grid style={{padding: 0}} item xs={12} sm={8}>
                                  <Typography
                                    className={classes.textPrimary}
                                    align='right'>
                                    {estimatedFeeUSD}
                                    {` ${fee.toFixed(
                                      6,
                                    )} ${GET_NATIVE_COIN_FROM_NETWORK_NAME(
                                      networkName,
                                    ).toUpperCase()}`}{' '}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}

                        {!isMarket && !isConvert && (
                          <>
                            <Grid style={{paddingTop: 0}} item xs={12}>
                              <Grid container>
                                <Grid style={{padding: 0}} item xs={12} sm={4}>
                                  <Typography className={classes.textSecondary}>
                                    Expiry
                                  </Typography>
                                </Grid>
                                <Grid style={{padding: 0}} item xs={12} sm={8}>
                                  <Typography
                                    className={classes.textPrimary}
                                    align='right'>
                                    {expiryFn.toLocaleDateString() +
                                      ' - ' +
                                      expiryFn.toLocaleTimeString()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}

                        {isMarket && !isConvert && (
                          <>
                            <Grid item xs={6}>
                              <Box display='flex'>
                                <Box marginRight={2}>
                                  <Typography className={classes.textSecondary}>
                                    Slippage
                                  </Typography>
                                </Box>

                                <IconButton
                                  size='small'
                                  className={classes.textSecondary}
                                  onClick={handleClickGuaranteedPrice}>
                                  <HelpOutlineIcon fontSize='small' />
                                </IconButton>
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
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box display='flex' justifyContent={'flex-end'}>
                                <TextField
                                  style={{width: 90}}
                                  id='slippage_inp'
                                  variant='outlined'
                                  type='number'
                                  inputProps={{min: 0, max: 1, step: 0.01}}
                                  value={slippage}
                                  onChange={(e) => {
                                    setSlippage(Number(e.target.value));
                                  }}
                                />
                              </Box>
                            </Grid>
                          </>
                        )}

                        {(isMarket || isConvert) && (
                          <>
                            <Grid item xs={6}>
                              <Typography className={classes.textSecondary}>
                                Gas Price (Gwei)
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Box display='flex' justifyContent={'flex-end'}>
                                <TextField
                                  style={{width: 90}}
                                  variant='outlined'
                                  type='number'
                                  value={displayGasPrice}
                                  inputProps={{min: 0, max: 1000, step: 1}}
                                  onChange={(e) =>
                                    handleChangeDisplayGasPrice(e.target.value)
                                  }
                                />
                              </Box>
                            </Grid>

                            <Grid
                              style={{paddingTop: 10, paddingBottom: 0}}
                              item
                              xs={12}>
                              <GasOptionsWrapper>
                                <GasOption
                                  isSelected={selectedGasOption === 'low'}
                                  onClick={() =>
                                    handleChangeSelectedGasPrice(
                                      lowGasPrice,
                                      'low',
                                    )
                                  }>
                                  <Typography
                                    style={{fontSize: 14, fontWeight: 600}}>
                                    {`${displayLowGas} Gwei`}
                                  </Typography>
                                  <Typography style={{fontWeight: 600}}>
                                    Low
                                  </Typography>
                                </GasOption>

                                <GasOption
                                  isSelected={selectedGasOption === 'default'}
                                  onClick={() =>
                                    handleChangeSelectedGasPrice(
                                      defaultGasPrice,
                                      'default',
                                    )
                                  }>
                                  <Typography
                                    style={{fontSize: 14, fontWeight: 600}}>
                                    {`${displayDefaultGas} Gwei`}
                                  </Typography>
                                  <Typography style={{fontWeight: 600}}>
                                    Default
                                  </Typography>
                                </GasOption>

                                <GasOption
                                  isSelected={selectedGasOption === 'fast'}
                                  onClick={() =>
                                    handleChangeSelectedGasPrice(
                                      fastGasPrice,
                                      'fast',
                                    )
                                  }>
                                  <Typography
                                    style={{fontSize: 14, fontWeight: 600}}>
                                    {`${displayFastGas} Gwei`}
                                  </Typography>
                                  <Typography style={{fontWeight: 600}}>
                                    Fast
                                  </Typography>
                                </GasOption>
                              </GasOptionsWrapper>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        {loading ? (
          <LoadingStep currentStepIndex={currentStepIndex} />
        ) : (
          <>
            {currentStep === Steps.ERROR && (
              <ErrorStep step={currentStep} error={error} onClose={onClose} />
            )}
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

            {currentStep === Steps.MARKET && (
              <MarketStep
                account={account}
                quote={quote}
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

        {currentStepIndex !== -1 && (
          <ProgressBar steps={steps} currentStepIndex={currentStepIndex} />
        )}
      </DialogActions>
    </>
  );
};

export default OrderContent;
