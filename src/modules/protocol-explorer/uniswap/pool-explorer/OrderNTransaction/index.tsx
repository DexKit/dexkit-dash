import React from 'react';
import {useIntl} from 'react-intl';
import {MintBurn} from 'types/app';
import AppCard from '../../../../../@crema/core/AppCard';
import TransactionTable from './TransactionTable';

interface Props {
  transactionData: MintBurn[];
  isLoading: boolean;
}

const OrderNTransaction: React.FC<Props> = ({transactionData, isLoading}) => {
 
  const {messages} = useIntl();
  return (
    <AppCard height={1} title={messages["app.pool"]}>
      <TransactionTable transactionData={transactionData} isLoading={isLoading} />
    </AppCard>
  );
};

export default OrderNTransaction;
