import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3 } from 'hooks/useWeb3';
import AppCard from '@crema/core/AppCard';
import Box from '@material-ui/core/Box';
import { OrderByPairs } from 'types/app';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { getOrdersByPairs } from 'services/graphql/bitquery';
import OrderTable from './OrderTable';

interface Props {
  exchange: EXCHANGE
  networkName: NETWORK;
}

const OrdersPairs: React.FC<Props> = (props) => {
  const {messages} = useIntl();
  const [tableData, setTableData] = useState<OrderByPairs[]>([]);
 
  useEffect(() => {
    getOrdersByPairs(props.networkName, props.exchange, 10, 0, null, null)
      .then(orders => setTableData(orders))
      .catch(e => console.log(e))
  }, [props]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['title.tokenOrderPairs']}>
        <OrderTable data={tableData} />
      </AppCard>
    </Box>
  );
};

export default OrdersPairs;
