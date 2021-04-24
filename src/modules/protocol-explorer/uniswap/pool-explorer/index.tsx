import React, { useEffect, useState } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import { AppState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrderNTransaction from './OrderNTransaction';
import { getPool, getPairExplorer } from 'services/graphql/bitquery';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { RouteComponentProps } from 'react-router';
import { MintBurn, PairInfoExplorer } from 'types/app';
import { TokenSearch } from 'shared/components/TokenSearch';
import { UNISWAP_ETH_PRICE } from 'services/graphql/uniswap/gql';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { truncateAddress } from 'utils';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import { Loader } from '@crema';
import Info from '../pair-explorer/info';


type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>

const PoolExplorer: React.FC<Props> = (props) => {
  const { match: { params } } = props;
  const { address } = params;

  const {chainId} = useWeb3();
  const [tableData, setTableData] = useState<MintBurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [infoData, setInfoData] = useState<PairInfoExplorer>();

  useEffect(() => {
    setIsLoading(true);
    getPool(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId), 5)
      .then(orders => { setTableData(orders); setIsLoading(false) })
      .catch(e => setIsLoading(false))

    getPairExplorer(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId))
      .then(info => { setInfoData(info);  setIsLoadingInfo(false) })
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
          <Typography variant="h4"  color="textPrimary">Pool Explorer</Typography>
        </Grid>

        <Grid item xs={12} md={7}>
          { isLoadingInfo ? <Loader/> :
              (infoData && <Info data={infoData} />)
          }
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 10 }}>
            <TokenSearchByList url={`/protocol-explorer/uniswap/pool-explorer`} type='pair' />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <OrderNTransaction transactionData={tableData} isLoading={isLoading}/>
        </Grid>

      </GridContainer>
    </Box>
  );
};

export default PoolExplorer;
