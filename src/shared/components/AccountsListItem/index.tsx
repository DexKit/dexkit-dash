import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {UIAccount} from 'redux/_ui/reducers';
import {truncateAddress} from 'utils';
import {
  Grid,
  Paper,
  TextField,
  useMediaQuery,
  Theme,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  Tooltip,
  Box,
  makeStyles,
  Checkbox,
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {useWeb3} from 'hooks/useWeb3';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
      fill: theme.palette.text.primary,
    },
  },
  paper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  paperDefault: {
    borderWidth: 1,
    borderColor: '#525C75',
    borderStyle: 'solid',
  },
}));

interface AccountsListItemProps {
  account: UIAccount;
  isConnected: boolean;
  isDefault: boolean;
  selectActive: boolean;
  selected: boolean;
  onSelect: (account: UIAccount) => void;
  onLabelChange: (account: UIAccount, newLabel: string) => void;
  onOpenMenu: (target: HTMLButtonElement, account: UIAccount) => void;
  onMakeDefault: (account: UIAccount) => void;
}

export const AccountsListItem = (props: AccountsListItemProps) => {
  const {
    account,
    isConnected,
    isDefault,
    selectActive,
    onSelect,
    onLabelChange,
    onMakeDefault,
    selected,
  } = props;

  const [label, setLabel] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const {onCloseWeb3} = useWeb3();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  const classes = useStyles();

  const isDesktop = useMediaQuery<Theme>((theme) =>
    theme?.breakpoints.up('sm'),
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value);
    },
    [],
  );

  /* eslint-disable */
  const handleDone = useCallback(
    (e: React.MouseEvent) => {
      onLabelChange(account, label);
      setLabel(account.label);
      setIsEditing(false);
    },
    [account, label],
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setAnchorEl(null);
  }, []);

  const handleSelect = useCallback(() => {
    onSelect(account);
  }, [onSelect, account]);

  const handleMakeDefault = useCallback(() => {
    onMakeDefault(account);
    setAnchorEl(null);
  }, [onMakeDefault, account]);

  const handleDisconnectWallet = useCallback(() => {
    onCloseWeb3();
    setAnchorEl(null);
  }, [onCloseWeb3]);

  useEffect(() => {
    setLabel(account.label);
  }, [account]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isWithoutLabel = useMemo(() => {
    return account.label.toLowerCase() === account.address.toLowerCase();
  }, [account.label, account.address]);

  return (
    <Paper className={classes.paper}>
      {isEditing ? (
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
        <Grid container alignItems='center' spacing={4}>
          <Grid item>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              {selectActive ? (
                <Checkbox
                  checked={selected}
                  color='primary'
                  onClick={handleSelect}
                />
              ) : (
                <Tooltip title={isConnected ? 'Connected' : ''}>
                  <FiberManualRecordIcon
                    style={
                      isConnected
                        ? {color: theme.palette.success.main}
                        : undefined
                    }
                  />
                </Tooltip>
              )}
            </Box>
          </Grid>
          <Grid item xs>
            <Box display='flex' alignItems='center' alignContent='center'>
              <span style={{paddingRight: theme.spacing(2)}}>
                {!isDesktop && account.label === account.address
                  ? truncateAddress(account.label)
                  : account.label}
              </span>
            </Box>
            {account.address != account.label ? (
              <Typography variant='caption' color='textSecondary'>
                {isDesktop ? account.address : truncateAddress(account.address)}
              </Typography>
            ) : null}
          </Grid>
          <Grid item>
            <IconButton
              aria-label='more'
              aria-controls='long-menu'
              aria-haspopup='true'
              onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>

            <Menu
              id='account-accounts'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              {!isDefault && !selectActive && (
                <MenuItem onClick={handleMakeDefault}>
                  {' '}
                  <IntlMessages
                    id={'accounts.makeDefault'}
                    defaultMessage={'Default account'}
                  />
                </MenuItem>
              )}

              {isConnected && (
                <MenuItem onClick={handleDisconnectWallet}>
                  <IntlMessages
                    id={'accounts.disconnect'}
                    defaultMessage={'Disconnect'}
                  />
                </MenuItem>
              )}
              <MenuItem onClick={handleEdit}>
                {isWithoutLabel ? (
                  <IntlMessages
                    id={'accounts.addLabel'}
                    defaultMessage={'Add label'}
                  />
                ) : (
                  <IntlMessages
                    id={'accounts.editLabel'}
                    defaultMessage={'Edit label'}
                  />
                )}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default AccountsListItem;
