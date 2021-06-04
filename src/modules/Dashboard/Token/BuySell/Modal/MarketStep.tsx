import React, {useEffect, useState} from 'react';
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
import BigNumber from 'bignumber.js';
import {ChainId} from 'types/blockchain';
import {OrderSide, Steps, Token} from 'types/app';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import {fetchQuote} from 'services/rest/0x-api';
import {useStyles} from './index.style';
import styled from 'styled-components';
import {useWeb3} from 'hooks/useWeb3';
import {useNetwork} from 'hooks/useNetwork';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

interface Props {
  step: Steps | undefined;
  token0: Token;
  token1: Token;
  amount: BigNumber;
  account: string;
  chainId: ChainId;
  loading: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

// const ContentWrapper = styled.div`
//   width: 85%;
//   height: 85%;
//   margin-inline: auto;
//   // border: 1px solid rgba(0, 0, 0, 0.12);
//   padding: 1rem;
// `;

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

const MarketStep: React.FC<Props> = (props) => {
  const {
    step,
    token0,
    token1,
    amount,
    account,
    chainId,
    loading,
    children,
    onClose,
    onNext,
    onLoading,
  } = props;
  const {getWeb3} = useWeb3();

  const [quote, setQuote] = useState<any>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [slippage, setSlippage] = useState(0.03);
  const [selectedGasPrice, setSelectedGasPrice] = useState('0');

  const classes = useStyles();

  const networkName = useNetwork();

  useEffect(() => {
    if (step !== Steps.DONE) {
      fetchQuote(
        {
          baseToken: token0,
          quoteToken: token1,
          chainId: chainId,
          orderSide: OrderSide.Sell,
          makerAmount: amount,
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
            toTokenUnitAmount(e.sellAmount, token0.decimals).toNumber(),
          );
          setBuyAmount(
            toTokenUnitAmount(e.buyAmount, token1.decimals).toNumber(),
          );

          const gas = new BigNumber(e.gas);
          const gasPrice = new BigNumber(e.gasPrice);
          setSelectedGasPrice(gasPrice.toString());

          const feeFn = gas.multipliedBy(gasPrice);

          setFee(toTokenUnitAmount(feeFn, 18).toNumber());

          onLoading(false);
        })
        .catch((e) => {
          onNext(false, e.message);
        });
    }
  }, [step, slippage]);

  const handleAction = () => {
    try {
      onLoading(true);

      if (account == null) {
        return Promise.reject('Account address cannot be null or empty');
      }

      const web3 = getWeb3();

      if (web3 == null) {
        return Promise.reject('Provider cannot be null');
      }

      console.log(quote);

      web3.eth
        .sendTransaction({
          to: quote.to,
          from: account,
          gasPrice: selectedGasPrice,
          data: quote.data,
          value: quote.value,
        })
        .then((e) => onNext(true))
        .catch((e) => onNext(false, e.message));
    } catch (e) {
      onNext(false, e);
    }
  };

  const handleChangeGasPrice = (newGasPrice: string) => {
    setSelectedGasPrice(newGasPrice);
  };

  const [isPriceInverted, setIsPriceInverted] = useState<boolean>(false);

  const invertPrice = () => {
    setIsPriceInverted(!isPriceInverted);
  };

  let displayPrice;
  let firstSymbol;
  let secondSymbol;

  if (isPriceInverted) {
    displayPrice = quote ? 1 / quote.price : 0;
    firstSymbol = token0.symbol;
    secondSymbol = token1.symbol;
  } else {
    displayPrice = quote?.price || 0;
    firstSymbol = token1.symbol;
    secondSymbol = token0.symbol;
  }

  const displayGasPrice = (
    parseInt(selectedGasPrice) / Math.pow(10, 9)
  ).toFixed(2);

  const lowGas = ((quote?.gasPrice || 0) * 0.8).toString();
  const displayLowGas = (parseInt(lowGas) / Math.pow(10, 9)).toFixed(2);

