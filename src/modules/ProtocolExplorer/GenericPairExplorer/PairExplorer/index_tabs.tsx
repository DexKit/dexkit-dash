import React, { useContext, useEffect, useState } from 'react';
import { usePairExplorer } from 'hooks/protocolExplorer/usePairExplorer';
import { extractPairFromAddressFromNetworkName, getNativeCoinWrappedAddressFromNetworkName } from 'utils/tokens';
import GridContainer from '../../../../@crema/core/GridContainer';
import { AppBar, Fade, Grid, Paper, Tab, Tabs, Box, Hidden } from '@material-ui/core';
import { AppContext } from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';
import { EXCHANGE, EthereumNetwork, ThemeMode, Fonts } from 'shared/constants/AppEnums';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import { RouteComponentProps } from 'react-router-dom';
import { TokenFilterProvider } from 'providers/protocol/tokenFilterProvider';

import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';
import Info from 'modules/ProtocolExplorer/Common/Info';
import PageTitle from 'shared/components/PageTitle';
import ErrorView from 'modules/Common/ErrorView';
import { Skeleton } from '@material-ui/lab';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import { TokenSearch } from 'shared/components/TokenSearch';
import { useHistory } from 'react-router-dom';
import { Token } from 'types/app';

import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import TokenPairs from 'modules/ProtocolExplorer/Common/TokenPairs';
import { truncateAddress } from 'utils/text';
import TokenLogo from 'shared/components/TokenLogo';
import FavoritesAccordion from 'shared/components/Favorites';
import useMediaQuery from '@material-ui/core/useMediaQuery';
const BitqueryTVChartContainer = React.lazy(
  () => import('../../../../shared/components/chart/BitqueryTVChart/tv_chart'),
);

type Params = {
  address: string;

};

type Props = RouteComponentProps<Params>;

const PairExplorer = (props: Props) => {
  const {
    match: { params },
  } = props;

  const { address } = params;
  const history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  const [networkName, setNetworkName] = useState<EthereumNetwork>(searchParams.get('network') as EthereumNetwork ?? EthereumNetwork.ethereum)

  const { baseAddress, quoteAddress } = extractPairFromAddressFromNetworkName(
    address,
    networkName,
  );
  useEffect(
    ()=> {

    if(searchParams.get('network') !== networkName){
      setNetworkName(searchParams.get('network') as EthereumNetwork ?? EthereumNetwork.ethereum)
    }

  }, [history.location.search])

  const isMobile = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));
  const { loading, error, data } = usePairExplorer({
    baseAddress,
    quoteAddress,
    exchange: EXCHANGE.ALL,
    networkName,
  });

  const onClickSearch = (token: Token) => {
    if (!token) {
      return;
    }
    let searchParams = new URLSearchParams(history.location.search);
    const net = token.networkName ?? EthereumNetwork.ethereum;
    searchParams.set('network', net);
    setNetworkName(net);
    history.push({ pathname: `/protocol-explorer/pair-explorer/${token.address || token.symbol}-${getNativeCoinWrappedAddressFromNetworkName(net)}`, search: searchParams.toString() });
  }

  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'overview');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({ search: searchParams.toString() });

    setValue(newValue);
  };

  const { theme } = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;
  const title =
    data ? <Box display='flex' alignItems='center'>
      <TokenLogo
        token0={data?.baseCurrency?.address || ''}
        token1={data?.quoteCurrency?.address || ''}
        networkName={networkName}
      />
      <Box
        component='h3'
        color='text.primary'
        fontWeight={Fonts.BOLD}
        fontSize={20}
        mr={2}>
        {data?.baseCurrency?.symbol}/{data?.quoteCurrency?.symbol}
      </Box>
    </Box> : null;


  return (

    <Box pt={{ xl: 4 }}>
      <PageTitle
        breadcrumbs={{
          history: [
            {
              url: `/protocol-explorer/pair-explorer`,
              name: 'Pair Explorer',
            },
          ],
          active: { name: 'Pair Explorer' },
        }}
        title={{ name: 'Pair Explorer', component: title }}
        subtitle={{ name: !isMobile ? truncateAddress(baseAddress) : '', hasCopy: baseAddress }}
        network={networkName}
        shareButton={true}
      />
      <GridContainer>
        <Grid item xs={12} md={12}>
          <Grid item xs={12} md={12}>
            <Paper style={{ padding: 10 }}>
              <TokenSearch onClick={onClickSearch} selectedTokenAddress={baseAddress} />
            </Paper>
          </Grid>
        </Grid>
        <TokenFilterProvider>
          <TabContext value={value}>
            <AppBar position="static" color='transparent'>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="wallet tabs"
              >
                <Tab value="overview" icon={<RemoveRedEyeIcon />} label={!isMobile ? "Overview": ''} />
                <Tab value="trade-history" icon={<SwapHorizontalCircleIcon />} label={!isMobile ? "Trade History" : ''} />
                <Tab value="top-pairs" icon={<EmojiEventsIcon />} label={!isMobile ? "Top Pairs": ''} />
              </Tabs>
            </AppBar>
            <Grid item xs={12} md={12}>
              <TabPanel value="overview">
                <GridContainer>
                  <Grid item xs={12} md={5}>
                    <GridContainer>
                      <Grid item xs={12} md={12}>
                        <Paper style={{ marginTop: 20 }}>
                          {error ? (
                            <ErrorView message={error.message} />
                          ) : (
                            <Info data={data} loading={loading} networkName={networkName} />
                          )}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <FavoritesAccordion type={'pair'} />
                      </Grid>
                    </GridContainer>

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
                            <Grid item xs={12} md={12} style={{ height: 450 }}>
                              <BitqueryTVChartContainer symbol={`${networkName}:${data?.baseCurrency?.symbol.toUpperCase()}:${data?.baseCurrency?.address}`} darkMode={isDark} />
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Fade>
                  </Grid>
                  <Hidden mdDown={true}>
                    <Grid item xs={12} md={12}>
                      <TokenOrders
                        networkName={networkName}
                        baseAddress={baseAddress}
                        quoteAddress={quoteAddress}
                        exchange={EXCHANGE.ALL}
                        type={'token'}
                      />
                    </Grid>
                  </Hidden>
                </GridContainer>
              </TabPanel>

              <TabPanel value="top-pairs">

                <TokenPairs
                  baseAddress={baseAddress}
                  exchange={EXCHANGE.ALL}
                  networkName={networkName}
                />

              </TabPanel>


              <TabPanel value="trade-history">
                <TokenOrders
                  networkName={networkName}
                  baseAddress={baseAddress}
                  quoteAddress={quoteAddress}
                  exchange={EXCHANGE.ALL}
                  type={'token'}
                />
              </TabPanel>
            </Grid>

          </TabContext>
        </TokenFilterProvider>



      </GridContainer>
    </Box>
  );
};

export default PairExplorer;
