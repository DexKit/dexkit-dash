import React, {useEffect, useState, useCallback} from 'react';

import {
  TextField,
  InputAdornment,
  useTheme,
  Menu,
  IconButton,
  Tooltip,
} from '@material-ui/core';

import {Changelly} from 'services/rest/changelly';
import {ChangellyCoin} from 'types/changelly';
import PasteIconButton from 'shared/components/PasteIconButton';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';
import {useSelector} from 'react-redux';
import {UIAccount} from 'redux/_ui/reducers';
import {truncateAddress} from 'utils';
import {AppState} from 'redux/store';
import ReceiveAddressMenuItem from './ReceiveAddressMenuItem';
import { SupportedNetworkType } from 'types/blockchain';

interface Props {
  coin?: ChangellyCoin;
  onChange: (value: string) => void;
  onPaste: (value: string) => void;
  address: string;
}

export const ReceiveAddressInput = (props: Props) => {
  const {address, coin, onChange, onPaste} = props;
  const theme = useTheme();

  const {wallet} = useSelector<AppState, AppState['ui']>((state) => state.ui);

  const [isAddressValid, setIsAddressValid] = useState(false);

  const onChangeAddress = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!coin) {
      return;
    }

    onChange(ev.target.value);

    const address = ev.target.value;
  };

  const helperText = useCallback(() => {
    if (address === '') {
      return `Insert a valid ${coin?.fullName} address`;
    }

    if (!isAddressValid) {
      return `${coin?.fullName} address is not valid`;
    }

    return null;
  }, [address, isAddressValid, coin]);

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleCloseMenu = useCallback(
    (event) => {
      setAnchorEl(null);
    },
    [setAnchorEl],
  );

  const handleOpenMenu = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handlePaste = useCallback(
    (value: string) => {
      onPaste(value);
      setAnchorEl(null);
    },
    [setAnchorEl, onPaste],
  );

  const renderMenu = useCallback(
    () => (
      <Menu
        id='addresses-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}>
        {wallet[SupportedNetworkType.evm].map((account: UIAccount, index: number) => (
          <ReceiveAddressMenuItem
            key={index}
            label={account.label}
            onPaste={handlePaste}
            address={account.address}
          />
        ))}
      </Menu>
    ),
    [anchorEl, handleCloseMenu, wallet[SupportedNetworkType.evm], onPaste],
  );

  useEffect(() => {
    if (!coin) {
      return;
    }

    Changelly.validateAddress({currency: coin?.ticker, address}).then((r) => {
      if (r.result.result) {
        setIsAddressValid(true);
      } else {
        setIsAddressValid(false);
      }
    });
  }, [coin, address]);

  return (
    <>
      <TextField
        id='Address'
        required
        error={!isAddressValid || address === ''}
        variant='outlined'
        value={address}
        onChange={onChangeAddress}
        fullWidth
        helperText={helperText()}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end' variant='outlined'>
              {coin?.ticker?.toLowerCase() == 'eth' ? (
                <>
                  <Tooltip title='Accounts'>
                    <IconButton size='small' onClick={handleOpenMenu}>
                      <AccountBalanceWalletIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Paste'>
                    <PasteIconButton onPaste={onPaste} />
                  </Tooltip>
                </>
              ) : (
                <PasteIconButton onPaste={onPaste} />
              )}
            </InputAdornment>
          ),
        }}
      />
      {renderMenu()}
    </>
  );
};
