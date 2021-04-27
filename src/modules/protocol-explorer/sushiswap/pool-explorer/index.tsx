import React, {  useState } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';

import { Box, Grid, Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';

import { EXCHANGE } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { RouteComponentProps } from 'react-router';
import { MintBurn } from 'types/app';

import { truncateAddress } from 'utils';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import { Loader } from '@crema';
import Info from '../pair-explorer/info-amm';
import { useAMMPairExplorer } from 'hooks/useAMMPairExplorer';
import AMMPoolHistory from './OrderNTransaction';
import { useAMMPoolHistory } from 'hooks/useAMMPoolHistory';


type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>

const PoolExplorer: React.FC<Props> = (props) => {
  const { match: { params } } = props;
  const { address } = params;


 
  const {isLoadingInfo, infoData} = useAMMPairExplorer(address, EXCHANGE.SUSHISWAP)
  const {poolHistory, isLoading, totalEvents, onChangePage, onChangeRowsPerPage, page, rowsPerPage } = useAMMPoolHistory(address, EXCHANGE.SUSHISWAP);



  return (
    <Box pt={{ xl: 4 }} clone>
      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/protocol-explorer/sushiswap/pool-explorer">Protocol Explorer</Link>
            <Link color="inherit" href="/protocol-explorer/sushiswap/pool-explorer">SushiSwap</Link>
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
            <TokenSearchByList url={`/protocol-explorer/sushiswap/pool-explorer`} type='pair' />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <AMMPoolHistory 
            transactionData={poolHistory} 
            isLoading={isLoading}
            total={totalEvents} 
            page={page}
            perPage={rowsPerPage}
            onChangePage={onChangePage}
            onChangePerPage={onChangeRowsPerPage}
          />
        </Grid>

      </GridContainer>
    </Box>
  );
};

export default PoolExplorer;
