import React, {PropsWithChildren} from 'react';
import {RouteComponentProps} from 'react-router';

import {Box, Grid, Paper} from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';

import {useAMMPairExplorer} from 'hooks/protocolExplorer/useAMMPairExplorer';
import {truncateAddress} from 'utils';

import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';

// import InfoAMM from 'modules/ProtocolExplorer/Common/InfoAMM';
// import {TokenSearch} from 'shared/components/TokenSearch';
// import {useAMMPoolHistory} from 'hooks/useAMMPoolHistory';
// import Loader from '@crema/core/Loader';
// import AMMPoolHistory from 'modules/protocol-explorer/common/AMMPoolHistory';
// import {TokenSearchByList} from 'shared/components/TokenSearchByList';

type Params = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params> & PropsWithChildren<Params>;

const PoolExplorer: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;

  const {networkName, exchange, address} = params;

  const ammPairExplorer = useAMMPairExplorer({address, exchange});

  // const {
  //   poolHistory,
  //   isLoading,
  //   totalEvents,
  //   onChangePage,
  //   onChangeRowsPerPage,
  //   page,
  //   rowsPerPage } =  useAMMPoolHistory(address, exchange);

  return (
    <Box pt={{xl: 4}}>
      <PageTitle
        history={
          exchange === EXCHANGE.ALL
            ? [
                {
                  url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                  name: 'Protocol Explorer',
                },
              ]
            : [
                {
                  url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                  name: 'Protocol Explorer',
                },
                {
                  url: `/${networkName}/protocol-explorer/${exchange}/pool-explorer`,
                  name: GET_EXCHANGE_NAME(exchange),
                },
              ]
        }
        active={`Pool Explorer`}
        title={
          exchange === EXCHANGE.ALL
            ? `Pool Explorer`
            : `Pool Explorer ${truncateAddress(address)}`
        }
        address={address}
      />

      <GridContainer>
        <Grid item xs={12} md={7}>
          {ammPairExplorer.loading ? (
            <LoadingView />
          ) : ammPairExplorer.error ? (
            <ErrorView message={ammPairExplorer.error.message} />
          ) : (
            <></>
            // <InfoAMM data={ammPairExplorer.data} exchange={exchange} />
          )}
        </Grid>

        {/* <Grid item xs={12} md={5}>
          <Paper style={{padding: 10}}>
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
        </Grid> */}
      </GridContainer>
    </Box>
  );
};

export default PoolExplorer;
