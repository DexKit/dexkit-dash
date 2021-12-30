import {
  DialogProps,
  Dialog,
  DialogTitle,
  List,
  Box,
  Typography,
  IconButton,
  makeStyles,
  Divider,
} from '@material-ui/core';
import React from 'react';
import {WalletAddIcon} from '../Icons';
import {SelectAccountListItem} from './SelectAddressListItem';
import CloseIcon from '@material-ui/icons/Close';
import CustomDialogTitle from '../CustomDialogTitle';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    stroke: theme.palette.common.white,
    fill: theme.palette.common.white,
  },
}));

interface SelectAddressDialogProps extends DialogProps {
  onSelectAccount: (address: string, label?: string) => void;
  accounts: {address: string; label?: string}[];
  onClose: () => void;
}

export const SelectAddressDialog = (props: SelectAddressDialogProps) => {
  const {onSelectAccount, accounts, onClose} = props;

  const classes = useStyles();

  return (
    <Dialog {...props} maxWidth='xs' fullWidth>

  <CustomDialogTitle title={"Select an address"} icon={<WalletAddIcon className={classes.icon} />} onClose={onClose}/>
      
      <Divider />
      <List disablePadding>
        {accounts.map(
          (account: {address: string; label?: string}, index: number) => (
            <>
              <SelectAccountListItem
                key={index}
                account={account}
                onSelectAccount={onSelectAccount}
              />
              {index === accounts.length - 1 ? null : <Divider />}
            </>
          ),
        )}
      </List>
    </Dialog>
  );
};

export default SelectAddressDialog;
