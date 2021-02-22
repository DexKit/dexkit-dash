import React from 'react';
import AppCard from '../../../../../@crema/core/AppCard';
import AppSelect from '../../../../../@crema/core/AppSelect';
import {useIntl} from 'react-intl';
import {TransactionDataNew} from '../../../../../types/models/Analytics';
import TransactionTable from './TransactionTable';
interface Props {
  transactionData: TransactionDataNew[];
}

enum Filters{
  LAST_HOUR = 'Last hour',
  LAST_WEEKS = 'Last Weeks',
  LAST_MONTH = 'Last Month'
}

const OrderNTransaction: React.FC<Props> = ({transactionData}) => {
  const handleSelectionType = (data: any) => {
    
    if(data === Filters.LAST_HOUR){
      console.log(Filters.LAST_HOUR);
    } else if(data === Filters.LAST_WEEKS){
      console.log(Filters.LAST_WEEKS);
    } else{
      console.log(Filters.LAST_MONTH);
    }
  };
  const {messages} = useIntl();
  return (
    <AppCard
      height={1}
      title={'Trade History'}
      action={
        <AppSelect
        menus={[
          'Last hour',
          messages['dashboard.lastWeeks'],
          messages['dashboard.lastMonth'],
        ]}
        defaultValue={'Last hour'}
        onChange={handleSelectionType}
      />
      }>
      <TransactionTable transactionData={transactionData} />
    </AppCard>
  );
};

export default OrderNTransaction;
