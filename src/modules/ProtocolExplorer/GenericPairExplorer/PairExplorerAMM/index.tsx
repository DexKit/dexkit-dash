import React, {useContext} from 'react';

// import {Paper} from '@material-ui/core';
// import Box from '@material-ui/core/Box';
// import Grid from '@material-ui/core/Grid';

// import GridContainer from '../../../../@crema/core/GridContainer';

import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';
import {useAMMPairExplorer} from 'hooks/protocolExplorer/useAMMPairExplorer';
// import {useAMMPairTrades} from 'hooks/useAMMPairTrades';
// import PageTitle from 'shared/components/PageTitle';
// import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
// import {truncateAddress} from 'utils';
// import {TokenSearch} from 'shared/components/TokenSearch';
// import {Loader, AppContext} from '@crema';
// import InfoAMM from 'modules/protocol-explorer/common/info-amm';
// import AMMTradeHistory from 'modules/protocol-explorer/common/AMMTradeHistory';
// import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import AppContextPropsType from 'types/AppContextPropsType';

// const TVChartContainer = React.lazy(
//   () => import('../../../../shared/components/chart/TvChart/tv_chart'),
// );

type Props = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

const PairExplorerAMM = (props: Props) => {
  const {networkName, exchange, address} = props;

  // const {
  //   isLoadingTrades,
  //   trades,
  //   totalTrades,
  //   page,
  //   rowsPerPage,
  //   onChangePage,
  //   onChangeRowsPerPage,
  // } = useAMMPairTrades(address, exchange);

  const {loading, error, data} = useAMMPairExplorer({address, exchange});

  // const {theme} = useContext<AppContextPropsType>(AppContext);
  // const isDark = theme.palette.type === ThemeMode.DARK;

  return (
    <>
      <h1>
        AMM {networkName} {exchange} {address}
      </h1>
      {/* <GridContainer>
        <Grid item xs={12} md={5}>
          <Grid item xs={12} md={12}>
            <Paper style={{padding: 10}}>
              {exchange && (
                <TokenSearchByList exchangeName={exchange} type={'pair'} />
              )}
            </Paper>
          </Grid>
          {isLoadingInfo ? (
            <Loader />
          ) : (
            infoData && (
              <Paper style={{marginTop: 20}}>
                <InfoAMM data={infoData} exchange={exchange} />
              </Paper>
            )
          )}
        </Grid>

        <Grid item xs={12} md={7}>
          <Grid style={{marginTop: 20}} item xs={12} md={12}>
            {infoData && (
              <Grid item xs={12} md={12} style={{height: 450}}>
                <TVChartContainer
                  symbol={`${infoData?.baseToken.symbol}-${infoData?.quoteToken.symbol}`}
                  chainId={1}
                  darkMode={isDark}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid style={{marginTop: 20}} item xs={12} md={12}>
          <AMMTradeHistory
            transactionData={trades}
            isLoading={isLoadingTrades}
            total={totalTrades}
            page={page}
            perPage={rowsPerPage}
            onChangePage={onChangePage}
            onChangePerPage={onChangeRowsPerPage}
            exchange={exchange}
            networkName={networkName}
          />
        </Grid>
      </GridContainer> */}
    </>
  );
};

export default PairExplorerAMM;
