import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';

import {
  AppBar,
  Box,
  Breadcrumbs,
  Fade,
  Grid,
  Hidden,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import GridContainer from '../../../@crema/core/GridContainer';

import {truncateAddress} from 'utils';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';

import {Token} from 'types/app';

import {useTokenInfo} from 'hooks/useTokenInfo';
import {AppContext} from '@crema';
import {Skeleton} from '@material-ui/lab';

import AppContextPropsType from 'types/AppContextPropsType';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoinTools from 'shared/components/CoinTools';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {Analytics} from '../components/analytics';
import {useTokenMarket} from 'hooks/protocolExplorer/useTokenMarket';
import HistoryTables from '../components/history';
import { Pairs } from '../components/pairs';
type Params = {
  address: string;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const Explorer: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;

  const {address} = params;
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const balances = useAllBalance();
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      EthereumNetwork.ethereum,
  );
  const {tokenInfo, loading: loadingToken} = useTokenInfo(address);
  const {loading, data} = useTokenMarket(networkName, EXCHANGE.ALL, tokenInfo);

  useEffect(() => {
    if (searchParams.get('network') !== networkName) {
      setNetworkName(
        (searchParams.get('network') as EthereumNetwork) ??
          EthereumNetwork.ethereum,
      );
    }
  }, [history.location.search]);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const [value, setValue] = React.useState(
    searchParams.get('tab') ?? 'overview',
  );
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({search: searchParams.toString()});

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
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('network', token.networkName ?? EthereumNetwork.ethereum);
    setNetworkName(token.networkName ?? EthereumNetwork.ethereum);
    history.push({
      pathname: `/protocol-explorer/token-explorer/${
        token.address || token.symbol
      }`,
      search: searchParams.toString(),
    });
  };

  const {theme} = useContext<AppContextPropsType>(AppContext);
  const isDark = theme.palette.type === ThemeMode.DARK;

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

      <Grid container justify='space-between' alignItems='center'>
        <Grid item xs={6}>
          <Typography variant='h6'>Coin Price and Tools</Typography>
        </Grid>
        <Grid item xs={6}>
          {balances.data && <CoinTools balances={balances.data} />}
        </Grid>
      </Grid>

      <Analytics />
      <Pairs baseAddress={address} networkName={networkName} exchange={EXCHANGE.ALL}/>

      <Box mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HistoryTables address={address} networkName={networkName} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Explorer;
