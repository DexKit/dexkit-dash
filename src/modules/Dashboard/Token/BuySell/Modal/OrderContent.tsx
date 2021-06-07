import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useWeb3} from 'hooks/useWeb3';
import {useNetwork} from 'hooks/useNetwork';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import BigNumber from 'bignumber.js';
import {ChainId} from 'types/blockchain';
import {OrderSide, Steps, Token} from 'types/app';
import {fetchQuote} from 'services/rest/0x-api';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Input,
  TextField,
  Box,
  CircularProgress,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ApproveStep from './ApproveStep';
import ErrorStep from './ErrorStep';
import ConvertStep from './ConvertStep';
import MarketStep from './MarketStep';
import LimitStep from './LimitStep';
import DoneStep from './DoneStep';
import ProgressBar from './PogressBar';
import LoadingStep from './LoadingStep';
import {useStyles} from './index.style';
import {getExpirationTimeFromSeconds} from 'utils/time_utils';
import { GetMyBalance_ethereum_address_balances } from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

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
  chainId: ChainId;
  loading: boolean;
  error: Error | string | undefined;
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onShifting: (step: Steps) => void;
}

const GasOptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const GasOption = styled.div<{isSelected: boolean}>`
  padding: 10px 15px;
  background-color: ${(props) =>
    props.isSelected ? '#ff7149' : 'transparent'};
  border: 1px solid grey;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
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
    onClose,
    onNext,
    onLoading,
    onShifting,
  } = props;

  const classes = useStyles();
  const networkName = useNetwork();

  const [quote, setQuote] = useState<any>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [slippage, setSlippage] = useState(0.03);
  const [selectedGasPrice, setSelectedGasPrice] = useState('0');
  const [displayGasPrice, setDisplayGasPrice] = useState('0');
  const [isPriceInverted, setIsPriceInverted] = useState<boolean>(false);

  const amountFromFn = fromTokenUnitAmount(amountFrom, tokenFrom.decimals);

  useEffect(() => {
    if (currentStep !== Steps.DONE) {
      console.log('START ORDER');

      fetchQuote(
        {
          baseToken: tokenFrom,
          quoteToken: tokenTo,
          chainId: chainId,
          orderSide: OrderSide.Sell,
          makerAmount: amountFromFn,
          // Parameters used to prevalidate quote at final
          allowedSlippage: slippage,
          ethAccount: props.account,
          buyTokenPercentage: undefined,
          feeRecipient: undefined,
          affiliateAddress: undefined,
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
          handleChangeSelectedGasPrice(gasPrice.toString());

          if (isMarket) {
            const feeFn = gas.multipliedBy(gasPrice);
            setFee(toTokenUnitAmount(feeFn, 18).toNumber());
          } else {
            setFee(new BigNumber(0).toNumber());
          }

          onLoading(false);
        })
        .catch((e) => {
          onNext(false, e);
          onLoading(false);
        });
    }
  }, [currentStep, slippage]);

  const handleChangeSelectedGasPrice = (newSelectedGasPrice: string) => {
    setSelectedGasPrice(newSelectedGasPrice);

    const newDisplayGasPrice = (
      parseInt(newSelectedGasPrice) / Math.pow(10, 9)
    ).toFixed(2);

    setDisplayGasPrice(newDisplayGasPrice);
  };

  const handleChangeDisplayGasPrice = (newDisplayGasPrice: string) => {
    setDisplayGasPrice(newDisplayGasPrice);

    const newSelectedGasPrice = (
      parseFloat(newDisplayGasPrice) * Math.pow(10, 9)
    ).toString();

    setSelectedGasPrice(newSelectedGasPrice);
  };

  const invertPrice = () => {
    setIsPriceInverted(!isPriceInverted);
  };

  const expirySeconds = getExpirationTimeFromSeconds(new BigNumber(expiry));
  const expiryFn = new Date(expirySeconds.toNumber() * 1000);
  const limitReceive = (amountFrom * price).toFixed(6);

  let displayPrice;
  let firstSymbol;
  let secondSymbol;

  const validPrice = isMarket ? quote?.price || 0 : price;

  if (isPriceInverted) {
    displayPrice = parseFloat(
      (validPrice === 0 ? 0 : 1 / validPrice).toString(),
    ).toFixed(6);
    firstSymbol = tokenFrom.symbol;
    secondSymbol = tokenTo.symbol;
  } else {
    displayPrice = parseFloat(validPrice.toString()).toFixed(6);
    firstSymbol = tokenTo.symbol;
    secondSymbol = tokenFrom.symbol;
  }

  const lowGas = ((quote?.gasPrice || 0) * 0.8).toString();
  const displayLowGas = (parseInt(lowGas) / Math.pow(10, 9)).toFixed(2);

  const defaultGas = ((quote?.gasPrice || 0) * 1).toString();
  const displayDefaultGas = (parseInt(defaultGas) / Math.pow(10, 9)).toFixed(2);

  const fastGas = ((quote?.gasPrice || 0) * 1.6).toString();
  const displayFastGas = (parseInt(fastGas) / Math.pow(10, 9)).toFixed(2);

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        {loading &&
        currentStep !== Steps.MARKET &&
        currentStep !== Steps.LIMIT ? (
          <Box
            display='flex'
            flexDirection='column'
            alignContent='center'
            justifyContent='center'>
            {currentStepIndex === -1 ? (
              <>
                <Typography variant='h6' align='center'>
                  Loading your order...
                </Typography>
              </>
            ) : (
              <>
                {currentStep === Steps.CONVERT && (
                  <>
                    <Typography variant='h6' align='center'>
                      You are converting ETH to WETH for trading on DexKit
                    </Typography>
                  </>
                )}
                {(currentStep === Steps.APPROVE) && (
                  <>
                    <Typography variant='h6' align='center'>
                      You are approving {tokenFrom.symbol} for trading on DexKit
                    </Typography>
                  </>
                )}
                {(currentStep === Steps.APPROVE_WRAPPER) && (
                  <>
                    <Typography variant='h6' align='center'>
                      You are approving {tokenWrapper.symbol} for trading on DexKit
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
              </>
            )}
          </Box>
        ) : (
          <>
            {currentStep === Steps.ERROR ? (
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
            ) : (
              <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'>
                <Grid item xs={12}>
                  <Typography
                    variant='h6'
                    className={classes.textSecondary}
                    align='center'>
                    You are sending
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    className={classes.valueSend}
                    variant='h6'
                    align='center'>{`${sellAmount} ${tokenFrom.symbol}`}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid
                    container
                    justify='center'
                    alignItems='center'
                    spacing={3}
                    className={classes.contentBox}>
                    <Grid item xs={12} sm={3}>
                      <Typography className={classes.textSecondary}>
                        At Price
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Typography className={classes.textPrimary} align='right'>
                        {`${displayPrice} ${firstSymbol} per ${secondSymbol}`}
                        <IconButton
                          style={{marginLeft: 5}}
                          size='small'
                          onClick={invertPrice}>
                          <SyncAltIcon fontSize='small' />
                        </IconButton>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography className={classes.textSecondary}>
                        You Receive
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography className={classes.textPrimary} align='right'>
                        {(isMarket ? buyAmount.toFixed(6) : limitReceive) + ' ' + tokenTo.symbol}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Typography className={classes.textSecondary}>
                        Estimated Fee
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <Typography className={classes.textPrimary} align='right'>{`${fee.toFixed(6)} ETH`}</Typography>
                    </Grid>

                    {!isMarket && (
                      <>
                        <Grid item xs={12} sm={5}>
                          <Typography className={classes.textSecondary}>
                            Expiry
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <Typography className={classes.textPrimary} align='right'>
                            {expiryFn.toLocaleDateString() + ' - ' + expiryFn.toLocaleTimeString()}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    {isMarket && (
                      <>
                        <Grid item xs={12} sm={5}>
                          <Typography className={classes.textSecondary}>
                            Slippage
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <Box display='flex' justifyContent={'flex-end'}>
                            <TextField
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

                    <Grid item xs={12} sm={5}>
                      <Typography className={classes.textSecondary}>
                        Gas Price (Gwei)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <Box display='flex' justifyContent={'flex-end'}>
                        <TextField
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

                    <Grid item xs={12}>
                      <GasOptionsWrapper>
                        <GasOption
                          isSelected={lowGas === selectedGasPrice}
                          onClick={() => handleChangeSelectedGasPrice(lowGas)}>
                          <Typography style={{fontWeight: 600}}>
                            {`${displayLowGas} Gwei`}
                          </Typography>
                          <Typography style={{fontWeight: 600}}>Low</Typography>
                        </GasOption>

                        <GasOption
                          isSelected={defaultGas === selectedGasPrice}
                          onClick={() =>
                            handleChangeSelectedGasPrice(defaultGas)
                          }>
                          <Typography style={{fontWeight: 600}}>
                            {`${displayDefaultGas} Gwei`}
                          </Typography>
                          <Typography style={{fontWeight: 600}}>
                            Default
                          </Typography>
                        </GasOption>

                        <GasOption
                          isSelected={fastGas === selectedGasPrice}
                          onClick={() => handleChangeSelectedGasPrice(fastGas)}>
                          <Typography style={{fontWeight: 600}}>
                            {`${displayFastGas} Gwei`}
                          </Typography>
                          <Typography style={{fontWeight: 600}}>
                            Fast
                          </Typography>
                        </GasOption>
                      </GasOptionsWrapper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
              <ErrorStep
                step={currentStep}
                error={error}
                onClose={onClose}
                onLoading={onLoading}
              />
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
                onNext={onNext}
                onLoading={onLoading}
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
              />
            )}

            {currentStep === Steps.DONE && (
              <DoneStep
                step={currentStep}
                onClose={onClose}
                onLoading={onLoading}
              />
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