  const defaultGas = ((quote?.gasPrice || 0) * 1).toString();
  const displayDefaultGas = (parseInt(defaultGas) / Math.pow(10, 9)).toFixed(2);

  const fastGas = ((quote?.gasPrice || 0) * 1.6).toString();
  const displayFastGas = (parseInt(fastGas) / Math.pow(10, 9)).toFixed(2);

  return (
    <>
      {/* <DialogTitle style={{paddingTop: 0}} id='form-dialog-title'>
        <Typography
          className={classes.textSecondary}
          variant='h6'
          align='center'>
          Order Confirmation
        </Typography>
      </DialogTitle> */}
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <CircularProgress style={{alignSelf: 'center'}} size='100px' />
        ) : (
          <Grid container direction='row' justify='center' alignItems='center'>
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
                align='center'>{`${sellAmount} ${token0.symbol}`}</Typography>
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
                  <Typography
                    className={classes.textPrimary}
                    align='right'>{`${buyAmount} ${token1.symbol}`}</Typography>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Typography className={classes.textSecondary}>
                    Estimated Fee
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography
                    className={classes.textPrimary}
                    align='right'>{`${fee} ETH`}</Typography>
                </Grid>

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

                <Grid item xs={12} sm={5}>
                  <Typography className={classes.textSecondary}>
                    Gas Price (Gwei)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography className={classes.textPrimary} align='right'>
                    {displayGasPrice}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <GasOptionsWrapper>
                    <GasOption
                      isSelected={lowGas === selectedGasPrice}
                      onClick={() => handleChangeGasPrice(lowGas)}>
                      <Typography style={{fontWeight: 600}}>
                        {`${displayLowGas} Gwei`}
                      </Typography>
                      <Typography style={{fontWeight: 600}}>Low</Typography>
                    </GasOption>

                    <GasOption
                      isSelected={defaultGas === selectedGasPrice}
                      onClick={() => handleChangeGasPrice(defaultGas)}>
                      <Typography style={{fontWeight: 600}}>
                        {`${displayDefaultGas} Gwei`}
                      </Typography>
                      <Typography style={{fontWeight: 600}}>Default</Typography>
                    </GasOption>

                    <GasOption
                      isSelected={fastGas === selectedGasPrice}
                      onClick={() => handleChangeGasPrice(fastGas)}>
                      <Typography style={{fontWeight: 600}}>
                        {`${displayFastGas} Gwei`}
                      </Typography>
                      <Typography style={{fontWeight: 600}}>Fast</Typography>
                    </GasOption>
                  </GasOptionsWrapper>
                  {/* <FormControl fullWidth component='fieldset'>
                    <RadioGroup
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}
                      value={selectedGasPrice}
                      onChange={handleChangeGasPrice}>
                      <FormControlLabel
                        value={(quote.gasPrice * 0.8).toString()}
                        control={<Radio color='primary' />}
                        label='Low'
                      />
                      <FormControlLabel
                        checked={
                          selectedGasPrice === (quote.gasPrice * 1).toString()
                        }
                        value={(quote.gasPrice * 1).toString()}
                        control={<Radio color='primary' />}
                        label='Default'
                      />
                      <FormControlLabel
                        value={(quote.gasPrice * 1.6).toString()}
                        control={<Radio color='primary' />}
                        label='Fast'
                      />
                    </RadioGroup>
                  </FormControl> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {step === Steps.MARKET && (
          <>
            {/* <Button color='primary' size='large' onClick={onClose}>
                  Cancel
                </Button> */}
            <Typography align='center' style={{paddingBottom: 10}}>
              Would you like to confirm your order?
            </Typography>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              size='large'
              onClick={handleAction}>
              Confirm
            </Button>
          </>
        )}
        {children}
      </DialogActions>
    </>
  );
};

export default MarketStep;
