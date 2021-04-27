import React, { PropsWithChildren, useEffect, useState } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import { Box, Grid, Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrderNTransaction from './OrderNTransaction';
import { getPool } from 'services/graphql/bitquery';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { RouteComponentProps } from 'react-router';
import { MintBurn } from 'types/app';
import { TokenSearch } from 'shared/components/TokenSearch';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { truncateAddress } from 'utils';
import PageTitle from 'shared/components/PageTitle';

type PropsParams = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
}

type Props = RouteComponentProps<PropsParams> & PropsWithChildren<PropsParams>;

const PoolExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {networkName, exchange, address} = params;

  const {chainId} = useWeb3();
  const [tableData, setTableData] = useState<MintBurn[]>([]);
 
  useEffect(() => {
    getPool(networkName, EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId), 5)
      .then(orders => { setTableData(orders) })
      .catch(e => console.log(e))
  }, [address, networkName, chainId]);

  return (
    <Box pt={{ xl: 4 }}>

      <PageTitle
        history={
          exchange == EXCHANGE.ALL ? [
            {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
          ]:[
            {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
            {url:`/${networkName}/protocol-explorer/${exchange}/pool-explorer`, name:  GET_EXCHANGE_NAME(exchange)}
          ]}
        active={`Pool Explorer`}
        title={exchange == EXCHANGE.ALL ? `Pool Explorer` : `Pool Explorer ${truncateAddress(address)}`}
      />

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Paper style={{ padding: 10 }}>
            <TokenSearch type={'pair'} exchangeName={exchange} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <OrderNTransaction transactionData={tableData} />
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default PoolExplorer;
