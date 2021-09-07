import React from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useNetwork} from 'hooks/useNetwork';
import {utils} from 'ethers';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_DEFAULT_TOKEN_BY_NETWORK} from 'shared/constants/Blockchain';
import {CremaTheme} from 'types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  pair: {
    display: 'flex',
  },
  iconLeft: {
    borderRadius: '100%',
    width: '30px',
    height: '30px',
    position: 'relative',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
      width: '25px',
      height: '25px',
    },
  },
  iconRight: {
    borderRadius: '100%',
    width: '30px',
    height: '30px',
    position: 'relative',
    zIndex: 1,
    left: '-15px',
    [theme.breakpoints.down('md')]: {
      width: '25px',
      height: '25px',
      left: '-12px',
    },
  },
}));

interface Props {
  token0: string;
  networkName: EthereumNetwork;
  logoURL0?: string;
  token1?: string | undefined;
}

const noFoundSrc = require('assets/images/logo-not-found.png');
const dexkitLogo = require('assets/images/dexkit-logo.png');

const TokenLogo: React.FC<Props> = (props) => {
  const net = useNetwork();
  const classes = useStyles();
  const currentNetwork = props.networkName || net;

  const provToken0 =
    props.token0 === '-'
      ? GET_DEFAULT_TOKEN_BY_NETWORK(currentNetwork)
      : props.token0;
  const provToken1 =
    props.token1 === '-'
      ? GET_DEFAULT_TOKEN_BY_NETWORK(currentNetwork)
      : props.token1;

  const token0 =
    provToken0 && utils.isAddress(provToken0 || '')
      ? utils.getAddress(provToken0)
      : '';
  const token1 =
    provToken1 && utils.isAddress(provToken1 || '')
      ? utils.getAddress(provToken1)
      : '';

  const networkName =
    currentNetwork === EthereumNetwork.ethereum
      ? 'ethereum'
      : currentNetwork === EthereumNetwork.bsc
      ? 'smartchain'
      : 'polygon';

  const currencyLogo =
    networkName === 'ethereum'
      ? 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
      : currentNetwork === EthereumNetwork.bsc
      ? 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
      : 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png';
  const getIconUrl = (address: string, logoUrl?: string) => {
    if (logoUrl) {
      return logoUrl;
    }

    if (address.toLowerCase() === 'bsc' || address.toLowerCase() === 'bnb') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';
    }

    if (address.toLowerCase() === 'eth') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
    }

    if (address.toLowerCase() === 'matic') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png';
    }

    if (address.toLowerCase() === '') {
      return currencyLogo;
    }
    if (
      address.toLowerCase() ===
        (process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN as string).toLowerCase() ||
      address.toLowerCase() ===
        (process.env.REACT_APP_DEFAULT_BSC_KIT_TOKEN as string).toLowerCase()
    ) {
      return dexkitLogo;
    }
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${address}/logo.png`;
  };

  const addDefaultSrc = (ev: any) => {
    ev.target.src = noFoundSrc;
  };

  return props.token1 ? (
    <Box className={classes.pair}>
      <img
        className={classes.iconLeft}
        onError={addDefaultSrc}
        loading='lazy'
        src={getIconUrl(token0, props.logoURL0)}
      />
      <img
        className={classes.iconRight}
        onError={addDefaultSrc}
        loading='lazy'
        src={getIconUrl(token1)}
      />
    </Box>
  ) : (
    <img
      className={classes.iconLeft}
      onError={addDefaultSrc}
      loading='lazy'
      src={getIconUrl(token0, props.logoURL0)}
    />
  );
};

export default TokenLogo;
