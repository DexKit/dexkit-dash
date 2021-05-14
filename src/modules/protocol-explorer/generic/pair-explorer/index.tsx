import React, {useContext} from 'react';

import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';

import {Paper} from '@material-ui/core';
import {EXCHANGE, NETWORK, ThemeMode} from 'shared/constants/AppEnums';
import {useChainId} from 'hooks/useChainId';
import {extractPairFromAddress} from 'utils/tokens';
import {usePairExplorer} from 'hooks/usePairExplorer';
import PageTitle from 'shared/components/PageTitle';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {truncateAddress} from 'utils';
import {TokenSearch} from 'shared/components/TokenSearch';
import {Loader, AppContext} from '@crema';
import TokenOrders from 'modules/protocol-explorer/common/TokenOrders';
import Info from 'modules/protocol-explorer/common/info';
import {TokenSearchByList} from 'shared/components/TokenSearchByList';
import AppContextPropsType from 'types/AppContextPropsType';

const TVChartContainer = React.lazy(
  () => import('../../../../shared/components/chart/TvChart/tv_chart'),
);

type Props = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
};

const PairExplorer = (props: Props) => {
  const {networkName, exchange, address} = props;

  const {currentChainId} = useChainId();
  const {baseAddress, quoteAddress} = extractPairFromAddress(
    address,
    currentChainId,
  );

  const {isLoadingInfo, infoData} = usePairExplorer(
    baseAddress,
    quoteAddress,
    exchange,
  );
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

  return (
    <>
      <Box pt={{xl: 4}}>
        <PageTitle
          address={address}
          history={
            exchange == EXCHANGE.ALL
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
                    url: `/${networkName}/protocol-explorer/${exchange}/pair-explorer`,
                    name: GET_EXCHANGE_NAME(exchange),
                  },
                ]
          }
          active={`Pair Explorer`}
          title={
            exchange == EXCHANGE.ALL
              ? `Pair Explorer`
              : `Pair Explorer ${truncateAddress(address)}`
          }
        />

        <GridContainer>
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
                  <Info data={infoData} />
                </Paper>
              )
            )}
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid style={{marginTop: 20}} item xs={12} md={12}>
              {infoData && (
                <Grid item xs={12} md={12} style={{height: 450}}>
                  <TVChartContainer
                    symbol={`${infoData?.baseToken.symbol}-USD`}
                    chainId={1}
                    darkMode={isDark}
                  />
                </Grid>
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
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
