import React from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useNetwork} from 'hooks/useNetwork';
import {utils} from 'ethers';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_DEFAULT_TOKEN_NETTOWRK} from 'shared/constants/Blockchain';
import {useChainId} from 'hooks/useChainId';

const useStyles = makeStyles(() => ({
  pair: {
    display: 'flex',
  },
  iconLeft: {
    borderRadius: '100%',
    width: '40px',
    height: '40px',
    position: 'relative',
    zIndex: 2,
  },
  iconRight: {
    borderRadius: '100%',
    width: '40px',
    height: '40px',
    position: 'relative',
    zIndex: 1,
    left: '-15px',
  },
}));

interface Props {
  token0: string;
  token1?: string | undefined;
}

const TokenLogo: React.FC<Props> = (props) => {
  const {currentChainId} = useChainId();
  const network = useNetwork();
  const classes = useStyles();

  const provToken0 =
    props.token0 === '-'
      ? GET_DEFAULT_TOKEN_NETTOWRK(currentChainId)
      : props.token0;
  const provToken1 =
    props.token1 === '-'
      ? GET_DEFAULT_TOKEN_NETTOWRK(currentChainId)
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
    network == EthereumNetwork.ethereum ? 'ethereum' : 'smartchain';

  const noFoundSrc = require('assets/images/logo-not-found.png');
  const dexkitLogo = require('assets/images/dexkit-logo.png');

  const currencyLogo =
    networkName === 'ethereum'
      ? 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
      : 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';

  const getIconUrl = (address: string) => {
    if(address.toLowerCase() === '') {
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
        src={getIconUrl(token0)}
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
      src={getIconUrl(token0)}
    />
  );
};

export default TokenLogo;
