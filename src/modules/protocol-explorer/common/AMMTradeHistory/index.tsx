import React from 'react';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import { OrderData } from 'types/app';
import AppCard from '@crema/core/AppCard';
import { NETWORK, EXCHANGE } from 'shared/constants/AppEnums';

interface Props {
  transactionData: OrderData[];
  isLoading: boolean;
  page: number;
  total: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
  networkName: NETWORK;
  exchange: EXCHANGE;
}

const AMMTradeHistory: React.FC<Props> = (props: Props) => {
  const {messages} = useIntl();

  return (
    <AppCard height={1} title={messages['app.tradeHistory']}>
      <TransactionTable {...props} />
    </AppCard>
  );
};

export default AMMTradeHistory;
