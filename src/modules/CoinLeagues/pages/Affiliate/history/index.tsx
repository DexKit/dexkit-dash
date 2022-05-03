import React from 'react';
import TransactionTable from './TransactionTable';

interface Props {
  data: any | undefined;
  isLoading: boolean;
  page: number;
  total: number;
  isNFT: boolean;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const AffiliateHistory: React.FC<Props> = (props: Props) => {
  return <TransactionTable {...props} />;
};

export default AffiliateHistory;
