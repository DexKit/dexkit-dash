import React, {PropsWithChildren, useContext, useMemo, useState} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';

import {AppBar, Box,  Grid, Hidden, Paper, Tab, Tabs, Typography} from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';

import {getNativeCoinWrappedAddressFromNetworkName, GET_EXCHANGE_FROM_URL, GET_URL_NAME_EXCHANGE, truncateAddress} from 'utils';
import {EXCHANGE, EthereumNetwork, ThemeMode, Fonts} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import InfoAMM from '../Common/InfoAMM';
import AMMPoolHistory from '../Common/AMMPoolHistory';

import {TokenFilterProvider} from 'providers/protocol/tokenFilterProvider';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';

import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import PoolIcon from '@material-ui/icons/Pool';

import { TokenSearch } from 'shared/components/TokenSearch';
import { Token } from 'types/app';


import { AppContext } from '@crema';

import AppContextPropsType from 'types/AppContextPropsType';
import { useAMMPairExplorer } from 'hooks/protocolExplorer/useAMMPairExplorer';
import ErrorView from 'modules/Common/ErrorView';
import ProtocolSwitcher from 'shared/components/ProtocolSwitcher';
import { getPairContractFromExchange } from 'services/graphql/bitquery/protocol';
import TokenLogo from 'shared/components/TokenLogo';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';

type Params = {
  address: string;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;

  const {address} = params;
  const history = useHistory();
  let searchParams = useMemo(() => { return new URLSearchParams(history.location.search) }, []);
  const [networkName, setNetworkName] = useState<EthereumNetwork>(searchParams.get('network') as EthereumNetwork  ?? EthereumNetwork.ethereum)


  const defaultExchange = networkName === EthereumNetwork.ethereum ? EXCHANGE.UNISWAP : EXCHANGE.PANCAKEV2;

  const [exchange, setExchange] = useState(searchParams.get('protocol') ? GET_EXCHANGE_FROM_URL(searchParams.get('protocol') as any)  : defaultExchange);

  const {loading, error, data} = useAMMPairExplorer({exchange, address, networkName});

  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'overview');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({ search: searchParams.toString() });

    setValue(newValue);
  };

  const baseAddress = data && data?.baseCurrency?.address


  const onClickSearch = (token: Token) => {
    if(!token){
      return;
    }
    const net = token.networkName ?? EthereumNetwork.ethereum;
    const defaultExchange = net === EthereumNetwork.ethereum ? EXCHANGE.UNISWAP : EXCHANGE.PANCAKEV2;
    getPairContractFromExchange(token.address || token.symbol, getNativeCoinWrappedAddressFromNetworkName(net), net, defaultExchange)
      .then(pairContract => {
        if(pairContract){
          let searchParams = new URLSearchParams(history.location.search);
          
          searchParams.set('network', net );
          searchParams.set('protocol', GET_URL_NAME_EXCHANGE(defaultExchange) );
          setExchange(defaultExchange)
          setNetworkName(net);


          history.push({pathname: `/protocol-explorer/pool-explorer/${pairContract}`, search: searchParams.toString() });
        }
      })

    
  }

  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;
  const onClick = (p: EXCHANGE) => {
    getPairContractFromExchange(baseAddress, getNativeCoinWrappedAddressFromNetworkName(networkName), networkName, p)
    .then(pairContract => {
      if(pairContract){
        let searchParams = new URLSearchParams(history.location.search);
        searchParams.set('protocol', GET_URL_NAME_EXCHANGE(p));
        history.push({pathname: `/protocol-explorer/pool-explorer/${pairContract}`, search: searchParams.toString() });
      }
    })


    history.push({ search: searchParams.toString() });
    setExchange(p);
  }
  const title = 
    data ?  <Box display='flex' alignItems='center'>
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
    <>
      <Box pt={{xl: 4}}>
         <GridContainer> 
           <Grid item xs={12} md={6} >
              <PageTitle
                breadcrumbs={{
                  history: [
                          {
                            url: `/protocol-explorer/pool-explorer/${address}`,
                            name: 'Protocol Explorer',
                          }
                        ],
                  active: {name: 'Pool Explorer'},
                }}
                title={{name: 'Pool Explorer', component: title}}
                subtitle={{name: truncateAddress(address), hasCopy: address}}
                network={networkName}
                shareButton={true}
              />
         </Grid>
         <Grid item xs={12} md={6} alignItems={'flex-end'} >
          <ProtocolSwitcher networkName={networkName as EthereumNetwork.bsc | EthereumNetwork.ethereum} protocol={exchange} onClick={onClick} />
          </Grid> 
        </GridContainer>
        <GridContainer>
             <Grid item xs={12} md={12}>
              <Paper style={{padding: 10}}>
                <TokenSearch onClick={onClickSearch} selectedTokenAddress={baseAddress}/>
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
                      <Tab value="overview" icon={<RemoveRedEyeIcon />} label="Overview" />   
                      <Tab value="pool-history" icon={<PoolIcon />} label="Pool History" />
                    </Tabs>
                  </AppBar>
                  <Grid item xs={12} md={12}>
                  <TabPanel value="overview">
                  <GridContainer>
                  <Grid item xs={12} md={12}>
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
                    <Hidden mdDown={true}>
                    <Grid item xs={12} md={12} style={{marginTop: '2px'}}>
                      {data ? (
                          <AMMPoolHistory
                              networkName={networkName}
                              address={address}
                              exchange={exchange}
                              baseCurrency={data.baseCurrency}
                              quoteCurrency={data.quoteCurrency}
                          />
                          ) : 
                          (<Typography component='h1' color={'primary'}>No data available for this pair on {GET_EXCHANGE_NAME(exchange)}</Typography>)
                        
                        
                        }
                        </Grid>
                     </Hidden>
                     </GridContainer>


                  </TabPanel>

                
                  <TabPanel value="pool-history">
                  {data ? (
                        <AMMPoolHistory
                            networkName={networkName}
                            address={address}
                            exchange={exchange}
                            baseCurrency={data.baseCurrency}
                            quoteCurrency={data.quoteCurrency}
                        />
                        ) : 
                        (<Typography component='h1' color={'primary'}>No data available for this pair on {GET_EXCHANGE_NAME(exchange)}</Typography>)
                      
                      
                      }
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
