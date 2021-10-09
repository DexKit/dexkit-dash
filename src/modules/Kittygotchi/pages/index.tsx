import React, {useState, useCallback, useEffect} from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  Divider,
  CardContent,
  Card,
  LinearProgress,
  withStyles,
  Paper,
  CircularProgress,
  useTheme,
  Avatar,
  ButtonBase,
  Button,
  CardMedia,
  alpha,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  CardActionArea,
  TextField,
} from '@material-ui/core';

import {FlashOutlinedIcon, ShieldOutlinedIcon} from 'shared/components/Icons';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {RewardDialog} from '../components/dialogs/RewardDialog';
import {useToggler} from 'hooks/useToggler';
import {useKittygotchiList} from '../hooks/index';
import {KittygotchiCard} from '../components/KittygotchiCard';
import {Kittygotchi} from 'types/kittygotchi';

const useStyles = makeStyles((theme) => ({
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[700],
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

export const ProfileIndex = () => {
  const classes = useStyles();
  const theme = useTheme();

  const rewardToggler = useToggler(false);

  const kittygotchiList = useKittygotchiList();

  const history = useHistory();

  const handleKittygotchiClick = useCallback(
    (kittygotchi: Kittygotchi) => {
      history.push(`/kittygotchi/${kittygotchi.id}/`);
    },
    [history],
  );

  useEffect(() => {
    kittygotchiList.get();
  }, []);

  return (
    <>
      <RewardDialog
        dialogProps={{
          open: rewardToggler.show,
          onClose: rewardToggler.toggle,
        }}
      />
      <Box>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to='/'>
                  <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  mr={2}>
                  <IconButton size='small' component={RouterLink} to={'/'}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography variant='h5'>My Kitties</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Paper>
              <Box p={4}>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Search...'
                />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              {kittygotchiList.data?.map((kittygotchi, index) => (
                <Grid item xs={4} key={index}>
                  <KittygotchiCard
                    onClick={handleKittygotchiClick}
                    kittygotchi={kittygotchi}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileIndex;
