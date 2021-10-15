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
  Tooltip,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

import {NFTEmptyStateImage, ShareIcon} from 'shared/components/Icons';

import GavelIcon from '@material-ui/icons/Gavel';
import {Kittygotchi} from 'types/kittygotchi';
import FeedKittygotchiButton from 'modules/Kittygotchi/components/buttons/FeedKittygotchiButton';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {useWeb3} from 'hooks/useWeb3';
import {useHistory} from 'react-router';
import {useNotifications} from 'hooks/useNotifications';
import {useKittygotchiFeed} from 'modules/Kittygotchi/hooks';

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: ' 1px solid #525C75',
    backgroundColor: '#2E3243',
    width: theme.spacing(32),
    height: theme.spacing(32),
  },
}));

interface ProfileKittygotchiCardProps {
  loading?: boolean;
  onMint?: () => void;
  onFeed?: () => void;
  onEdit?: () => void;
  kittygotchi?: Kittygotchi;
}

export const ProfileKittygotchiCard = (props: ProfileKittygotchiCardProps) => {
  const {loading, onMint, onEdit, onFeed, kittygotchi} = props;
  const theme = useTheme();

  const classes = useStyles();

  const {chainId} = useWeb3();

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
                You will need <strong>10 MATIC</strong> tokens on Polygon
                network in your wallet to mint one.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='center'>
                <Button
                  onClick={onMint}
                  disabled={!(chainId === ChainId.Matic)}
                  startIcon={<GavelIcon />}
                  variant='outlined'
                  color='primary'>
                  {chainId === ChainId.Matic
                    ? 'Mint Kittygotchi'
                    : 'Switch to Polygon network'}
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
          <Grid container spacing={4} direction='column'>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <Avatar className={classes.avatar} src={kittygotchi?.image} />
              </Box>
            </Grid>
            <Grid item>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                justifyContent='center'
                spacing={2}>
                <Grid item>
                  <Tooltip title='Feed'>
                    <FeedKittygotchiButton onClick={onFeed} />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title='Edit (Coming soon)'>
                    <RoundedIconButton disabled onClick={onEdit}>
                      <EditIcon />
                    </RoundedIconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title='View on Opensea (Coming soon)'>
                    <RoundedIconButton disabled>
                      <ShareIcon />
                    </RoundedIconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container spacing={4}>
            <Grid item>
              <Typography variant='h6'>
                Kittygotchi #{kittygotchi?.id}
              </Typography>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
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
