import React, {useCallback, useState} from 'react';
import Box from '@material-ui/core/Box';
import {
  CardHeader,
  ListItemIcon,
  Typography,
  useMediaQuery,
  Theme,
  Menu,
  MenuItem,
  Snackbar,
  CardContent,
} from '@material-ui/core';
import PageTitle from 'shared/components/PageTitle';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core/styles';
import {CremaTheme} from 'types/AppContextPropsType';
import DoneIcon from '@material-ui/icons/Done';


import {
  List,
  Grid,
  Tooltip,
  Divider,
  Button,
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {
  addAccounts,
  removeAccount,
  setDefaultAccount,
  setAccountLabel,
} from 'redux/_ui/actions';

import {useWeb3} from 'hooks/useWeb3';

import HomeIcon from '@material-ui/icons/Home';
import {AboutDialog} from './aboutDialog';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {isMobile} from 'web3modal';
import {SupportedNetworkType, Web3State} from 'types/blockchain';
import {UIAccount} from 'redux/_ui/reducers';
import EditIcon from '@material-ui/icons/Edit';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {Fonts} from 'shared/constants/AppEnums';
import AccountListItem from './components/AccountListItem';
import {Alert} from '@material-ui/lab';
const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    width: '100%',
  },
  inputAddress: {
    display: 'flex',
  },
}));

