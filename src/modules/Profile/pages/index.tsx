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

import {
  FlashOutlinedIcon,
  NFTEmptyStateImage,
  ShieldOutlinedIcon,
} from 'shared/components/Icons';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {ProfilePointsCard} from '../components/ProfilePointsCard';
import {useProfileKittygotchi, useProfilePoints} from '../hooks';

import GavelIcon from '@material-ui/icons/Gavel';
import {ProfileKittygotchiCard} from '../components/ProfileKittygotchiCard';
import {useKittygotchiMint} from 'modules/Kittygotchi/hooks';

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

  const [mintLoading, setMintLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const history = useHistory();

  const profilePoints = useProfilePoints();

  const kittygotchiMint = useKittygotchiMint();

  const kittyProfile = useProfileKittygotchi();

  const handleMint = useCallback(() => {
    kittygotchiMint.onMintCallback({
      onConfirmation: (hash?: string) => {
        setMintLoading(false);
      },
      onSubmit: (hash?: string) => {
        setMintLoading(true);
      },
      onError: (error: any) => {
        setErrorMessage(error);
        setMintLoading(false);
      },
    });
  }, [kittygotchiMint.onMintCallback]);

  return (
    <>
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
                <Typography variant='h5'>Profile</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='body1'>My Kittygotchi</Typography>
              </Grid>
              <Grid item xs={12}>
                <ProfileKittygotchiCard
                  onMint={handleMint}
                  loading={mintLoading}
                  kittygotchi={kittyProfile.kittygotchi}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='body1'>Reward Points</Typography>
              </Grid>
              <Grid item xs={12}>
                <ProfilePointsCard
                  loading={profilePoints.loading}
                  amount={profilePoints.amount}
                  maxAmount={profilePoints.maxAmount}
                />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default ProfileIndex;
