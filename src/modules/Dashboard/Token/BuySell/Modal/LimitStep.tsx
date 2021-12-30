import React from 'react';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';
import {Button, Typography} from '@material-ui/core';
import useZrx from 'hooks/useZrx';
import {Token} from 'types/app';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import {onAddNotification} from 'redux/actions';
import {NotificationType} from 'services/notification';
import {FEE_RECIPIENT} from 'shared/constants/Blockchain';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

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
    onNext,
    onLoading,
    onRequestConfirmed,
  } = props;

  const {getWeb3} = useWeb3();
  const {createOrder} = useZrx();
  const dispatch = useDispatch();
  const {messages} = useIntl();

  // const classes = useStyles();

  const handleAction = () => {
    try {
      onLoading(true);
      onRequestConfirmed(true);

      if (!account) {
        throw new Error('Account address cannot be null or empty');
      }

      const web3 = getWeb3();

      if (!web3) {
        throw new Error('Provider cannot be null');
      }

      createOrder(tokenFrom, tokenTo, amountFrom, price, expiry, FEE_RECIPIENT)
        .then((e) => {
          const notification: Notification = {
            title: messages['app.dashboard.limitOrder'] as string,
            body: messages['app.dashboard.orderSuccessPlaced'] as string,
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
        <IntlMessages id='app.dashboard.wouldLikeToConfirmLimitOrder' />
      </Typography>
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        <IntlMessages id='app.dashboard.confirm' />
      </Button>
    </>
  );
};

export default LimitStep;
