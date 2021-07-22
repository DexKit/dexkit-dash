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
  Accordion,
  AccordionSummary,
  IconButton,
  FormControlLabel,
  Typography,
  Switch,
  Chip,
} from '@material-ui/core';

import React, {useCallback, useState} from 'react';
import MainLayout from 'shared/components/layouts/main';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from 'react-router';
import DialogPortal from 'shared/components/Common/DialogPortal';
import ConfirmDialog from './erc721/ConfirmDialog';
import {useFormik} from 'formik';
import {Erc721Data} from 'modules/Wizard/types';
import {useWeb3} from 'hooks/useWeb3';
import DeployingDialog from './erc721/DeployingDialog';
import DeployErrorDialog from './erc721/DeployErrorDialog';
import DeploySuccessDialog from './erc721/DeploySuccessDialog';

import SolcWorker from 'worker-loader!../../solc.worker'; // eslint-disable-line
import Web3 from 'web3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Contract} from 'web3-eth-contract';

export interface Erc721SetupProps {}

export const Erc721Setup = (props: Erc721SetupProps) => {
  const history = useHistory();

  const userDefaultAcount = useDefaultAccount();
  const {getWeb3} = useWeb3();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [transactionHash, setTransactionHash] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const [isDeploying, setIsDeploying] = useState(false);

  const [isDeploySuccess, setIsDeploySuccess] = useState(false);

  const [deployError, setDeployError] = useState('');

  const {handleSubmit, handleChange, values, submitForm} =
    useFormik<Erc721Data>({
      initialValues: {
        baseUri: '',
        name: '',
        symbol: '',
      },
      onSubmit: async (values: Erc721Data) => {
        let web3 = getWeb3();

        if (userDefaultAcount) {
          let worker: Worker = new SolcWorker();

          setShowConfirmDialog(false);
          setIsDeploying(true);

          worker.postMessage({
            action: 'compile',
            contract: 'erc721',
          });

          worker.addEventListener('message', async (event) => {
            if (event.data.cmd == 'compiled') {
              if (web3) {
                let contract = new web3.eth.Contract(event.data.abi);

                let contractDeploy = contract.deploy({
                  data: event.data.bytecode,
                  arguments: [values.name, values.symbol],
                });

                let gas = await contractDeploy.estimateGas();
                let gasPrice = await web3?.eth.getGasPrice();

                contractDeploy
                  .send({
                    from: userDefaultAcount,
                    gas,
                    gasPrice,
                  })
                  .on('transactionHash', (transactionHash: string) => {
                    setTransactionHash(transactionHash);
                  })
                  .on('confirmation', () => {
                    setIsDeploySuccess(true);
                    setIsDeploying(false);
                  })
                  .on('error', (reason) => {
                    setDeployError(reason.message);
                    setIsDeploying(false);
                  })
                  .then((contract: Contract) => {
                    setContractAddress(contract.options.address);
                  });
              }
            }
          });
        }
      },
    });

  const handleBack = useCallback(() => {
    history.push('/wizard/deploy');
  }, [history]);

  const handleDeploy = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const handleDialogCancel = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleCloseDeployError = useCallback(() => {}, []);
  const handleTryAgain = useCallback(() => {}, []);

  return (
    <>
      <DialogPortal>
        <ConfirmDialog
          open={showConfirmDialog}
          data={values}
          onConfirm={submitForm}
          onCancel={handleDialogCancel}
        />
        <DeployingDialog open={isDeploying} />
        <DeploySuccessDialog
          open={isDeploySuccess}
          contractAddress={contractAddress}
          transactionHash={transactionHash}
        />
        <DeployErrorDialog
          open={deployError != ''}
          error={deployError}
          onCancel={handleCloseDeployError}
          onTryAgain={handleTryAgain}
        />
      </DialogPortal>
      <Grid container justify='center' spacing={4}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper>
                <Box p={4}>
                  <Grid
                    container
                    justify='space-between'
                    spacing={2}
                    alignItems='center'
                    alignContent='center'>
                    <Grid item>
                      <Chip label='ERC721' />
                    </Grid>
                    <Grid item>
                      <Typography variant='subtitle1'>
                        Non-Fungible Token
                      </Typography>
                    </Grid>
                    <Grid>
                      <FormControlLabel
                        value='end'
                        control={<Switch color='primary' />}
                        label='Expert mode'
                        labelPlacement='end'
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label='Name'
                          variant='outlined'
                          name='name'
                          value={values.name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label='Symbol'
                          variant='outlined'
                          name='symbol'
                          value={values.symbol}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label='Base URI'
                          variant='outlined'
                          name='baseUri'
                          value={values.baseUri}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Tooltip title='Hello'>
                                  <HelpIcon />
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}></Grid>
                      <Grid item xs={12}>
                        <Box
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='space-between'>
                          <Button onClick={handleBack} variant='outlined'>
                            Back
                          </Button>
                          <Button
                            onClick={handleDeploy}
                            color='primary'
                            variant='contained'>
                            Deploy
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Erc721Setup;
