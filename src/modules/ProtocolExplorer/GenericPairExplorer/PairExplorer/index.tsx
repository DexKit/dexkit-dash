import React, {useContext} from 'react';
import {useChainId} from 'hooks/useChainId';
import {usePairExplorer} from 'hooks/protocolExplorer/usePairExplorer';
import {extractPairFromAddress} from 'utils/tokens';
import GridContainer from '../../../../@crema/core/GridContainer';
import {Fade, Grid, Paper} from '@material-ui/core';
import {AppContext} from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';
import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';
import Info from 'modules/ProtocolExplorer/Common/Info';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import {Skeleton} from '@material-ui/lab';
import { GET_CHAIN_FROM_NETWORK } from 'shared/constants/Blockchain';

const TVChartContainer = React.lazy(
  () => import('../../../../shared/components/chart/TvChart/tv_chart'),
);

type Props = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

const PairExplorer = (props: Props) => {
  const {networkName, exchange, address} = props;
  const chainId =  GET_CHAIN_FROM_NETWORK(networkName);

  const {baseAddress, quoteAddress} = extractPairFromAddress(
    address,
    chainId,
  );

  const {loading, error, data} = usePairExplorer({
    baseAddress,
    quoteAddress,
    exchange,
    networkName,
  });

  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

  return (
    <>
      <GridContainer>
        <Grid item xs={12} md={5}>
          <Grid item xs={12} md={12}>
            <Paper style={{padding: 10}}>
              {exchange && (
                <TokenSearchByList exchangeName={exchange} type={'pair'} networkName={networkName} />
              )}
            </Paper>
          </Grid>
          <Paper style={{marginTop: 20}}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <Info data={data} loading={loading} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Fade in={true} timeout={1000}>
            <Grid item xs={12} md={12}>
              {loading ? (
                <Skeleton variant='rect' height={370} />
              ) : error ? (
                <ErrorView message={error.message} />
              ) : (
                data && (
                  <Grid item xs={12} md={12} style={{height: 450}}>
                    <TVChartContainer
                      symbol={`${data.baseCurrency?.symbol}-USD`}
                      chainId={1}
                      darkMode={isDark}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Fade>
        </Grid>

        <Grid style={{marginTop: 20}} item xs={12} md={12}>
          <TokenOrders
            networkName={networkName}
            baseAddress={baseAddress}
            quoteAddress={quoteAddress}
            exchange={exchange}
            type={'pair'}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default PairExplorer;
