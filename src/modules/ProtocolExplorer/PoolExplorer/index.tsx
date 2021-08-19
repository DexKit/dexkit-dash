import React, {PropsWithChildren} from 'react';
import {RouteComponentProps} from 'react-router';

import {useAMMPairExplorer} from 'hooks/protocolExplorer/useAMMPairExplorer';
import {truncateAddress} from 'utils';
import {Box, Grid, Paper} from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import ErrorView from 'modules/Common/ErrorView';
import InfoAMM from '../Common/InfoAMM';
import AMMPoolHistory from '../Common/AMMPoolHistory';
import {TokenFilterProvider} from 'providers/protocol/tokenFilterProvider';

// import {TokenSearch} from 'shared/components/TokenSearch';
// import {useAMMPoolHistory} from 'hooks/useAMMPoolHistory';
// import Loader from '@crema/core/Loader';

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

  const {loading, error, data} = useAMMPairExplorer({
    exchange,
    address,
    networkName,
  });

  return (
    <Box pt={{xl: 4}}>
      <PageTitle
        breadcrumbs={{
          history:
            exchange === EXCHANGE.ALL
              ? [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                    name: 'Pair Explorer',
                  },
                ]
              : [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/pool-explorer/${address}`,
                    name: 'Pair Explorer',
                  },
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/pool-explorer/${address}`,
                    name: GET_EXCHANGE_NAME(exchange),
                  },
                ],
          active: {name: 'Pool Explorer'},
        }}
        network={networkName}
        title={{name: 'Pool Explorer'}}
        subtitle={{name: truncateAddress(address), hasCopy: address}}
      />

      <GridContainer>
        <TokenFilterProvider>
          <Grid item xs={12} md={7}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <InfoAMM
                networkName={networkName}
                data={data}
                exchange={exchange}
                address={address}
                loading={loading}
              />
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper style={{padding: 10}}>
              <TokenSearchByList
                exchangeName={exchange}
                type={'pool'}
                networkName={networkName}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={12}>
            {data && (
              <AMMPoolHistory
                networkName={networkName}
                address={address}
                exchange={exchange}
                baseCurrency={data.baseCurrency}
                quoteCurrency={data.quoteCurrency}
              />
            )}
          </Grid>
        </TokenFilterProvider>
      </GridContainer>
    </Box>
  );
};

export default PoolExplorer;
