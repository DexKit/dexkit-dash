import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import { OrderData } from 'types/app';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';

interface Props {
  exchange: EXCHANGE;
  network: NETWORK;
  transactionData: OrderData[];
}

const OrderNTransaction: React.FC<Props> = ({exchange, network, transactionData}) => {
  const {messages} = useIntl();

  return (
    <AppCard height={1} title={messages['app.tradeHistory']}>
      <TransactionTable transactionData={transactionData} exchange={exchange} network={network} />
    </AppCard>
  );
};

export default OrderNTransaction;