const Accounts = () => {

  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const [copyText, setCopyText] = useState('Copy to clipboard');

  const [anchorEl, setAnchorEl] = useState<Element>();
  const [addNew, setAddNew] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState<UIAccount | null>(
    null,
  );

  const dispatch = useDispatch();
  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  const {web3State, onConnectWeb3, account} = useWeb3();

  const handlePaste = async () => {
    const cpy: any = await navigator.clipboard.readText();
    setAddress(cpy);
  };

  const onChangeAddress = (
    ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = ev.currentTarget.value;
    if (Web3Wrapper.isAddress(value)) {
      setError('');
      setAddress(value);
    } else {
      if (value) {
        setError('Address not valid');
      } else {
        setError('');
      }
    }
  };

  const handleAddAccount = useCallback(() => {
    if (address && Web3Wrapper.isAddress(address)) {
      dispatch(
        addAccounts({accounts: [
          {
            address: address,
            label: address,
            networkType: SupportedNetworkType.evm    
          },
        ], type: SupportedNetworkType.evm    
      }
      
      ),
      );

      setAddNew(false);
      setAddress(undefined);
    }
  }, [address, dispatch, addAccounts]);

  const connectButton = (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <Button
        variant='contained'
        color='primary'
        onClick={onConnectWeb3}
        endIcon={<AccountBalanceWalletIcon />}>
        {web3State === Web3State.Connecting
          ? isMobile()
            ? 'Connecting...'
            : 'Connecting... Check Wallet'
          : isMobile()
          ? 'Connect'
          : 'Connect Wallet'}
      </Button>
    </Box>
  );

  const notConnected = web3State !== Web3State.Done;

  const handleTooltipOpen = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy to clipboard');
    }, 1000);
  };

  const isDesktop = useMediaQuery<Theme>((theme) =>
    theme?.breakpoints.up('sm'),
  );

  const titleComponent = (
    <Box display='flex' alignItems='center' mt={1}>
      <AccountBoxIcon color={'primary'} fontSize={'large'} />
      <Box component='h3' color='text.primary' fontWeight={Fonts.BOLD} mr={2}>
        Manage Accounts
      </Box>
      <AboutDialog />
    </Box>
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  const handleOpenMenu = useCallback(
    (target: HTMLButtonElement, account: UIAccount) => {
      setSelectedAccount(account);
      if (target) {
        setAnchorEl(target);
      }
    },
    [],
  );

  const handleMakeDefault = useCallback(() => {
    if (selectedAccount) {
      dispatch(setDefaultAccount({account: selectedAccount, type: SupportedNetworkType.evm}));
    }

    setAnchorEl(undefined);
    setSelectedAccount(null);
  }, [dispatch, setDefaultAccount, selectedAccount]);

  const handleRemove = useCallback(() => {
    if (selectedAccount) {
      dispatch(removeAccount({account: selectedAccount, type: SupportedNetworkType.evm}));
    }

    setAnchorEl(undefined);
    setSelectedAccount(null);
  }, [dispatch, removeAccount, selectedAccount]);

  const handleCopyAddress = useCallback(() => {
    if (selectedAccount) {
      handleTooltipOpen();
      navigator.clipboard.writeText(selectedAccount.address);
      document.execCommand('copy');
      setShowSnackbar(true);
    }

    setAnchorEl(undefined);
    setSelectedAccount(null);
  }, [selectedAccount]);

  const handleEditLabel = useCallback(() => {
    setIsEditing(true);
  }, []);

  const renderMenu = useCallback(() => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== undefined}
        onClose={handleMenuClose}>
        <MenuItem onClick={handleMakeDefault}>
          <ListItemIcon>
            <HomeIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Make default</Typography>
        </MenuItem>
        <MenuItem onClick={handleEditLabel}>
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Edit label</Typography>
        </MenuItem>
        <MenuItem onClick={handleCopyAddress}>
          <ListItemIcon>
            <FileCopyIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Copy Address</Typography>
        </MenuItem>
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>Remove</Typography>
        </MenuItem>
      </Menu>
    );
  }, [
    anchorEl,
    handleMenuClose,
    handleEditLabel,
    handleCopyAddress,
    handleMakeDefault,
    handleRemove,
  ]);

  const handleCloseSnackbar = useCallback(() => {
    setShowSnackbar(false);
  }, []);

  const renderSnackbar = useCallback(() => {
    return (
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
        <Alert onClose={handleCloseSnackbar} severity='success'>
          Address copied!
        </Alert>
      </Snackbar>
    );
  }, [showSnackbar, handleCloseSnackbar]);

  const handleLabelChange = useCallback(
    (account: UIAccount, newLabel: string) => {
      dispatch(
        setAccountLabel({account: {
          address: account.address,
          label: newLabel,
          networkType: account.networkType
        }, type: SupportedNetworkType.evm}
      ));

      setIsEditing(false);
      setSelectedAccount(null);
    },
    [setAccountLabel],
  );

  const handleAddNew = useCallback(() => {
    setAddNew(true);
  }, []);

  return (
    <Box pt={{xl: 4}}>
      {renderMenu()}
      {renderSnackbar()}
      <Box display={'flex'} mb={2}>
        <PageTitle
          breadcrumbs={{
            history: [
              {url: '/', name: 'Dashboard'},
              {url: '/dashboard/wallet', name: 'Wallet'},
            ],
            active: {name: `Manage`},
          }}
          title={{name: 'Manage Accounts', component: titleComponent}}
        />
      </Box>
      <Grid container>
        {notConnected && (
          <Grid item xs={12} sm={12} md={4}>
            <Box>{connectButton}</Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Accounts'
              action={
                <IconButton color='primary' onClick={handleAddNew}>
                  <AddIcon />
                </IconButton>
              }
            />
            {addNew ? (
              <CardContent>
                <Grid container>
                  <Grid item xs={12}>
                    <Grid
                      alignItems='center'
                      alignContent='center'
                      container
                      spacing={2}>
                      <Grid item xs>
                        <TextField
                          label='New address'
                          fullWidth
                          helperText={error}
                          error={!!error}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position='end'
                                onClick={handlePaste}>
                                <Tooltip title={'Paste valid account'}>
                                  <IconButton
                                    aria-label='paste'
                                    color='primary'>
                                    <CallReceivedIcon />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          onChange={onChangeAddress}
                        />
                      </Grid>
                      <Grid item>
                        <Tooltip title={'Add valid account'}>
                          <Button
                            aria-label='add'
                            color='primary'
                            onClick={handleAddAccount}
                            disabled={!address}
                            startIcon={<DoneIcon />}>
                            Save
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            ) : null}
            <List>
              {wallet[SupportedNetworkType.evm].map((a, index: number) => (
                <React.Fragment key={index}>
                  <AccountListItem
                    account={a}
                    editing={a.address.toLowerCase() === selectedAccount?.address.toLowerCase() && isEditing}
                    isConnected={a.address.toLowerCase() === account?.toLowerCase()}
                    onLabelChange={handleLabelChange}
                    onOpenMenu={handleOpenMenu}
                    isDefault={index == 0}
                  />
                  <Divider light />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Accounts;
