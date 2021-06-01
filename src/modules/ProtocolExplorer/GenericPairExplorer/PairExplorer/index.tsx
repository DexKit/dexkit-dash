import React, {useContext} from 'react';
import {useChainId} from 'hooks/useChainId';
import {usePairExplorer} from 'hooks/protocolExplorer/usePairExplorer';
import {extractPairFromAddress} from 'utils/tokens';
import GridContainer from '../../../../@crema/core/GridContainer';
import {Grid, Paper} from '@material-ui/core';
import {AppContext} from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';
import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';
import Info from 'modules/ProtocolExplorer/Common/Info';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';

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
  const {currentChainId} = useChainId();

  const {baseAddress, quoteAddress} = extractPairFromAddress(
    address,
    currentChainId,
  );

  const {loading, error, data} = usePairExplorer({
    baseAddress,
    quoteAddress,
    exchange,
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
                <TokenSearchByList exchangeName={exchange} type={'pair'} />
              )}
            </Paper>
          </Grid>
          <Paper style={{marginTop: 20}}>
            {loading ? ( <LoadingView /> ) : error ? ( <ErrorView message={error.message} /> ) : (
              data && <Info data={data} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Grid item xs={12} md={12}>
            {loading ? ( <LoadingView /> ) : error ? ( <ErrorView message={error.message} /> ) : (
              data && (
                <Grid item xs={12} md={12} style={{height: 450}}>
                  <TVChartContainer
                    symbol={`${data.baseCurrency?.symbol}-${data.quoteCurrency?.symbol}`}
                    chainId={1}
                    darkMode={isDark}
                  />
                </Grid>
              )
            )}
          </Grid>
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
