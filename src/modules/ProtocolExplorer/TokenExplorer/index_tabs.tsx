import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { AppBar, Box, Fade, Grid, Hidden, Paper, Tab, Tabs } from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';

import { truncateAddress } from 'utils';
import { EXCHANGE, EthereumNetwork, ThemeMode } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';


import TokenPairs from 'modules/ProtocolExplorer/Common/TokenPairs';
import TokenOrders from 'modules/ProtocolExplorer/Common/TokenOrders';

import { TokenFilterProvider } from 'providers/protocol/tokenFilterProvider';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import InfoIcon from '@material-ui/icons/Info';
import { TokenSearch } from 'shared/components/TokenSearch';
import { Token } from 'types/app';

import { useTokenInfo } from 'hooks/useTokenInfo';
import { InfoTab } from './Tabs/InfoTab';
import { AppContext } from '@crema';
import { Skeleton } from '@material-ui/lab';
import BitqueryTVChartContainer from 'shared/components/chart/BitqueryTVChart/tv_chart';
import AppContextPropsType from 'types/AppContextPropsType';
import { InfoMarketTab } from './Tabs/InfoMarketTab';
import TimelineIcon from '@material-ui/icons/Timeline';
import FavoritesAccordion from 'shared/components/Favorites';

import useMediaQuery from '@material-ui/core/useMediaQuery';
type Params = {
  address: string;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const {
    match: { params },
  } = props;

  const { address } = params;
  const history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  const [networkName, setNetworkName] = useState<EthereumNetwork>(searchParams.get('network') as EthereumNetwork ?? EthereumNetwork.ethereum)
  const { tokenInfo, loading: loadingToken } = useTokenInfo(address);
  useEffect(
    ()=> {

    if(searchParams.get('network') !== networkName){
      setNetworkName(searchParams.get('network') as EthereumNetwork ?? EthereumNetwork.ethereum)
    }

  }, [history.location.search])

  const isMobile = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));

  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'overview');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({ search: searchParams.toString() });

    setValue(newValue);
  };

  const baseAddress =
    address ||
    (networkName === 'ethereum'
      ? (process.env.REACT_APP_DEFAULT_ETH_TOKEN as string)
      : (process.env.REACT_APP_DEFAULT_BSC_TOKEN as string));


  const onClickSearch = (token: Token) => {
    if (!token) {
      return;
    }
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('network', token.networkName ?? EthereumNetwork.ethereum);
    setNetworkName(token.networkName ?? EthereumNetwork.ethereum);
    history.push({ pathname: `/protocol-explorer/token-explorer/${token.address || token.symbol}`, search: searchParams.toString() });
  }

  const { theme } = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;


  return (
    <>
      <Box pt={{ xl: 4 }}>
        <PageTitle
          breadcrumbs={{
            history: [
              {
                url: `/protocol-explorer/token-explorer/${baseAddress}`,
                name: 'Protocol Explorer',
              }
            ],
            active: { name: 'Token Explorer' },
          }}
          title={{ name: tokenInfo?.name || '' }}
          subtitle={{ name: truncateAddress(baseAddress), hasCopy: baseAddress }}
          icon={baseAddress}
          network={networkName}
          shareButton={true}
        />

        <GridContainer>
          <Grid item xs={12} md={12}>
            <Paper style={{ padding: 10 }}>
              <TokenSearch onClick={onClickSearch} selectedTokenAddress={baseAddress} />
            </Paper>
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
                  <Tab value="overview" icon={<RemoveRedEyeIcon />} label={!isMobile  ? "Overview" :''} />
                  {!isMobile && <Tab value="full-chart" icon={<TimelineIcon />} label="Full Chart" />}
                  <Tab value="top-pairs" icon={<EmojiEventsIcon />} label={!isMobile ? "Top Pairs" : '' } />
                  <Tab value="trade-history" icon={<SwapHorizontalCircleIcon />} label={!isMobile ? "Trade History" : ''} />
                  <Tab value="info" icon={<InfoIcon />} label={!isMobile ? "Info" : ''} />
                </Tabs>
              </AppBar>
              <Grid item xs={12} md={12}>
                <TabPanel value="overview">
                  <GridContainer>
                    <Grid item xs={12} md={5}>
                    <GridContainer>
                      <Grid item xs={12} md={12}>
                          {tokenInfo && <InfoMarketTab tokenInfo={tokenInfo} networkName={networkName} />}
                      </Grid>
           
                      <Grid item xs={12} md={12}>
                         <FavoritesAccordion type={'token'}/>
                      </Grid>
                      </GridContainer>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Fade in={true} timeout={1000}>
                        <Grid item xs={12} md={12}>
                          {loadingToken ? (
                            <Skeleton variant='rect' height={370} />
                          ) : (
                            tokenInfo && (
                              <Grid item xs={12} md={12} style={{ height: 450 }}>
                                <BitqueryTVChartContainer   symbol={`${networkName}:${tokenInfo.symbol.toUpperCase()}:${tokenInfo.address}`}  darkMode={isDark} />
                                 
                                
                              </Grid>
                            )
                          )}
                        </Grid>
                      </Fade>
                    </Grid>
                  </GridContainer>
                  <Hidden mdDown={true}>
                    <TokenOrders
                      networkName={networkName}
                      baseAddress={baseAddress}
                      quoteAddress={null}
                      exchange={EXCHANGE.ALL}
                      type={'token'}
                    />
                   </Hidden>


                </TabPanel>
                <TabPanel value="full-chart">
                  <Grid item xs={12} md={12}>
                        <Fade in={true} timeout={1000}>
                          <Grid item xs={12} md={12}>
                            {loadingToken ? (
                              <Skeleton variant='rect' height={370} />
                            ) : (
                              tokenInfo && (
                                <Grid item xs={12} md={12} style={{ height: 450 }}>
                                  <BitqueryTVChartContainer   symbol={`${networkName}:${tokenInfo.symbol.toUpperCase()}:${tokenInfo.address}`}  darkMode={isDark} />
                                  
                                  
                                </Grid>
                              )
                            )}
                          </Grid>
                        </Fade>
                      </Grid>
                      <Hidden mdDown={true}>
                        <TokenOrders
                          networkName={networkName}
                          baseAddress={baseAddress}
                          quoteAddress={null}
                          exchange={EXCHANGE.ALL}
                          type={'token'}
                        />
                   </Hidden>
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
                    quoteAddress={null}
                    exchange={EXCHANGE.ALL}
                    type={'token'}
                  />

                </TabPanel>
                <TabPanel value="info">
                  <InfoTab address={baseAddress} networkName={networkName} />
                </TabPanel>
              </Grid>

            </TabContext>
          </TokenFilterProvider>
        </GridContainer>
      </Box>
    </>
  );
};

export default TokenExplorer;
