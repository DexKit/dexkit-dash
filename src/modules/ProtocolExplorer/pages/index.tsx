import React, {PropsWithChildren, useContext, useEffect, useState, useCallback} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';

import BitqueryTVChartContainer from 'shared/components/chart/BitqueryTVChart/tv_chart';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';



import {useTokenInfo} from 'hooks/useTokenInfo';
import {AppContext} from '@crema';
import {Skeleton} from '@material-ui/lab';

import AppContextPropsType from 'types/AppContextPropsType';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoinTools from 'shared/components/CoinTools';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {Analytics} from '../components/analytics';
import {useTokenMarket} from 'hooks/protocolExplorer/useTokenMarket';
import {ReactComponent as GraphicsIcon} from '../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../assets/images/icons/arrow-down.svg';
import {Pairs} from '../components/pairs';

import {useStyles} from './index.style';
import {TokenFilterProvider} from 'providers/protocol/tokenFilterProvider';
import TokenCard from 'shared/components/TokenCard';
import TokenLogo from 'shared/components/TokenLogo';
import { useFavoritesWithMarket } from 'hooks/useFavoritesWithMarket';

type Params = {
  address: string;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const Explorer: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;

  const classes = useStyles();

  const {isFavorite, onToggleFavorite} = useFavoritesWithMarket();

  const {address} = params;
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const balances = useAllBalance();
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      EthereumNetwork.ethereum,
  );
  const {tokenInfo, loading: loadingToken} = useTokenInfo(address);
  const {loading: loadingTokenMarket, data: tokenMarket} = useTokenMarket(
    networkName,
    EXCHANGE.ALL,
    tokenInfo,
  );

  useEffect(() => {
    if (searchParams.get('network') !== networkName) {
      setNetworkName(
        (searchParams.get('network') as EthereumNetwork) ??
          EthereumNetwork.ethereum,
      );
    }
  }, [history.location.search]);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const onMakeFavorite = useCallback(()=>{
    if(tokenInfo){
      onToggleFavorite(tokenInfo, tokenInfo.coingecko_id)
    }
   
  },[tokenInfo])


  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

  const Chart = (
    <Paper className={classes.paperChart}>
      {loadingToken || !tokenInfo ? (
        <Grid item xs={12} md={12} style={{height: 450}}>
          <Skeleton variant='rect' height={450} />
        </Grid>
      ) : (
        tokenInfo && (
          <Grid item xs={12} md={12} style={{height: 450}}>
            <BitqueryTVChartContainer
              symbol={`${networkName}:${tokenInfo.symbol.toUpperCase()}:${
                tokenInfo.address
              }`}
              darkMode={isDark}
            />
          </Grid>
        )
      )}
    </Paper>
  );

  return (
    <Box>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs aria-label='breadcrumb'>
                <Typography variant='body2' color='textSecondary'>
                  Home
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Explorer
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Explorer</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justify='space-between' spacing={2}>
        <Grid item xs={12} md={6}>
          {loadingToken || !tokenInfo || !tokenMarket ? (
            <Skeleton variant={'rect'} height={100} />
          ) : (
            <TokenCard
              icon={
                <TokenLogo
                  token0={tokenInfo?.address || ''}
                  networkName={networkName}
                />
              }
              pair={tokenInfo?.symbol as string}
              amount={tokenMarket?.priceUsd as number}
              price24Change={tokenInfo?.price_usd_24h_change?.toNumber()}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {balances.data && <CoinTools balances={balances.data} isFavorite={isFavorite(tokenInfo)} onMakeFavorite={onMakeFavorite}  />}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Analytics
              token={tokenInfo}
              tokenMarket={tokenMarket}
              loading={loadingToken || loadingTokenMarket}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {isMobile ? (
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDownIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'>
                <Typography>
                  <GraphicsIcon /> Chart
                </Typography>
              </AccordionSummary>
              <AccordionDetails> {Chart}</AccordionDetails>
            </Accordion>
          ) : (
            Chart
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <TokenFilterProvider>
            <Pairs
              baseAddress={address}
              networkName={networkName}
              exchange={EXCHANGE.ALL}
            />
          </TokenFilterProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Explorer;
