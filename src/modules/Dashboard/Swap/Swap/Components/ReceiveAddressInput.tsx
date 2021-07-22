import React, {useState, useCallback} from 'react';

import {TextField, InputAdornment, useTheme} from '@material-ui/core';

import {Changelly} from 'services/rest/changelly';
import {ChangellyCoin} from 'types/changelly';
import PasteIconButton from 'shared/components/PasteIconButton';

interface Props {
  coin?: ChangellyCoin;
  onChange: (value: string) => void;
  onPaste: (value: string) => void;
  address: string;
}

export const ReceiveAddressInput = (props: Props) => {
  const {address, coin, onChange, onPaste} = props;
  const theme = useTheme();

  const [isAddressValid, setIsAddressValid] = useState(false);

  const onChangeAddress = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!coin) {
      return;
    }

    onChange(ev.target.value);

    const address = ev.target.value;

    Changelly.validateAddress({currency: coin?.ticker, address}).then((r) => {
      if (r.result.result) {
        setIsAddressValid(true);
      } else {
        setIsAddressValid(false);
      }
    });
  };

  const helperText = useCallback(() => {
    if (address === '') {
      return `Insert a valid ${coin?.name.toUpperCase()} address`;
    }

    if (!isAddressValid) {
      return `${coin?.name.toUpperCase()} address is not valid`;
    }

    return null;
  }, [address, isAddressValid, coin]);

  return (
    <TextField
      id='Address'
      required
      error={!isAddressValid || address === ''}
      variant='filled'
      value={address}
      onChange={onChangeAddress}
      fullWidth
      helperText={helperText()}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end' variant='standard'>
            <PasteIconButton onPaste={onPaste} />
          </InputAdornment>
        ),
      }}
    />
  );
};
