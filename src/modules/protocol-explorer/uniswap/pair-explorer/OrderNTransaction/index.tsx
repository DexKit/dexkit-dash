import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import {useIntl} from 'react-intl';
import {TransactionDataNew} from '../../../../../types/models/Analytics';
import TransactionTable from './TransactionTable';

interface Props {
  transactionData: TransactionDataNew[];
}

const OrderNTransaction: React.FC<Props> = ({transactionData}) => {
  const {messages} = useIntl();

  return (
    <AppCard height={1} title={'Trade History'}>
      <TransactionTable transactionData={transactionData} />
    </AppCard>
  );
};

export default OrderNTransaction;
