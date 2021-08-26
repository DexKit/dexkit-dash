import {Box, Button, Chip, Menu, MenuItem} from '@material-ui/core';
import React from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Token} from 'types/app';
import TokenLogo from '../TokenLogo';

type TokenList = Token[] & 'all';

interface Props {
  selectedToken: Token;
  tokens: TokenList;
  onClick: (token: Token) => any;
  style?: any;
}

const TokenFilter = (props: Props) => {
  const {selectedToken, tokens, onClick, style} = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTokenClick = (tk: Token) => {
    handleClose();
    onClick(tk);
  };

  return (
    <div style={style}>
      <Chip
        color={'default'}
        clickable
        label={
          <Box display={'flex'} alignItems={'center'}>
            {<TokenLogo token0={selectedToken.address} />}{' '}
            {selectedToken.symbol.toUpperCase()} <ExpandMoreIcon />{' '}
          </Box>
        }
        onClick={handleClick}
      />
      <Menu
        id='token-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {tokens
          .filter(
            (t) =>
              t.address.toLowerCase() !== selectedToken.address.toLowerCase(),
          )
          .map((t) => (
            <MenuItem onClick={() => handleTokenClick(t)}>
              <Chip
                color={'default'}
                label={
                  <Box display={'flex'} alignItems={'center'}>
                    {<TokenLogo token0={t.address ?? t.symbol} />}{' '}
                    {t.symbol.toUpperCase()}
                  </Box>
                }
              />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default TokenFilter;
