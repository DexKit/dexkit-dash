import {
  Button,
  Grid,
  Card,
  Paper,
  CardContent,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Tooltip,
  Box,
  Breadcrumbs,
  Link,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {Alert} from '@material-ui/lab';

import {
  getTransactionScannerUrl,
  hasLondonHardForkSupport,
} from 'utils/blockchain';
import {Link as RouterLink} from 'react-router-dom';

import React, {useCallback, useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import IntlMessages from '@crema/utility/IntlMessages';
import {ConfirmDialog} from './erc20/dialogs/ConfirmDialog';
import {ethers} from 'ethers';

import axios from 'axios';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import CreatedDialog from './erc20/dialogs/CreatedDialog';
import {useDispatch} from 'react-redux';
import {addToken} from 'redux/_wizard/actions';

const ERC20_CONTRACT_DATA_URL =
  'https://raw.githubusercontent.com/DexKit/wizard-contracts/main/artifacts/contracts/ERC20_BASE.sol/Token.json';

export interface TokenSetupProps {}

export const TokenSetup = (props: TokenSetupProps) => {
  const history = useHistory();
  const userDefaultAcount = useDefaultAccount();
  const {getWeb3, getProvider, chainId} = useWeb3();

  const [error, setError] = useState<string>();

  const dispatch = useDispatch();

  const {createNotification} = useNotifications();

  const [values, setValues] = useState({
    name: '',
    symbol: '',
    supply: 1,
  });

  const [confirmPending, setConfirmPending] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === 'symbol') {
        setValues({
          ...values,
          [e.target.name]: e.target.value.toUpperCase().replace(' ', ''),
        });
      } else {
        setValues({...values, [e.target.name]: e.target.value});
      }
    },
    [values],
  );

  const [showCreated, setShowCreated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const handleBack = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  const handleCreate = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    setConfirmPending(true);

    if (!userDefaultAcount) {
      return;
    }

    if (!chainId) {
      return;
    }

    let response = await axios.get(ERC20_CONTRACT_DATA_URL);

    let contractData = response.data;

    let pr = new ethers.providers.Web3Provider(getProvider());

    let factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.bytecode,
      pr.getSigner(),
    );

    let factoryContract: Promise<ethers.Contract>;

    if (hasLondonHardForkSupport(chainId)) {
      factoryContract = factory.deploy(
        values.name,
        values.symbol,
        values.supply,
      );
    } else {
      factoryContract = factory.deploy(
        values.name,
        values.symbol,
        values.supply,
      );
    }

    factoryContract
      .then((contract) => {
        setShowCreated(true);
        setTransactionHash(contract.deployTransaction.hash);

        createNotification({
          title: 'Create token',
          body: `Creating a new token named ${values.name}`,
          timestamp: Date.now(),
          url: getTransactionScannerUrl(
            chainId,
            contract.deployTransaction.hash,
          ),
          urlCaption: 'View transaction',
          type: NotificationType.TRANSACTION,
          metadata: {
            chainId: chainId,
            transactionHash: contract.deployTransaction.hash,
            status: 'pending',
          } as TxNotificationMetadata,
        });

        dispatch(
          addToken({
            name: values.name,
            symbol: values.symbol,
            supply: values.supply,
          }),
        );
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setShowConfirm(false);
        setConfirmPending(false);
      });
  }, [history, values, getWeb3, userDefaultAcount, chainId, dispatch]);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const isFormValid = useCallback(() => {
    if (values.name === '') {
      return false;
    }

    if (values.supply === 0 || values.supply < 0) {
      return false;
    }

    if (values.symbol === '') {
      return false;
    }

    return true;
  }, [values]);

  const handleCloseCreated = useCallback(() => {
    setShowCreated(false);
    history.push('/wizard');
  }, []);

  const handleGoWizard = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  const handleClearError = useCallback(() => {
    setError(undefined);
  }, []);

  return (
    <>
      <ConfirmDialog
        pending={confirmPending}
        data={values}
        open={showConfirm}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirm}
      />
      <CreatedDialog
        open={showCreated}
        onClose={handleCloseCreated}
        transactionHash={transactionHash}
      />
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to='/wizard'>
            Wizard
          </Link>
          <Link color='inherit'>Tokens</Link>
        </Breadcrumbs>
      </Box>
      <Box mb={2} display='flex' alignItems='center' alignContent='center'>
        <Box mr={2} display='flex' alignItems='center' alignContent='center'>
          <IconButton onClick={handleGoWizard} size='small'>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography variant='h5'>Create token</Typography>
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    label='Name'
                    variant='outlined'
                    name='name'
                    value={values.name}
                    error={values.name === ''}
                    helperText=''
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='The name of your token'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label='Symbol'
                    variant='outlined'
                    name='symbol'
                    value={values.symbol}
                    error={values.symbol === ''}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='Symbol used to identify the token in the blockchain'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label='Supply'
                    variant='outlined'
                    name='supply'
                    type='number'
                    value={values.supply}
                    onChange={handleChange}
                    error={values.supply == 0 || values.supply < 0}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='The amount of token supply'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {error ? (
          <Grid item xs={12}>
            <Alert severity='error' onClose={handleClearError}>
              {error}
            </Alert>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Paper>
            <Box p={4}>
              <Box display='flex' justifyContent='space-between'>
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  variant='outlined'>
                  Cancel
                </Button>
                <Button
                  disabled={!isFormValid()}
                  onClick={handleCreate}
                  startIcon={<ArrowForwardIcon />}
                  variant='contained'
                  color='primary'>
                  Create
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TokenSetup;
