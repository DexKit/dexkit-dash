import React, {useContext} from 'react';
import {useAMMPairExplorer} from 'hooks/protocolExplorer/useAMMPairExplorer';
import AppContextPropsType from 'types/AppContextPropsType';
import {AppContext} from '@crema';
import GridContainer from '../../../../@crema/core/GridContainer';
import {Fade, Grid, Paper} from '@material-ui/core';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';
import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import InfoAMM from 'modules/ProtocolExplorer/Common/InfoAMM';
import ErrorView from 'modules/Common/ErrorView';
import AMMTradeHistory from 'modules/ProtocolExplorer/Common/AMMTradeHistory';
import {Skeleton} from '@material-ui/lab';
// import {useAMMPairTrades} from 'hooks/useAMMPairTrades';
// import PageTitle from 'shared/components/PageTitle';
// import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
// import {truncateAddress} from 'utils';
// import {TokenSearch} from 'shared/components/TokenSearch';

const TVChartContainer = React.lazy(
  () => import('../../../../shared/components/chart/TvChart/tv_chart'),
);

type Props = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

const PairExplorerAMM = (props: Props) => {
  const {networkName, exchange, address} = props;

  const {loading, error, data} = useAMMPairExplorer({exchange, address, networkName});

  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

  return (
    <>
      <GridContainer>
        <Grid item xs={12} md={5}>
          <Grid item xs={12} md={12}>
            <Paper style={{padding: 10}}>
              {exchange && (
                <TokenSearchByList exchangeName={exchange} type={'pair'} networkName={networkName}/>
              )}
            </Paper>
          </Grid>
          <Paper style={{marginTop: 20}}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <InfoAMM
                data={data}
                networkName={networkName}
                exchange={exchange}
                address={address}
                loading={loading}
              />
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
          <AMMTradeHistory
            networkName={networkName}
            exchange={exchange}
            address={address}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default PairExplorerAMM;
