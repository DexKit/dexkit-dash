import React, {useCallback, useState, useRef} from 'react';

import {useAccountsModal} from 'hooks/useAccountsModal';

import {Box, Typography, Snackbar, CircularProgress} from '@material-ui/core';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {CremaTheme} from 'types/AppContextPropsType';
import DoneIcon from '@material-ui/icons/Done';

import {Grid, Tooltip, Button} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
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
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import {SupportedNetworkType, Web3State} from 'types/blockchain';
import {UIAccount} from 'redux/_ui/reducers';

import AccountListItem from '../AccountsListItem';
import {Alert} from '@material-ui/lab';

import SquaredIconButton from 'shared/components/SquaredIconButton';

import {ReactComponent as EditIcon} from 'assets/images/icons/edit.svg';
import {ReactComponent as CloseCircleIcon} from 'assets/images/icons/close-circle.svg';
import ContainedInput from 'shared/components/ContainedInput';
import {useHistory} from 'react-router-dom';
import {useMobile} from 'hooks/useMobile';

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    width: '100%',
  },
  inputAddress: {
    display: 'flex',
  },
}));

const Accounts = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const [editLabel, setEditLabel] = useState<number | undefined>();
  const [label, setLabel] = useState<string>();
  const [copyText, setCopyText] = useState('Copy to clipboard');

  const [anchorEl, setAnchorEl] = useState<Element>();
  const [addNew, setAddNew] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [selectActive, setSelectActive] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState(
    SupportedNetworkType.evm,
  );

  const [selectedAccount, setSelectedAccount] = useState<UIAccount | null>(
    null,
  );

  const dispatch = useDispatch();

  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const {web3State, onConnectWeb3, account} = useWeb3();

  const addressInputRef = useRef<HTMLInputElement>();

  const handlePaste = async () => {
    addressInputRef.current?.focus();
    document.execCommand('paste');
  };

  const onChangeAddress = (
    ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = ev.currentTarget.value;

    if (!Web3Wrapper.isAddress(value)) {
      setError('Address is not valid');
    } else {
      setError(undefined);
    }

    setAddress(value);
  };

  const handleAddAccount = useCallback(() => {
    if (address && Web3Wrapper.isAddress(address)) {
      dispatch(
        addAccounts({
          accounts: [
            {
              address: address,
              label: address,
              networkType: selectedNetwork,
            },
          ],
          type: selectedNetwork,
        }),
      );

      setAddNew(false);
      setAddress(undefined);
    }
  }, [address, dispatch, addAccounts]);

  const accountsModal = useAccountsModal();

  const handleConnectWeb3 = useCallback(() => {
    history.push('/onboarding/login-wallet');
    accountsModal.setShow(false);
  }, []);

  const isMobile = useMobile();

  const connectButton = (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <Button
        variant='contained'
        disabled={web3State === Web3State.Connecting}
        startIcon={
          web3State === Web3State.Connecting ? (
            <CircularProgress color='inherit' size={theme.spacing(6)} />
          ) : undefined
        }
        color='primary'
        fullWidth={isMobile}
        onClick={handleConnectWeb3}
        endIcon={<AccountBalanceWalletIcon />}>
        {web3State === Web3State.Connecting
          ? isMobile
            ? 'Connecting...'
            : 'Connecting... Check Wallet'
          : isMobile
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

  const handleMakeDefault = useCallback(
    (account: UIAccount) => {
      dispatch(setDefaultAccount({account: account, type: selectedNetwork}));
      if (history.location.pathname.startsWith('/wallet')) {
        history.push(`/wallet/${account.address}`);
      }
    },
    [dispatch, setDefaultAccount],
  );

  const handleRemove = useCallback(() => {
    if (selectedAccount) {
      dispatch(
        removeAccount({account: selectedAccount, type: selectedNetwork}),
      );
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
        setAccountLabel({
          account: {
            address: account.address,
            label: newLabel,
            networkType: selectedNetwork,
          },
          type: selectedNetwork,
        }),
      );

      setIsEditing(false);
      setSelectedAccount(null);
    },
    [setAccountLabel],
  );

  const handleAddNew = useCallback(() => {
    setAddNew(true);
  }, []);

  const handleToggleSelect = useCallback(() => {
    setSelectActive((active) => {
      if (active) {
        setSelectedAccounts([]);
      }
      return !active;
    });
  }, []);

  const [selectedAccounts, setSelectedAccounts] = useState<UIAccount[]>([]);

  const isAccountSelected = useCallback(
    (selectedAccount: UIAccount) => {
      return (
        selectedAccounts.findIndex(
          (a) => a.address === selectedAccount.address,
        ) > -1
      );
    },
    [selectedAccounts],
  );

  const handleSelect = useCallback(
    (selectedAccount: UIAccount) => {
      let newAccounts = [...selectedAccounts];

      let index = newAccounts.findIndex(
        (acc) => acc.address === selectedAccount.address,
      );

      if (index > -1) {
        newAccounts.splice(index, 1);
      } else {
        newAccounts.push(selectedAccount);
      }

      setSelectedAccounts(newAccounts);
    },
    [selectedAccounts],
  );

  // TODO: put a confirm modal before this
  const handleRemoveMultiple = useCallback(() => {
    for (let account of selectedAccounts) {
      dispatch(removeAccount({account: account, type: selectedNetwork}));

      let newAccounts = [...selectedAccounts];

      let index = selectedAccounts.findIndex(
        (another) => another.address === another.address,
      );

      if (index > -1) {
        newAccounts.splice(index, 1);
        setSelectedAccounts(newAccounts);
      }
    }
  }, [selectedAccounts]);

  return (
    <Box pt={{xl: 4}}>
      {renderSnackbar()}
      <Grid container spacing={4}>
        {notConnected && (
          <Grid item xs={12}>
            <Box>{connectButton}</Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='body1'>Add new account</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid
                alignItems='center'
                alignContent='center'
                container
                spacing={2}>
                <Grid item xs>
                  <ContainedInput
                    placeholder='Address'
                    fullWidth
                    ref={(ref: any) => {
                      addressInputRef.current = ref;
                    }}
                    /*endAdornment={
                      <InputAdornment position='end' onClick={handlePaste}>
                        <Tooltip title={'Paste valid account'}>
                          <IconButton aria-label='paste' color='primary'>
                            <CallReceivedIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    }*/
                    onChange={onChangeAddress}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title={'Add valid account'}>
                    <SquaredIconButton
                      onClick={handleAddAccount}
                      disabled={
                        address === '' ||
                        address === undefined ||
                        error !== undefined
                      }>
                      <AddIcon
                        color={
                          address !== '' && address !== undefined && !error
                            ? 'primary'
                            : 'inherit'
                        }
                      />
                    </SquaredIconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {error ? (
                  <Box mt={2}>
                    <Typography
                      variant='caption'
                      style={{color: theme.palette.error.main}}>
                      {error}
                    </Typography>
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/*<Grid item xs={12}>
          <SwipeableViews>
            <Box display='flex'>
              <Box mr={2}>
                <Chip size='small' label='BTC' />
              </Box>
              <Box mr={2}>
                <Chip clickable size='small' label='ETH' variant='outlined' />
              </Box>
              <Box>
                <Chip clickable size='small' label='BSC' variant='outlined' />
              </Box>
            </Box>
          </SwipeableViews>
        </Grid> */}
        <Grid item xs={12}>
          <Typography variant='body1'>Manage Accounts</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='body1'>
              {wallet[selectedNetwork].length} Accounts
            </Typography>

            {selectActive ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item>
                    <SquaredIconButton onClick={handleToggleSelect}>
                      <CloseCircleIcon />
                    </SquaredIconButton>
                  </Grid>
                  <Grid item>
                    <Tooltip title='Remove items'>
                      <SquaredIconButton
                        onClick={handleRemoveMultiple}
                        disabled={selectedAccounts.length === 0}>
                        <DeleteIcon
                          color={
                            selectedAccounts.length > 0 ? 'error' : 'inherit'
                          }
                        />
                      </SquaredIconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <SquaredIconButton onClick={handleToggleSelect}>
                <DeleteIcon />
              </SquaredIconButton>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {wallet[selectedNetwork].map((a, index: number) => (
              <Grid item xs={12} key={index}>
                <AccountListItem
                  account={a}
                  isConnected={
                    a.address.toLowerCase() === account?.toLowerCase()
                  }
                  onLabelChange={handleLabelChange}
                  onOpenMenu={handleOpenMenu}
                  isDefault={index == 0}
                  selectActive={selectActive}
                  onSelect={handleSelect}
                  selected={isAccountSelected(a)}
                  onMakeDefault={handleMakeDefault}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Accounts;
