import {green} from '@material-ui/core/colors';
import React, {useCallback, useState, useEffect} from 'react';
import {UIAccount} from 'redux/_ui/reducers';
import {truncateAddress} from 'utils';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  ListItemSecondaryAction,
  Tooltip,
  useMediaQuery,
  Theme,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  Chip,
  Box,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface AccountListItemProps {
  account: UIAccount;
  editing: boolean;
  isConnected: boolean;
  isDefault: boolean;
  onLabelChange: (account: UIAccount, newLabel: string) => void;
  onOpenMenu: (target: HTMLButtonElement, account: UIAccount) => void;
}

export const AccountListItem = (props: AccountListItemProps) => {
  const {
    account,
    editing,
    isConnected,
    isDefault,
    onLabelChange,
    onOpenMenu,
  } = props;

  const [label, setLabel] = useState('');

  const theme = useTheme();

  const isDesktop = useMediaQuery<Theme>((theme) =>
    theme?.breakpoints.up('sm'),
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value);
    },
    [],
  );

  const handleDone = useCallback(
    (e: React.MouseEvent) => {
      onLabelChange(account, label);
      setLabel(account.label);
    },
    [account, label],
  );

  const handleOpenMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenMenu(e.currentTarget, account);
    },
    [account, onOpenMenu],
  );

  useEffect(() => {
    setLabel(account.label);
  }, [account]);

  return (
    <ListItem>
      {editing ? (
        <TextField
          fullWidth
          label='Account label'
          defaultValue={account.label || account.address}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Tooltip title={'Save'}>
                  <IconButton onClick={handleDone} color='primary' size='small'>
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          onChange={handleLabelChange}
        />
      ) : (
        <>
          <ListItemIcon>
            <Tooltip title={isConnected ? 'Connected' : ''}>
              <FiberManualRecordIcon
                style={{
                  color: isConnected ? green[500] : theme.palette.grey[500],
                }}
              />
            </Tooltip>
          </ListItemIcon>
          <ListItemText
            primary={
              <Box display='flex' alignItems='center' alignContent='center'>
                <span style={{paddingRight: theme.spacing(2)}}>
                  {!isDesktop && account.label == account.address
                    ? truncateAddress(account.label)
                    : account.label}
                </span>
                {isDefault ? (
                  <Chip
                    style={{fontSize: theme.spacing(2)}}
                    variant='outlined'
                    size='small'
                    label='Default'
                  />
                ) : (
                  ''
                )}
              </Box>
            }
            secondary={
              account.address != account.label ? (
                <Typography variant='caption' color='textSecondary'>
                  {isDesktop
                    ? account.address
                    : truncateAddress(account.address)}
                </Typography>
              ) : null
            }
          />
          <ListItemSecondaryAction>
            <IconButton onClick={handleOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </>
      )}
    </ListItem>
  );
};

export default AccountListItem;
