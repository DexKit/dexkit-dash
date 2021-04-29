import React, {  useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3 } from 'hooks/useWeb3';
import CTable from './CTable';
import Box from '@material-ui/core/Box';
import {  getTokenPairs } from 'services/graphql/bitquery';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import {  TokenPair } from 'types/app';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import AppCard from '@crema/core/AppCard';

interface Props {
  address: string,
  exchange: EXCHANGE,
  networkName: NETWORK;
}

const TokenPairs: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const [tableData, setTableData] = useState<TokenPair[]>([]);
  


 
  useEffect(() => {
    setTableData([]);
    getTokenPairs(GET_NETWORK_NAME(chainId), props.exchange, props.address)
      .then(orders => setTableData(orders))
      .catch(e => console.log(e))
  }, [props.address]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['app.topPairs']}>
        <CTable data={tableData} exchange={props.exchange} networkName={props.networkName}/>
      </AppCard>
    </Box>
  );
};

export default TokenPairs;
