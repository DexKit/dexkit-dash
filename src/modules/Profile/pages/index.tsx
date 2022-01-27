import React, {useState, useCallback, useEffect} from 'react';

import {
  Box,
  Grid,
  Divider,
  Typography,
  CardContent,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardHeader,
} from '@material-ui/core';

import AssetDetailDialog from 'modules/Dashboard/components/AssetDetailDialog';

import {useNotifications} from 'hooks/useNotifications';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {useProfileKittygotchi, useProfilePoints} from '../hooks';

import {ProfileKittygotchiCard} from '../components/ProfileKittygotchiCard';

import {useChainInfo} from 'hooks/useChainInfo';

import {refetchKittygotchiMetadata} from 'modules/Kittygotchi/services/kittygotchi';

import {
  useKittygotchiFeed,
  useKittygotchiList,
  useKittygotchiMint,
  useKittygotchiOnChain,
  useKittygotchiV2,
  useKittygotchiRanking,
} from 'modules/Kittygotchi/hooks';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useWeb3} from 'hooks/useWeb3';
import {Web3State} from 'types/blockchain';
import {FeedingKittygotchiDialog} from 'modules/Kittygotchi/components/dialogs/FeedingKittygotchiDialog';
import {useToggler} from 'hooks/useToggler';
import SelectAddressDialog from 'shared/components/SelectAddressDialog';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import TransferAssetDialog from 'shared/components/Dialogs/TransferAssetDialog';

import {GET_KITTYGOTCHI_CONTRACT_ADDR} from 'modules/Kittygotchi/constants';
import {useIntl} from 'react-intl';
import {ownerOf} from 'services/nfts';
import {isKittygotchiNetworkSupported} from 'modules/Kittygotchi/utils';

