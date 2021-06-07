import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
import useZrx from 'hooks/useZrx';
import {Token} from 'types/app';
// import {useStyles} from './index.style';

interface Props {
  tokenFrom: Token;
  tokenTo: Token;
  amountFrom: number;
  price: number;
  expiry: number;
  account: string;
  quote: any;
  selectedGasPrice: string;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

const LimitStep: React.FC<Props> = (props) => {
  const {
    tokenFrom,
    tokenTo,
    amountFrom,
    price,
    expiry,
    account,
    selectedGasPrice,
    onNext,
    onLoading,
  } = props;

  const {getWeb3} = useWeb3();
  const {createOrder} = useZrx();
  // const classes = useStyles();

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

      createOrder(
        tokenFrom,
        tokenTo,
        amountFrom,
        price,
        expiry,
        '0x000000000000000000000000000',
      )
        .then((e) => onNext(true))
        .catch((e) => onNext(false, e.message));
    } catch (e) {
      onNext(false, e.message);
    }
  };

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Would you like to confirm your limit order?
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        Confirm
      </Button>
    </>
  );
};

export default LimitStep;
