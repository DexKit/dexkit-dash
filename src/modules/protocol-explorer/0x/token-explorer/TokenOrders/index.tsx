import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3 } from 'hooks/useWeb3';
import CTable from './CTable';
import Box from '@material-ui/core/Box';
import { getTokenOrders } from 'services/graphql/bitquery';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { OrderData } from 'types/app';
import AppCard from '@crema/core/AppCard';

interface Props {
  address: string
}

const TokenOrders: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    setTableData([]);
    setIsLoading(true);
    getTokenOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ZEROX, props.address, 10, 0, null, null)
      .then(orders =>{setIsLoading(false); setTableData(orders)})
      .catch(e =>  setIsLoading(false))
  }, [props.address]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['app.tradeHistory']}>
        <CTable data={tableData} isLoading={isLoading} />
      </AppCard>
    </Box>
  );
};

export default TokenOrders;
