import {
  Button,
  Grid,
  Card,
  Paper,
  CardContent,
  TextField,
  InputAdornment,
  Tooltip,
  Box,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  IconButton,
  FormControlLabel,
  Typography,
  Switch,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Link,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {getTransactionScannerUrl} from 'utils/blockchain';
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
import {Contract} from 'web3-eth-contract';

const ERC20_CONTRACT_DATA_URL =
  'https://raw.githubusercontent.com/DexKit/wizard-contracts/main/artifacts/contracts/ERC20_BASE.sol/Token.json';

export interface TokenSetupProps {}

export const TokenSetup = (props: TokenSetupProps) => {
  const history = useHistory();
  const userDefaultAcount = useDefaultAccount();
  const {getWeb3, getProvider, chainId} = useWeb3();

  const {createNotification} = useNotifications();

  const [values, setValues] = useState({
    name: '',
    symbol: '',
    supply: 0,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values, [e.target.name]: e.target.value});
    },
    [values],
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();

  const handleBack = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  const handleCreate = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    let web3 = getWeb3();

    if (!userDefaultAcount) {
      return;
    }

    if (!web3) {
      return;
    }

    if (!chainId) {
      return;
    }

    let response = await axios.get(ERC20_CONTRACT_DATA_URL);

    let contractData = response.data;

    let contract = new web3.eth.Contract(contractData.abi);

    let contractDeploy = contract.deploy({
      data: contractData.bytecode,
      arguments: [values.name, values.symbol, values.supply],
    });

    await contractDeploy
      .send({
        from: userDefaultAcount,
      })
      .on('transactionHash', (transactionHash: string) => {
        createNotification({
          title: 'Create collection',
          body: `Creating a new NFT collection named ${values.name}`,
          timestamp: Date.now(),
          loading: true,
          url: getTransactionScannerUrl(chainId, transactionHash),
          urlCaption: 'View transaction',
        });
        setTransactionHash(transactionHash);
      })
      .on('confirmation', () => {})
      .on('error', (reason) => {
        console.log(reason);
      })
      .then((contract: Contract) => {});
  }, [values, getWeb3, userDefaultAcount, chainId]);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <ConfirmDialog
        data={values}
        open={showConfirm}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirm}
      />
      <Box mb={4}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to='/wizard'>
            Wizard
          </Link>
          <Link color='inherit'>Create token</Link>
        </Breadcrumbs>
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
                    value={values.supply}
                    onChange={handleChange}
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
