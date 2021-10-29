import React, {useCallback} from 'react';

import {MenuItem} from '@material-ui/core';
import {truncateAddress} from 'utils';

interface Props {
  label: string;
  address: string;
  onPaste: (value: string) => void;
}

export const ReceiveAddressMenuItem = (props: Props) => {
  const {label, address, onPaste} = props;

  const handleClick = useCallback(() => {
    onPaste(address);
  }, [address, onPaste]);

  return (
    <MenuItem onClick={handleClick}>
      {label == address ? truncateAddress(address) : label}
    </MenuItem>
  );
};

export default ReceiveAddressMenuItem;
