import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
// import {useStyles} from './index.style';

interface Props {
  account: string;
  quote: any;
  selectedGasPrice: string;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
}

const MarketStep: React.FC<Props> = (props) => {
  const {account, quote, selectedGasPrice, onNext, onLoading} = props;
  const {getWeb3} = useWeb3();

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
      onNext(false, e.message);
    }
  };

  return (
    <>
      <Typography align='center' style={{paddingBottom: 10}}>
        Would you like to confirm your market order?
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

export default MarketStep;
