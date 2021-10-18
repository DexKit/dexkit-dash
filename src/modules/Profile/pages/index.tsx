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

import {useNotifications} from 'hooks/useNotifications';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {ProfilePointsCard} from '../components/ProfilePointsCard';
import {useProfileKittygotchi, useProfilePoints} from '../hooks';

import GavelIcon from '@material-ui/icons/Gavel';
import {ProfileKittygotchiCard} from '../components/ProfileKittygotchiCard';
import {
  useKittygotchiFeed,
  useKittygotchiList,
  useKittygotchiMint,
  useKittygotchiOnChain,
  useKittygotchiV2,
} from 'modules/Kittygotchi/hooks';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useWeb3} from 'hooks/useWeb3';
import {Kittygotchi} from 'types/kittygotchi';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {ChainId, Web3State} from 'types/blockchain';
import {FeedingKittygotchiDialog} from 'modules/Kittygotchi/components/dialogs/FeedingKittygotchiDialog';
import {useToggler} from 'hooks/useToggler';

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

  const [loadingKyttie, setLoadingKyttie] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const feedingToggler = useToggler();

  const [feedLoading, setFeedLoading] = useState(false);
  const [feedingDone, setFeedingDone] = useState(false);
  const [feedErrorMessage, setFeedErrorMessage] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();

  const clearStates = useCallback(() => {
    setFeedLoading(false);
    setFeedingDone(false);
    setFeedErrorMessage(undefined);
    setTransactionHash(undefined);
  }, []);

  const history = useHistory();

  const profilePoints = useProfilePoints();

  const kittygotchiItem = useKittygotchiV2();

  const kittygotchiUpdated = useKittygotchiOnChain();

  const kittygotchiList = useKittygotchiList();

  const kittygotchiMint = useKittygotchiMint();

  const kittyProfile = useProfileKittygotchi();

  const {createNotification} = useNotifications();

  const {chainId, account, web3State} = useWeb3();

  useEffect(() => {
    if (account && !kittyProfile.kittygotchi) {
      kittygotchiList.get(account).then((items: Kittygotchi[] | undefined) => {
        if (items && items.length > 0) {
          kittyProfile.setDefaultKittygothchi(items[items.length - 1]);
        }
      });
    }
  }, [account, kittyProfile.kittygotchi]);

  useEffect(() => {
    if (
      kittyProfile.kittygotchi &&
      web3State === Web3State.Done &&
      (chainId === ChainId.Matic || chainId === ChainId.Mumbai)
    ) {
      kittygotchiUpdated.get(kittyProfile.kittygotchi.id);
    }
  }, [kittyProfile.kittygotchi, web3State, chainId]);

  const handleMint = useCallback(() => {
    setMintLoading(true);

    kittygotchiMint.onMintCallback({
      onConfirmation: (hash?: string) => {
        setMintLoading(false);

        if (account) {
          setMintLoading(true);
          kittygotchiList
            .get(account)
            .then((items: Kittygotchi[] | undefined) => {
              if (items && items.length > 0) {
                kittyProfile.setDefaultKittygothchi(items[items.length - 1]);
              }

              setMintLoading(false);
            })
            .catch((err) => {
              setMintLoading(false);
            });
        }
      },
      onSubmit: (hash?: string) => {
        if (hash && chainId) {
          createNotification({
            title: 'Mint Kittygotchi',
            body: `Minting your kittygotchi`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: 'View transaction',
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: hash,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        }
      },
      onError: (error: any) => {
        setErrorMessage(error);
        setMintLoading(false);
      },
    });
  }, [chainId, account]);

  const {onFeedCallback} = useKittygotchiFeed();

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const handleFeed = useCallback(() => {
    clearStates();

    setFeedLoading(true);

    feedingToggler.set(true);

    const onSubmit = (hash?: string) => {
      if (hash && chainId && kittyProfile.kittygotchi) {
        setTransactionHash(hash);

        createNotification({
          title: 'Feeding Kittygotchi',
          body: `Feeding Kittygotchi #${kittyProfile.kittygotchi.id}`,
          timestamp: Date.now(),
          url: getTransactionScannerUrl(chainId, hash),
          urlCaption: 'View transaction',
          type: NotificationType.TRANSACTION,
          metadata: {
            chainId: chainId,
            transactionHash: hash,
            status: 'pending',
          } as TxNotificationMetadata,
        });
      }
    };

    const onConfirmation = (hash?: string) => {
      if (kittyProfile.kittygotchi) {
        kittygotchiUpdated.get(kittyProfile.kittygotchi.id);
      }

      setFeedLoading(false);
      setFeedingDone(true);
    };

    const onError = (error?: any) => {
      if (error.data) {
        setErrorMessage(error.data.message);
        setFeedErrorMessage(error.data.message);
      } else {
        setErrorMessage(error.message);
        setFeedErrorMessage(error.message);
      }
      setFeedLoading(false);
    };

    if (kittyProfile.kittygotchi) {
      onFeedCallback(kittyProfile.kittygotchi.id, {
        onConfirmation,
        onError,
        onSubmit,
      });
    }
  }, [onFeedCallback, kittyProfile.kittygotchi, createNotification, chainId]);

  const handleClickEdit = useCallback(() => {
    if (kittyProfile.kittygotchi) {
      history.push(`/kittygotchi/${kittyProfile.kittygotchi?.id}/edit`);
    }
  }, [history, kittyProfile.kittygotchi]);

  const onClickBack = useCallback(() => {
    history.goBack();
  }, []);

  const handleCloseFeedingDialog = useCallback(() => {
    clearStates();
    feedingToggler.toggle();
  }, []);

  return (
    <>
      <FeedingKittygotchiDialog
        done={feedingDone}
        loading={feedLoading}
        transactionHash={transactionHash}
        error={feedErrorMessage}
        onTryAgain={handleFeed}
        dialogProps={{
          open: feedingToggler.show,
          onClose: handleCloseFeedingDialog,
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
                  <IconButton size='small' onClick={onClickBack}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography variant='h5'>Profile</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={4} justifyContent={'center'}>
              <Grid item xs={12} sm={6}>
                <Box
                  mb={2}
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='space-between'>
                  <Typography variant='body1'>My Kittygotchi</Typography>

                  <Button
                    size='small'
                    color='primary'
                    to='/kittygotchi'
                    component={RouterLink}>
                    View more
                  </Button>
                </Box>
                <ProfileKittygotchiCard
                  onMint={handleMint}
                  onFeed={handleFeed}
                  onEdit={handleClickEdit}
                  loading={mintLoading}
                  loadingKyttie={kittygotchiUpdated.isLoading || loadingKyttie}
                  kittygotchi={kittygotchiUpdated.data}
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
