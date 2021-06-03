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
import { useNetwork } from 'hooks/useNetwork';

interface Props {
  step: Steps | undefined;
  token0: Token;
  token1: Token;
  amount: BigNumber;
  account: string;
  chainId: ChainId;
  loading: boolean;
  onClose: () => void;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

const ContentWrapper = styled.div`
  width: 85%;
  height: 85%;
  margin-inline: auto;
  // border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1rem;
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

  const classes = useStyles();

  const networkName = useNetwork();

  useEffect(() => {
    if (step === Steps.MARKET) {
      console.log('START MARKET');

      fetchQuote({
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
        intentOnFill: true
      }, networkName)
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
          gasPrice: quote.gasPrice,
          data: quote.data,
          value: quote.value,
        })
        .then((e) => onNext(true))
        .catch((e) => onNext(false, e.message));
    } catch (e) {
      onNext(false, e);
    }
  };

  return (
    <>
      {!loading && (
        <>
          <DialogTitle className={classes.dialogTitle} id='form-dialog-title'>
            <Typography style={{fontWeight: 600}} variant='h5' align='center'>
              Market Order
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <ContentWrapper>
              <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
                spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography>From</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>{`${sellAmount} ${token0.symbol}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>To</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>{`${buyAmount} ${token1.symbol}`}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>Price</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>{`${quote?.price} ${token1.symbol} per ${token0.symbol}`}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>Estimated Fee</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>{`${fee} ETH`}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>Slipage</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" justifyContent={'flex-end'}>
                    <TextField
                      id="slippage_inp"
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0, max: 1, step: 0.01}}
                      value={slippage}
                      onChange={(e) => {
                        setSlippage(Number(e.target.value))
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </ContentWrapper>
          </DialogContent>
          <DialogActions>
            <Button color='primary' size='large' onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={handleAction}>
              Confirm
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default MarketStep;
