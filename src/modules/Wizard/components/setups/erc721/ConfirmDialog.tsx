import React, {useCallback} from 'react';

import {
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogProps,
  Button,
  DialogContent,
  Box,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import {useWeb3} from 'hooks/useWeb3';
import {Erc721Data} from 'modules/Wizard/types';

export interface ConfirmDialogProps extends DialogProps {
  data: Erc721Data;
  onConfirm: () => void;
  onCancel: () => void;
}

export default (props: ConfirmDialogProps) => {
  const {data, onConfirm, onCancel} = props;

  const {chainId} = useWeb3();

  return (
    <Dialog {...props}>
      <DialogContent>
        <Grid
          container
          alignItems='center'
          alignContent='center'
          direction='column'
          spacing={4}>
          <Grid item>
            <InfoIcon fontSize='large' />
          </Grid>
          <Grid item>
            <Typography align='center' gutterBottom variant='h5'>
              Check information
            </Typography>
            <Typography align='center' variant='body1'>
              Check your information before you deploy your smart contract
            </Typography>
          </Grid>
          <Grid item>
            <Paper variant='outlined'>
              <Box p={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      alignContent='center'>
                      <Grid>
                        <Typography variant='body1'>Network</Typography>
                      </Grid>
                      <Grid>
                        <Typography variant='body1'>{chainId}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      alignContent='center'>
                      <Grid>
                        <Typography variant='body1'>Name</Typography>
                      </Grid>
                      <Grid>
                        <Typography variant='body1'>{data.name}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      alignContent='center'>
                      <Grid>
                        <Typography variant='body1'>Symbol</Typography>
                      </Grid>
                      <Grid>
                        <Typography variant='body1'>{data.symbol}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justify='space-between'
                      alignItems='center'
                      alignContent='center'>
                      <Grid>
                        <Typography variant='body1'>Base URI</Typography>
                      </Grid>
                      <Grid>
                        <Typography variant='body1'>{data.baseUri}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Box py={4}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    onClick={onConfirm}
                    variant='contained'
                    color='primary'>
                    Confirm
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={onCancel} variant='contained'>
                    Cancel
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
