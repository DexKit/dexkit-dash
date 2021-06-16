import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {NotificationType} from 'services/notification';
// import {useStyles} from './index.style';

interface Props {
  account: string;
  quote: any;
  selectedGasPrice: string;
  onNext: (hasNext: boolean, errorMesage?: string) => void;
  onLoading: (value: boolean) => void;
  onRequestConfirmed: (value: boolean) => void;
}

const MarketStep: React.FC<Props> = (props) => {
  const {
    account,
    quote,
    selectedGasPrice,
    onNext,
    onLoading,
    onRequestConfirmed,
  } = props;
  const {getWeb3} = useWeb3();

  const dispatch = useDispatch();

  // const classes = useStyles();

  const handleAction = () => {
    try {
      onLoading(true);
      onRequestConfirmed(true);

      if (account == null) {
        throw new Error('Account address cannot be null or empty');
      }

      const web3 = getWeb3();

      if (web3 == null) {
        throw new Error('Provider cannot be null');
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
        .then((e) => {
          const notification: Notification = {
            title: 'Market Order',
            body: 'Successfully created',
          };
          dispatch(onAddNotification([notification], NotificationType.SUCCESS));

          onNext(true);
        })
        .catch((e) => {
          throw new Error(e.message);
        });
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
