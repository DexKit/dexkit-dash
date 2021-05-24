import React, { PropsWithChildren } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import { Box, Grid, Paper,  } from '@material-ui/core';

import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';

import { RouteComponentProps } from 'react-router';

import { TokenSearch } from 'shared/components/TokenSearch';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { truncateAddress } from 'utils';
import PageTitle from 'shared/components/PageTitle';
import { useAMMPairExplorer } from 'hooks/useAMMPairExplorer';
import { useAMMPoolHistory } from 'hooks/useAMMPoolHistory';
import Loader from '@crema/core/Loader';
import InfoAMM from 'modules/protocol-explorer/common/info-amm';
import AMMPoolHistory from 'modules/protocol-explorer/common/AMMPoolHistory';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';

type PropsParams = {
  address : string;
  exchange: EXCHANGE;
  networkName: NETWORK;
}

type Props = RouteComponentProps<PropsParams> & PropsWithChildren<PropsParams>;

const PoolExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {networkName, exchange, address} = params;

  const {isLoadingInfo, infoData} = useAMMPairExplorer(address, exchange)
  const {
    poolHistory, 
    isLoading, 
    totalEvents, 
    onChangePage, 
    onChangeRowsPerPage, 
    page, 
    rowsPerPage } =  useAMMPoolHistory(address, exchange);

  return (
    <Box pt={{ xl: 4 }}>

      <PageTitle
        history={
          exchange === EXCHANGE.ALL ? [
            {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
          ]:[
            {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
            {url:`/${networkName}/protocol-explorer/${exchange}/pool-explorer`, name:  GET_EXCHANGE_NAME(exchange)}
          ]}
        active={`Pool Explorer`}
        title={exchange == EXCHANGE.ALL ? `Pool Explorer` : `Pool Explorer ${truncateAddress(address)}`}
        address={address}
      />

      <GridContainer>
       <Grid item xs={12} md={7}>
          { isLoadingInfo ? <Loader/> :
              (infoData && <InfoAMM data={infoData} exchange={exchange}/>)
          }
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 10 }}>
          <TokenSearchByList exchangeName={exchange} type={'pool'} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <AMMPoolHistory 
            networkName={networkName}
            exchange={exchange}
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
