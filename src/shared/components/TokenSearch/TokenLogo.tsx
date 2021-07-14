import React from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useNetwork} from 'hooks/useNetwork';
import {utils} from 'ethers';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_DEFAULT_TOKEN_NETTOWRK} from 'shared/constants/Blockchain';
import {useChainId} from 'hooks/useChainId';
import { CremaTheme } from 'types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  pair: {
    display: 'flex',
  },
  iconLeft: {
    borderRadius: '100%',
    width: '40px',
    height: '40px',
    position: 'relative',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
      width: '25px',
      height: '25px',
    },
  },
}));

interface Props {
  token: string;
  network: EthereumNetwork;
  logoURL?: string;
 
}

const TokenLogo: React.FC<Props> = (props) => {
  const {network, token, logoURL} = props;

  const classes = useStyles();

  const networkName =
    network === EthereumNetwork.ethereum ? 'ethereum' : 'smartchain';

  const noFoundSrc = require('assets/images/logo-not-found.png');
  const dexkitLogo = require('assets/images/dexkit-logo.png');

  const currencyLogo =
    networkName === 'ethereum'
      ? 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
      : 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';

  const getIconUrl = (address: string, url?: string) => {
    if (
      address.toLowerCase() ===
        (process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN as string).toLowerCase() ||
      address.toLowerCase() ===
        (process.env.REACT_APP_DEFAULT_BSC_KIT_TOKEN as string).toLowerCase()
    ) {
      return dexkitLogo;
    }

    if(url){
      return url;
    }
    
    if(address.toLowerCase() === 'bsc') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';
    }

    if(address.toLowerCase() === 'eth') {
      return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
    }


    if(address.toLowerCase() === '') {
      return currencyLogo;
    }
    
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${utils.getAddress(address)}/logo.png`;
  };

  const addDefaultSrc = (ev: any) => {
    ev.target.src = noFoundSrc;
  };

  return (
    <img
      className={classes.iconLeft}
      onError={addDefaultSrc}
      loading='lazy'
      src={getIconUrl(token, logoURL)}
    />
  );
};

export default TokenLogo;
