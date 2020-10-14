import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import TokenTable from './TokenTable';
import AppSelect from '../../../../../@crema/core/AppSelect';
import {useIntl} from 'react-intl';
import {TransactionData} from '../../../../../types/models/Analytics';

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
      title={messages['dashboard.analytics.ordersTransaction']}
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
      <TokenTable transactionData={transactionData} />
    </AppCard>
  );
};

export default OrderNTransaction;
