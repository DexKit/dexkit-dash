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
  Fade,
  Grid,
  Hidden,
  Paper,
  Tab,
  Tabs,
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
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      EthereumNetwork.ethereum,
  );
  const {tokenInfo, loading: loadingToken} = useTokenInfo(address);

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

  return <></>;
};

export default Explorer;
