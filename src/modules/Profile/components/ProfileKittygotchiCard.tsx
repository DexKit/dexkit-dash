import React, {useState, useCallback, useEffect} from 'react';

import {
  Avatar,
  makeStyles,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  useTheme,
} from '@material-ui/core';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import GavelIcon from '@material-ui/icons/Gavel';
import {Kittygotchi} from 'types/kittygotchi';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(32),
    height: theme.spacing(32),
  },
}));

interface ProfileKittygotchiCardProps {
  loading?: boolean;
  onMint?: () => void;
  kittygotchi?: Kittygotchi;
}

export const ProfileKittygotchiCard = (props: ProfileKittygotchiCardProps) => {
  const {loading, onMint, kittygotchi} = props;
  const theme = useTheme();

  const classes = useStyles();

  const renderEmpty = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <NFTEmptyStateImage />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom align='center' variant='h6'>
                You don't have a Kittygotchi NFT yet
              </Typography>

              <Typography color='textSecondary' align='center' variant='body2'>
                You will need <strong>10 MATIC</strong> tokens in your wallet to
                mint one.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='center'>
                <Button
                  onClick={onMint}
                  startIcon={<GavelIcon />}
                  variant='outlined'
                  color='primary'>
                  Mint Kittygotchi
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderKittygotchi = () => {
    return (
      <Grid container spacing={4}>
        <Grid item>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <Avatar className={classes.avatar} />
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant='h6'>Kittygotchi #{kittygotchi?.id}</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderLoading = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <CircularProgress color='primary' size={theme.spacing(32)} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography align='center' variant='h6'>
            Minting your Kittygotchi
          </Typography>
          <Typography align='center' color='textSecondary' variant='body2'>
            Please, sign the transaction in your wallet
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper>
      <Box px={4} py={8}>
        {loading
          ? renderLoading()
          : kittygotchi
          ? renderKittygotchi()
          : renderEmpty()}
      </Box>
    </Paper>
  );
};
