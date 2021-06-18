import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
import useZrx from 'hooks/useZrx';
import {Token} from 'types/app';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {NotificationType} from 'services/notification';
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
  onRequestConfirmed: (value: boolean) => void;
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
    onRequestConfirmed,
  } = props;

  const {getWeb3} = useWeb3();
  const {createOrder} = useZrx();
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

      createOrder(
        tokenFrom,
        tokenTo,
        amountFrom,
        price,
        expiry,
        '0x000000000000000000000000000',
      )
        .then((e) => {
          const notification: Notification = {
            title: 'Limit Order',
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
