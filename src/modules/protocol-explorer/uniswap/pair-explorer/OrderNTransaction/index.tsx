import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import AppSelect from '../../../../../@crema/core/AppSelect';
import {useIntl} from 'react-intl';
import {TransactionData} from '../../../../../types/models/Analytics';
import TransactionTable from './TransactionTable';

interface Props {
  transactionData: TransactionData[];
}

const OrderNTransaction: React.FC<Props> = ({transactionData}) => {
  const handleSelectionType = (data: any) => {
    console.log('data: ', data);
  };
  const {messages} = useIntl();
  return (
    <AppCard
      height={1}
      title={'Trade History'}
      action={
        <AppSelect
          menus={[
            messages['dashboard.thisWeek'],
            messages['dashboard.lastWeeks'],
            messages['dashboard.lastMonth'],
          ]}
          defaultValue={messages['dashboard.thisWeek']}
          onChange={handleSelectionType}
        />
      }>
      <TransactionTable transactionData={transactionData} />
    </AppCard>
  );
};

export default OrderNTransaction;
