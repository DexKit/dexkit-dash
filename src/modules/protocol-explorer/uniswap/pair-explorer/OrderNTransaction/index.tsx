import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import { OrderData } from 'types/app';

interface Props {
  transactionData: OrderData[];
}

const OrderNTransaction: React.FC<Props> = ({transactionData}) => {
  const {messages} = useIntl();

  return (
    <AppCard height={1} title={messages['app.tradeHistory']}>
      <TransactionTable transactionData={transactionData} />
    </AppCard>
  );
};

export default OrderNTransaction;