import KittygotchiRankingList from 'modules/Kittygotchi/components/KittygotchiRankingList';

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

  const {getTransactionScannerUrl, chainName} = useChainInfo();

  const [feedLoading, setFeedLoading] = useState(false);
  const [feedingDone, setFeedingDone] = useState(false);
  const [feedErrorMessage, setFeedErrorMessage] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();

  const {messages} = useIntl();

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

  const {chainId, account, web3State, getProvider} = useWeb3();

  const kittygotchiRanking = useKittygotchiRanking(chainId);

  useEffect(() => {
    if (
      account &&
      web3State === Web3State.Done &&
      chainId &&
      isKittygotchiNetworkSupported(chainId)
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
            title: messages['app.kittygotchi.mintKittygotchi'] as string,
            body: messages['app.kittygotchi.mintingYourKittygotchi'] as string,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: messages['app.kittygotchi.viewTransaction'] as string,
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
        if (error.data) {
          if (error.data.message) {
            setErrorMessage(error.data.message);
          }
        }
        setMintLoading(false);
      },
    });
  }, [chainId, account, messages, kittygotchiMint.onMintCallback]);

  const {onFeedCallback} = useKittygotchiFeed();

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

    const onConfirmation = async (hash?: string) => {
      if (chainId && account) {
        let defaultKitty = kittyProfile.getDefault(account, chainId);

        if (defaultKitty) {
          await refetchKittygotchiMetadata(defaultKitty.id, chainId);

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

  const accounts = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const transferAssetDialogToggler = useToggler();
  const selectAddressDialogToggler = useToggler();
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const handleOpenTransfer = useCallback(() => {
    transferAssetDialogToggler.set(true);
  }, [transferAssetDialogToggler]);

  const handleOpenSelectAddress = useCallback(() => {
    selectAddressDialogToggler.set(true);
  }, [selectAddressDialogToggler]);

  const handleSelectAddress = useCallback(
    (address: string) => {
      setSelectedAddress(address);
      selectAddressDialogToggler.set(false);
    },
    [selectAddressDialogToggler],
  );

  const handleCloseSelectAddress = useCallback(() => {
    selectAddressDialogToggler.set(false);
  }, [selectAddressDialogToggler]);

  const startOwnerChecker = useCallback(() => {
    let interval = setInterval(async () => {
      let contractAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

      if (account && chainId) {
        let kittygotchi = kittyProfile?.getDefault(account, chainId);

        if (contractAddress && kittygotchi) {
          let owner = await ownerOf(
            contractAddress,
            kittygotchi.id,
            getProvider(),
          );

          if (owner !== account) {
            kittyProfile.unsetDefaultKittygothchi(account, chainId);
            kittygotchiUpdated.clear();
            clearInterval(interval);
          }
        }
      }
    }, 2000);
  }, [account, chainId, getProvider, kittygotchiUpdated]);

  const handleCloseTransferDialog = useCallback(() => {
    transferAssetDialogToggler.set(false);
    startOwnerChecker();
  }, [transferAssetDialogToggler]);

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const [selectedToken, setSelectedToken] = useState<{
    contractAddress: string;
    tokenId: string;
    metadata: any;
    chainId: number;
  }>();

  const showDetailToggler = useToggler();

  const handleSelectAsset = useCallback(
    (
      contractAddress: string,
      tokenId: string,
      metadata: any,
      chainId: number,
    ) => {
      setSelectedToken({contractAddress, tokenId, metadata, chainId});
      showDetailToggler.set(true);
    },
    [showDetailToggler],
  );

  const handleCloseDialog = useCallback(() => {
    showDetailToggler.set(false);
    setSelectedToken(undefined);
  }, [showDetailToggler]);

  return (
    <>
      <AssetDetailDialog
        dialogProps={{
          open: showDetailToggler.show,
          onClose: handleCloseDialog,
          maxWidth: 'xs',
          fullWidth: true,
        }}
        contractAddress={selectedToken?.contractAddress}
        tokenId={selectedToken?.tokenId}
        metadata={selectedToken?.metadata}
        chainId={selectedToken?.chainId}
      />
      <SelectAddressDialog
        open={selectAddressDialogToggler.show}
        accounts={accounts.evm}
        onSelectAccount={handleSelectAddress}
        onClose={handleCloseSelectAddress}
      />
      <TransferAssetDialog
        defaultAddress={selectedAddress}
        onSelectAddress={handleOpenSelectAddress}
        dialogProps={{
          open: transferAssetDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseTransferDialog,
        }}
        contractAddress={GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}
        tokenId={
          account && chainId
            ? kittyProfile?.getDefault(account, chainId)?.id
            : undefined
        }
      />
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
                <ProfileKittygotchiCard
                  onMint={handleMint}
                  onFeed={handleFeed}
                  onEdit={handleClickEdit}
                  onTransfer={handleOpenTransfer}
                  loading={mintLoading}
                  loadingKyttie={kittygotchiUpdated.isLoading || loadingKyttie}
                  kittygotchi={kittygotchiUpdated.data}
                  error={errorMessage}
                  onClearError={handleClearError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardHeader
                    title={messages['app.kittygotchi.top5Ranking'] as string}
                  />
                  <Divider />
                  {kittygotchiRanking.error ? (
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <Typography variant='h5'>
                            <IntlMessages id='app.kittygotchi.oopsAnErrorOccurred' />
                          </Typography>
                        </Grid>
                        <Grid item xs={12}></Grid>
                      </Grid>
                    </CardContent>
                  ) : kittygotchiRanking.results.length > 0 ? (
                    <KittygotchiRankingList
                      items={kittygotchiRanking.results}
                      loading={kittygotchiRanking.isLoading}
                      onSelect={handleSelectAsset}
                    />
                  ) : (
                    <CardContent>
                      <Typography varinat='body1'>
                        <IntlMessages id='app.kittygotchi.notEnoughtKitties' />
                      </Typography>
                    </CardContent>
                  )}
                </Card>
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
