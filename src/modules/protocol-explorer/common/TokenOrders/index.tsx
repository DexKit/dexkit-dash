import React from 'react';
import { useIntl } from 'react-intl';

import CTable from './CTable';
import Box from '@material-ui/core/Box';

import { EXCHANGE } from 'shared/constants/Bitquery';

import AppCard from '@crema/core/AppCard';
import { useTokenTrades } from 'hooks/useTokenTrades';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
  type: 'pair' | 'token';
}

const TokenOrders: React.FC<Props> = (props) => {
  const {messages} = useIntl();
  const {
    trades, 
    isLoadingTrades, 
    totalTrades, 
    page, 
    rowsPerPage,
    onChangePage, 
    onChangeRowsPerPage } = useTokenTrades(props.baseAddress, props.quoteAddress, props.exchange);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['app.tradeHistory']}>
        <CTable 
          data={trades} 
          exchange={props.exchange}
          isLoading={isLoadingTrades}  
          total={totalTrades}
          page={page}
          perPage={rowsPerPage}
          onChangePage={onChangePage}
          onChangePerPage={onChangeRowsPerPage}       
          type={props.type}
          />
      </AppCard>
    </Box>
  );
};

export default TokenOrders;
