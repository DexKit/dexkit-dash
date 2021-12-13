import {Box, Chip, Menu, MenuItem, Typography} from '@material-ui/core';
import React from 'react';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExchangeLogo from 'shared/components/ExchangeLogo';

interface Props {
  networkName: EthereumNetwork.bsc | EthereumNetwork.ethereum;
  protocol: EXCHANGE;
  onClick: (protocol: EXCHANGE) => any;
  style?: any;
}

const supportedProtocols = {
  [EthereumNetwork.ethereum]: [EXCHANGE.UNISWAP, EXCHANGE.SUSHISWAP],
  [EthereumNetwork.bsc]: [EXCHANGE.PANCAKEV2, EXCHANGE.SUSHISWAP],
};

const ProtocolSwitcher = (props: Props) => {
  const {networkName, onClick, style, protocol} = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProtocolClick = (protocol: EXCHANGE) => {
    handleClose();
    onClick(protocol);
  };

  return (
    <div style={style}>
      <Box display={'flex'} alignItems={'center'}>
        <Typography style={{paddingRight: '2px'}}>Protocol:</Typography>{' '}
        <Chip
          size={'medium'}
          color={'default'}
          clickable
          label={
            <Box display={'flex'} alignItems={'center'}>
              <Typography component={'h1'} style={{paddingRight: '2px'}}>
                {GET_EXCHANGE_NAME(protocol)}
              </Typography>{' '}
              <ExchangeLogo exchange={protocol} />
              <ExpandMoreIcon />{' '}
            </Box>
          }
          onClick={handleClick}
        />
      </Box>
      <Menu
        id='network-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {supportedProtocols[networkName]
          .filter((p) => p !== protocol)
          .map((p, index) => (
            <MenuItem onClick={() => handleProtocolClick(p)} key={index}>
              <Chip
                size={'medium'}
                color={'default'}
                label={
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography component={'h1'} style={{paddingRight: '2px'}}>
                      {GET_EXCHANGE_NAME(p)}
                    </Typography>{' '}
                    <ExchangeLogo exchange={p} />
                  </Box>
                }
              />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default ProtocolSwitcher;
