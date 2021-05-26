import React, {useEffect, useState} from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import BigNumber from 'bignumber.js';
import {ChainId} from 'types/blockchain';
import {OrderSide, Steps, Token} from 'types/app';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {fromTokenUnitAmount, toTokenUnitAmount} from '@0x/utils';
import { fetchQuote } from 'services/rest/0x-api';

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

const OrderStep: React.FC<Props> = (props) => {
  const {step, token0, token1, amount, account, chainId, loading, onClose, onNext, onLoading} = props;
  const {getContractWrappers} = useContractWrapper();

  const [quote, setQuote] = useState<any>();
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [fee, setFee] = useState(0);

  useEffect(() => {
    if (step == Steps.ORDER) {
      console.log('START ORDER');

      fetchQuote({
        baseToken: token0,
        quoteToken: token1,
        chainId: chainId,
        orderSide: OrderSide.Sell,
        makerAmount: amount,
        // Parameters used to prevalidate quote at final
        allowedSlippage: new BigNumber(0.5),
        ethAccount: props.account,
        buyTokenPercentage: undefined,
        feeRecipient: undefined,
        affiliateAddress: undefined,
        intentOnFill: false,
      })
        .then((e) => {
          console.log(e);
          setQuote(e);
          setSellAmount(toTokenUnitAmount(e.sellAmount, token0.decimals).toNumber());
          setBuyAmount(toTokenUnitAmount(e.buyAmount, token1.decimals).toNumber());

          const gas = new BigNumber(e.gas);
          const gasPrice = new BigNumber(e.gasPrice);
          const feeFn = gas.multipliedBy(gasPrice);

          setFee(toTokenUnitAmount(feeFn, 18).toNumber());

          onLoading(false)
        })
        .catch((e) => {
          onNext(false, e);
        });
    }
  }, [step]);

  const handleAction = () => {
    try {
      if (account == null) {
        return Promise.reject('Account address cannot be null or empty');
      }

      const contractWrappers = getContractWrappers(chainId);
      const provider = contractWrappers?.getProvider();

      if (provider == null) {
        return Promise.reject('provider cannot be null');
      }

      onNext(true);
    } catch (e) {
      onNext(false, e);
    }
  };

  return (
    <>
      {!loading && (
        <>
          <DialogTitle id='form-dialog-title'>Order</DialogTitle>
          <DialogContent>
            <div
              style={{
                width: '85%',
                height: '85%',
                marginInline: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                padding: '1rem',
              }}>
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
                  <Typography align="right">{`${quote?.price} ${token0.symbol} per ${token1.symbol}`}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>Estimated Fee</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>{`${fee} ETH`}</Typography>
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  <Typography>Expires In</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography align='right'>4/26/2021, 11:32:30</Typography>
                </Grid> */}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleAction} color='primary'>
              Confirm
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default OrderStep;
