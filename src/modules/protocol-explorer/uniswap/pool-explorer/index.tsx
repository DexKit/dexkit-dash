import React, { useEffect, useState } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import { AppState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrderNTransaction from './OrderNTransaction';
import { getPool } from 'services/graphql/bitquery';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { RouteComponentProps } from 'react-router';
import { MintBurn } from 'types/app';
import { TokenSearch } from 'shared/components/TokenSearch';
import { UNISWAP_ETH_PRICE } from 'services/graphql/uniswap/gql';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { truncateAddress } from 'utils';

type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>

const PoolExplorer: React.FC<Props> = (props) => {
  const { match: { params } } = props;
  const { address } = params;

  const {chainId} = useWeb3();
  const [tableData, setTableData] = useState<MintBurn[]>([]);

  useEffect(() => {
    getPool(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId), 5)
      .then(orders => { setTableData(orders) })
      .catch(e => console.log(e))
  }, [address, chainId]);

  return (
    <Box pt={{ xl: 4 }} clone>
      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/protocol-explorer/uniswap/overview">Protocol Explorer</Link>
            <Link color="inherit" href="/protocol-explorer/uniswap/overview">Uniswap</Link>
            <Typography color="textPrimary">Pool Explorer</Typography>
            <Typography color="textPrimary">{truncateAddress(address)}</Typography>
          </Breadcrumbs>
          <Typography variant="h4"  color="textPrimary">Token Explorer</Typography>
        </Grid>

        <Grid item xs={12} md={7}>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 10 }}>
            <TokenSearch url={`/protocol-explorer/uniswap/pool-explorer`} />
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
