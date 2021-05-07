import React from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useNetwork} from 'hooks/useNetwork';
import {utils} from 'ethers';
import { NETWORK } from 'shared/constants/AppEnums';

const useStyles = makeStyles(() => ({
  pair: {
    display: 'flex',
  },
  icon: {
    borderRadius: '100%',
  },
}));


interface Props {
  token0: string,
  token1?: string | undefined
}

const TokenLogo: React.FC<Props> = (props) => {

  const network = useNetwork();
  const classes = useStyles();

  const token0 = props.token0 ? utils.getAddress(props.token0) : '';
  const token1 = props.token1 ? utils.getAddress(props.token1) : '';

  const networkName = (network == NETWORK.ETHEREUM) ? 'ethereum' : 'smartchain';

  return (
    props.token1 ? (
      <Box className={classes.pair}>
        <img className={classes.icon} loading="lazy" src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${token0}/logo.png`} />
        <img className={classes.icon} loading="lazy" src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${token1}/logo.png`} />
      </Box>
    ) : (
      <img className={classes.icon} loading="lazy" src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${token0}/logo.png`} />
    )
  );
};

export default TokenLogo;
