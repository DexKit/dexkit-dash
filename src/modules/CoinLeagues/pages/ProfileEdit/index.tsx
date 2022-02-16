import {
  Typography,
  Grid,
  TextField,
  makeStyles,
  useTheme,
  Button,
  InputAdornment,
  CircularProgress,
  Breadcrumbs,
  Link,
  IconButton,
} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import React, {useCallback, useState, useEffect} from 'react';
import MainLayout from 'shared/components/layouts/main';

import {Edit} from '@material-ui/icons';

import IntlMessages from '@crema/utility/IntlMessages';
import {useHistory, useParams} from 'react-router';
import {ProfileImage} from 'modules/CoinLeagues/components/Profile/ProfileImage';

import {useDebounce} from 'hooks/useDebounce';
import {useCoinLeagueProfileChecker} from 'modules/CoinLeagues/hooks/useCoinLeagueProfileChecker';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import {useIntl} from 'react-intl';
import ProfileSelectImageDialog from 'modules/CoinLeagues/components/Profile/ProfileSelectImageDialog';

import {useToggler} from 'hooks/useToggler';
import {useMobile} from 'hooks/useMobile';

import {
  useGameProfileUpdater,
  useProfileGame,
} from 'modules/CoinLeagues/hooks/useGameProfile';
import {getNormalizedUrl} from 'utils/browser';
import {HOME_ROUTE} from 'shared/constants/routes';
import {isAddress} from 'web3-utils';
import {reduceAddress} from 'modules/CoinLeagues/utils/game';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  fontBold: {
    fontWeight: 600,
  },
}));

