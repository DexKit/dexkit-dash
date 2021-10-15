import React, {useState, useCallback, useEffect} from 'react';

import {
  Avatar,
  makeStyles,
  Box,
  Grid,
  Link,
  Typography,
  Paper,
  Button,
  CircularProgress,
  useTheme,
  Tooltip,
  Divider,
} from '@material-ui/core';
import {ChainId} from 'types/blockchain';

import {Alert} from '@material-ui/lab';

import {Link as RouterLink} from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';

import {NFTEmptyStateImage, ShareIcon} from 'shared/components/Icons';

import GavelIcon from '@material-ui/icons/Gavel';
import {Kittygotchi} from 'types/kittygotchi';
import FeedKittygotchiButton from 'modules/Kittygotchi/components/buttons/FeedKittygotchiButton';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {useWeb3} from 'hooks/useWeb3';

import {Skeleton} from '@material-ui/lab';
import {useMobile} from 'hooks/useMobile';

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: ' 1px solid #525C75',
    backgroundColor: '#2E3243',
    width: theme.spacing(28),
    height: theme.spacing(28),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(32),
      height: theme.spacing(32),
    },
  },
}));

interface ProfileKittygotchiCardProps {
  loading?: boolean;
  onMint?: () => void;
  onFeed?: () => void;
  onEdit?: () => void;
  kittygotchi?: Kittygotchi;
  loadingKyttie?: boolean;
}

export const ProfileKittygotchiCard = (props: ProfileKittygotchiCardProps) => {
  const {loading, onMint, onEdit, onFeed, kittygotchi, loadingKyttie} = props;
  const theme = useTheme();

  const classes = useStyles();

  const {chainId} = useWeb3();

  const isMobile = useMobile();

  const renderEmpty = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {chainId !== ChainId.Matic && chainId !== ChainId.Mumbai ? (
              <Grid item xs={12}>
                <Alert severity='info'>
                  <Typography variant='body2'>
                    Connect to <strong>Polygon(MATIC)</strong> network to create
                    a Kittygotchi
                  </Typography>
                </Alert>
              </Grid>
            ) : null}
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
                create one.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='center'>
                <Button
                  onClick={onMint}
                  disabled={
                    chainId !== ChainId.Matic && chainId !== ChainId.Mumbai
                  }
                  startIcon={<GavelIcon />}
                  variant='outlined'
                  color='primary'>
                  Create Kittygotchi
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
        <Grid item xs={isMobile ? 12 : undefined}>
          <Grid container spacing={2} direction='column'>
            <Grid item>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {loadingKyttie ? (
                  <Skeleton className={classes.avatar} variant='circle' />
                ) : (
                  <Avatar className={classes.avatar} src={kittygotchi?.image} />
                )}
              </Box>
            </Grid>
            <Grid item>
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                alignContent='center'
                spacing={2}>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(5)}
                      height={theme.spacing(5)}
                    />
                  ) : (
                    <Tooltip title='Feed'>
                      <FeedKittygotchiButton onClick={onFeed} />
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(5)}
                      height={theme.spacing(5)}
                    />
                  ) : (
                    <Tooltip title='Edit (Coming soon)'>
                      <RoundedIconButton disabled onClick={onEdit}>
                        <EditIcon />
                      </RoundedIconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  {loadingKyttie ? (
                    <Skeleton
                      variant='circle'
                      width={theme.spacing(5)}
                      height={theme.spacing(5)}
                    />
                  ) : (
                    <Tooltip title='View on Opensea (Coming soon)'>
                      <RoundedIconButton disabled>
                        <ShareIcon />
                      </RoundedIconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={isMobile ? 12 : undefined}>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} />
        </Grid>
        <Grid item xs={isMobile ? 12 : true}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography align={isMobile ? 'center' : 'left'} variant='h4'>
                Kittygotchi #{kittygotchi?.id}
              </Typography>
            </Grid>
            {kittygotchi ? (
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent={isMobile ? 'center' : 'flex-start'}
                  alignItems='center'
                  alignContent='center'
                  spacing={4}>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      ATK
                    </Typography>
                    <Typography variant='h5'>
                      {!kittygotchi?.attack ? (
                        <Skeleton />
                      ) : (
                        kittygotchi?.attack
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      DEF
                    </Typography>
                    <Typography variant='h5'>
                      {!kittygotchi?.defense ? (
                        <Skeleton />
                      ) : (
                        kittygotchi?.defense
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color='textSecondary' variant='caption'>
                      RUN
                    </Typography>
                    <Typography variant='h5'>
                      {!kittygotchi?.run ? <Skeleton /> : kittygotchi?.run}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
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
            Creating your Kittygotchi
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
      <Box p={4}>
        {loading
          ? renderLoading()
          : kittygotchi || loadingKyttie
          ? renderKittygotchi()
          : renderEmpty()}
      </Box>
    </Paper>
  );
};
