import React, {useCallback, useState} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Box,
  useTheme,
  Button,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';

interface DeploySuccessDialogProps extends DialogProps {
  transactionHash: string;
  contractAddress: string;
}

export const DeploySuccessDialog = (props: DeploySuccessDialogProps) => {
  const theme = useTheme();
  const {transactionHash, contractAddress} = props;
  const {chainId} = useWeb3();

  return (
    <Dialog {...props} disableBackdropClick>
      <DialogContent>
        <Grid
          container
          alignItems='center'
          alignContent='center'
          justify='center'
          direction='column'
          spacing={4}>
          <Grid item>
            <CheckCircleIcon
              style={{
                color: theme.palette.success.main,
                fontSize: theme.spacing(16),
              }}
            />
          </Grid>
          <Grid item>
            <Typography gutterBottom align='center' variant='h5'>
              Smart contract deployed
            </Typography>
            <Typography align='center' variant='body1'>
              See the transaction for more details
            </Typography>
          </Grid>
          <Grid item>
            <Box py={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    component={RouterLink}
                    to={`/wizard/contract/${contractAddress}`}
                    fullWidth
                    color='primary'
                    variant='contained'>
                    View contract
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    target='_blank'
                    href={getTransactionScannerUrl(
                      chainId as number,
                      transactionHash,
                    )}
                    fullWidth
                    color='primary'
                    variant='outlined'>
                    View transaction
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DeploySuccessDialog;
