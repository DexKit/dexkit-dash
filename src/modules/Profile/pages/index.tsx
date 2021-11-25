import React, {useState, useCallback, useEffect} from 'react';

import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
} from '@material-ui/core';

import {useNotifications} from 'hooks/useNotifications';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {useProfileKittygotchi, useProfilePoints} from '../hooks';

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
import {ChainId, Web3State} from 'types/blockchain';
import {FeedingKittygotchiDialog} from 'modules/Kittygotchi/components/dialogs/FeedingKittygotchiDialog';
import {useToggler} from 'hooks/useToggler';
import ProfilePointsCard from '../components/ProfilePointsCard';

// const useStyles = makeStyles((theme) => ({
//   iconWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignContent: 'center',
//     borderRadius: '50%',
//     height: theme.spacing(8),
//     width: theme.spacing(8),
//     borderWidth: 1,
//     borderStyle: 'solid',
//     borderColor: theme.palette.grey[700],
//   },
//   icon: {
//     height: theme.spacing(4),
//     width: theme.spacing(4),
//   },
// }));

export const ProfileIndex = () => {
  /* eslint-disable */
  const [loadingKyttie, setLoadingKyttie] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  /* eslint-disable */
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

  /* eslint-disable */
  const profilePoints = useProfilePoints();

  /* eslint-disable */
  const kittygotchiItem = useKittygotchiV2();

  const kittygotchiUpdated = useKittygotchiOnChain();

  /* eslint-disable */
  const kittygotchiList = useKittygotchiList();

  const kittygotchiMint = useKittygotchiMint();

  const kittyProfile = useProfileKittygotchi();

  const {createNotification} = useNotifications();

  const {chainId, account, web3State} = useWeb3();

  useEffect(() => {
    if (
      account &&
      web3State === Web3State.Done &&
      (chainId === ChainId.Matic || chainId === ChainId.Mumbai)
    ) {
      let defaultKitty = kittyProfile.getDefault(account, chainId);

      if (defaultKitty) {
        kittygotchiUpdated.get(defaultKitty.id);
      } 
    }
  }, [account, web3State, chainId]);

  const handleMint = useCallback(() => {
    setMintLoading(true);

    kittygotchiMint.onMintCallback({
      onConfirmation: async (hash?: string, tokenId?: number) => {
        setMintLoading(false);

        if (account) {
          setMintLoading(true);

          let kitty = await kittygotchiUpdated.get(tokenId?.toString());

          if (account && chainId && kitty) {
            kittyProfile.setDefaultKittygothchi(account, chainId, kitty);
          }

          setMintLoading(false);
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

  /* eslint-disable */
  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const handleFeed = useCallback(() => {
    clearStates();

    setFeedLoading(true);

    feedingToggler.set(true);

    const onSubmit = (hash?: string) => {
      if (account && chainId) {
        let defaultKitty = kittyProfile.getDefault(account, chainId);

        if (defaultKitty) {
          if (hash) {
            setTransactionHash(hash);

            createNotification({
              title: 'Feeding Kittygotchi',
              body: `Feeding Kittygotchi #${defaultKitty.id}`,
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
        }
      }
    };

    const onConfirmation = (hash?: string) => {
      if (chainId && account) {
        let defaultKitty = kittyProfile.getDefault(account, chainId);

        if (defaultKitty) {
          kittygotchiUpdated.get(defaultKitty.id);
        }

        setFeedLoading(false);
        setFeedingDone(true);
      }
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

    if (account && chainId) {
      let defaultKitty = kittyProfile.getDefault(account, chainId);

      if (defaultKitty) {
        onFeedCallback(defaultKitty.id, {
          onConfirmation,
          onError,
          onSubmit,
        });
      }
    }
  }, [onFeedCallback, createNotification, account, chainId]);

  const handleClickEdit = useCallback(() => {
    if (account && chainId) {
      let defaultKitty = kittyProfile.getDefault(account, chainId);

      if (defaultKitty) {
        history.push(`/kittygotchi/${defaultKitty?.id}/edit`);
      }
    }
  }, [history, chainId, account]);

  const onClickBack = useCallback(() => {
    history.push('/');
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
