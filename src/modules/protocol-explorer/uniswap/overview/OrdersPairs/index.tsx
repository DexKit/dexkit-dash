import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card } from '@material-ui/core';
import { useWeb3 } from 'hooks/useWeb3';
import OrderTable from './OrderTable';
import Box from '@material-ui/core/Box';
import { getOrdersByPairs } from 'services/graphql/bitquery';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { OrderByPairs } from 'types/app';
import AppCard from '@crema/core/AppCard';

interface Props {
}

const OrdersPairs: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<OrderByPairs[]>([]);
 
  useEffect(useCallback(() => {
    getOrdersByPairs(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, 10, 0, null, null)
      .then(orders => setTableData(orders))
      .catch(e => console.log(e))

  }, []), []);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['title.tokenOrderPairs']}>
        <OrderTable data={tableData} />
      </AppCard>
    </Box>
  );
};

export default OrdersPairs;
