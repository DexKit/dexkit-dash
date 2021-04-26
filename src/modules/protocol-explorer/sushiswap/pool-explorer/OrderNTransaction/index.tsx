import React from 'react';
import {useIntl} from 'react-intl';
import {MintBurn} from 'types/app';
import AppCard from '../../../../../@crema/core/AppCard';
import TransactionTable from './TransactionTable';

interface Props {
  transactionData: MintBurn[];
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const AMMPoolHistory: React.FC<Props> = (props: Props) => {
 
  const {messages} = useIntl();
  return (
    <AppCard height={1} title={messages["app.pool"]}>
      <TransactionTable {...props} />
    </AppCard>
  );
};

export default AMMPoolHistory;