export const ProfileEditPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const {messages} = useIntl();
  const isMobile = useMobile();

  const [error, setError] = useState<Error>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const [pending, setPending] = useState(false);
  const [username, setUsername] = useState('');

  const selectImageToggler = useToggler();

  const {address}: {address: string} = useParams();

  const profileGame = useProfileGame(address);

  const [image, setImage] = useState<string>();
  const [selectedAsset, setSelectedAsset] =
    useState<{tokenId: string; contractAddress: string}>();

  const handleCloseSelectImageDialog = useCallback(() => {
    selectImageToggler.set(false);
  }, [selectImageToggler]);

  const handleChangeUsername = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value !== '') {
        if (/^[a-z0-9]+$/.test(e.target.value)) {
          setUsername(e.target.value);
        }
      } else {
        setUsername('');
      }
    },
    [],
  );

  const handleSelectProfileImage = useCallback(
    (params: {tokenId: string; contractAddress: string; image: string}) => {
      setSelectedAsset(params);

      selectImageToggler.set(false);
      setImage(params.image);
    },
    [selectImageToggler],
  );

  const lazyUsername = useDebounce(username, 400);

  const profileChecker = useCoinLeagueProfileChecker(lazyUsername);

  const isUsernameInvalid = useCallback(() => {
    return (
      lazyUsername !== (profileGame.data?.username || '') &&
      !profileChecker.data?.isAvailable
    );
  }, [profileChecker.data, lazyUsername, profileGame.data]);

  const renderUsernameCheck = useCallback(() => {
    if (profileChecker.isLoading) {
      return <CircularProgress color='primary' />;
    }

    if (lazyUsername !== (profileGame.data?.username || '')) {
      if (profileChecker.data?.isAvailable) {
        return <CheckCircleIcon style={{color: theme.palette.success.main}} />;
      } else {
        return <InfoIcon style={{color: theme.palette.error.main}} />;
      }
    }
  }, [theme, profileChecker, lazyUsername, profileGame.data]);

  const profileUpdater = useGameProfileUpdater();

  useEffect(() => {
    if (profileGame.data) {
      if (profileGame.data?.username) {
        setUsername(profileGame.data.username);
      }

      if (profileGame.data.tokenAddress && profileGame.data.tokenId) {
        setSelectedAsset({
          tokenId: profileGame.data.tokenId,
          contractAddress: profileGame.data.tokenAddress,
        });
      }

      if (profileGame.data.profileImage) {
        setImage(profileGame.data.profileImage);
      }
    }
  }, [profileGame.data]);

  const handleSaveProfile = useCallback(() => {
    if (selectedAsset !== undefined && username !== '') {
      setPending(true);
      profileUpdater.onPostMetadata(
        username,
        selectedAsset.contractAddress,
        selectedAsset.tokenId,
        {
          onConfirmation: () => {
            if (profileGame.data) {
              setSuccessMessage(
                messages['app.coinLeague.profileUpdated'] as string,
              );
            } else {
              setSuccessMessage(
                messages['app.coinLeague.profileCreated'] as string,
              );
            }
            setPending(false);
          },
          onError: (err) => {
            setError(err);
            setPending(false);
          },
        },
      );
    }
  }, [profileUpdater, username, selectedAsset, profileGame, messages]);

  const handleGoClick = useCallback(() => {
    history.push(`/coin-league/profile/${address}`);
  }, [history, address]);

  const handleClearError = useCallback(() => setError(undefined), []);
  const handleClearSuccess = useCallback(
    () => setSuccessMessage(undefined),
    [],
  );

  return (
    <>
      {selectImageToggler.show && (
        <ProfileSelectImageDialog
          dialogProps={{
            open: selectImageToggler.show,
            onClose: handleCloseSelectImageDialog,
            fullWidth: true,
            maxWidth: 'lg',
            fullScreen: isMobile,
          }}
          onSelect={handleSelectProfileImage}
          address={address}
        />
      )}
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {!isMobile ? (
                <Grid item xs={12}>
                  <Breadcrumbs>
                    <Link
                      color='inherit'
                      component={RouterLink}
                      to={HOME_ROUTE}>
                      <IntlMessages id='app.coinLeagues.dashboard' />
                    </Link>
                    <Link
                      color='inherit'
                      component={RouterLink}
                      to={`/coin-league/profile/${address}`}>
                      <IntlMessages id='app.coinLeagues.profile' />
                    </Link>
                    <Typography>
                      {profileGame.data?.username
                        ? profileGame.data?.username
                        : isAddress(address)
                        ? reduceAddress(address)
                        : ''}
                    </Typography>
                  </Breadcrumbs>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item>
                    <IconButton onClick={handleGoClick} size='small'>
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>
                      <IntlMessages id='app.coinLeague.edit' />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleClearError}>
                {error?.message}
              </Alert>
            </Grid>
          )}
          {successMessage && (
            <Grid item xs={12}>
              <Alert severity='success' onClose={handleClearSuccess}>
                {successMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='app.coinLeague.pictureAndCover' />
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              <IntlMessages id='app.coinLeague.chooseOneOfYourNFTImagesToRepresentYourProfile' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ProfileImage
              onClick={selectImageToggler.handleToggle}
              image={image ? getNormalizedUrl(image) : undefined}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='app.coinLeague.accountInformation' />
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              <IntlMessages id='app.coinLeague.editYourPublicProfileInformation' />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              placeholder={messages['app.coinLeague.username'] as string}
              error={isUsernameInvalid()}
              helperText={
                isUsernameInvalid()
                  ? (messages['app.coinLeague.usernameUnavailable'] as string)
                  : undefined
              }
              onChange={handleChangeUsername}
              value={username}
              variant='outlined'
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {renderUsernameCheck()}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              disabled={
                pending ||
                (lazyUsername !== (profileGame.data?.username || '') &&
                  !profileChecker.data?.isAvailable)
              }
              onClick={handleSaveProfile}
              startIcon={
                pending ? (
                  <CircularProgress color='inherit' size='1.2rem' />
                ) : (
                  <Edit />
                )
              }
              variant='contained'
              color='primary'>
              <IntlMessages id='app.coinLeague.save' />
            </Button>
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default ProfileEditPage;
