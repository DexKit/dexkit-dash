import {
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
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

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface SelectAddressDialogProps extends DialogProps {
  onSelectAccount: (address: string) => void;
  accounts: {address: string; label?: string}[];
  onClose: () => void;
}

export const SelectAddressDialog = (props: SelectAddressDialogProps) => {
  const {onSelectAccount, accounts, onClose} = props;

  const classes = useStyles();

  return (
    <Dialog {...props} maxWidth='xs' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <WalletAddIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>Select an address</Typography>
          </Box>
          <Box>
            <IconButton size='small' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
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
