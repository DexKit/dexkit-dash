import {List, ListItem, ListItemText} from '@material-ui/core';
import React, {useCallback} from 'react';

interface SelectAccountListItemProps {
  account: {address: string; label?: string};
  onSelectAccount: (address: string, label?: string) => void;
}

export const SelectAccountListItem = (props: SelectAccountListItemProps) => {
  const {onSelectAccount, account} = props;

  const handleSelectAddress = useCallback(() => {
    onSelectAccount(account.address, account.label);
  }, [onSelectAccount, account]);

  return (
    <ListItem button onClick={handleSelectAddress}>
      <ListItemText
        primary={
          account.label !== account.address ? account.label : account.address
        }
        secondary={
          account.label !== account.address ? account.address : undefined
        }
      />
    </ListItem>
  );
};

export default SelectAccountListItem;
