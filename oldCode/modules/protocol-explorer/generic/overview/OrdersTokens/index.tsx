import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import OrderTable from './OrderTable';
import Box from '@material-ui/core/Box';
import { getOrdersByTokens } from 'services/graphql/bitquery';
import { OrderByToken } from 'types/app';
import AppCard from '@crema/core/AppCard';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';

interface Props {
  exchange: EXCHANGE
  networkName: NETWORK;
}

const OrdersTokens: React.FC<Props> = (props) => {
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<OrderByToken[]>([]);
 
  useEffect(() => {
    getOrdersByTokens(props.networkName, props.exchange, 6, 0, null, null)
      .then(orders => setTableData(orders))
      .catch(e => console.log(e))
  }, [props]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['title.tradesByCurrencies']}>
        <OrderTable data={tableData} />
      </AppCard>
    </Box>
  );
};

export default OrdersTokens;
