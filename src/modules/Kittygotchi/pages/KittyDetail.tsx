import React, {useState, useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';

import {
  makeStyles,
  Box,
  Grid,
  Chip,
  Typography,
  Tooltip,
  Paper,
  useTheme,
  Avatar,
  Button,
  alpha,
  IconButton,
  Breadcrumbs,
  Link,
} from '@material-ui/core';

import {ChainId} from 'types/blockchain';

import {Alert, Skeleton} from '@material-ui/lab';
import {ShareIcon} from 'shared/components/Icons';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';

import {Link as RouterLink, useHistory, useParams} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {RewardDialog} from '../components/dialogs/RewardDialog';
import {useToggler} from 'hooks/useToggler';
import {useKittygotchiFeed, useKittygotchiOnChain} from '../hooks';
import {useMobile} from 'hooks/useMobile';
import FeedKittygotchiButton from '../components/buttons/FeedKittygotchiButton';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useWeb3} from 'hooks/useWeb3';
import {FeedingKittygotchiDialog} from '../components/dialogs/FeedingKittygotchiDialog';
import {Web3State} from 'types/blockchain';
import {
  canFeedKitty,
  isKittygotchiNetworkSupported,
  isKittyTired,
} from '../utils';
import moment from 'moment';
import CountdownSpan from 'shared/components/CountdownSpan';
import CheckIcon from '@material-ui/icons/Check';
import {useProfileKittygotchi} from 'modules/Profile/hooks';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Edit} from '@material-ui/icons';
import TransferAssetDialog from 'shared/components/Dialogs/TransferAssetDialog';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import SelectAddressDialog from 'shared/components/SelectAddressDialog';
import {GET_KITTYGOTCHI_CONTRACT_ADDR} from '../constants';

import {useChainInfo} from 'hooks/useChainInfo';
import {ownerOf} from 'services/nfts';
import {refetchKittygotchiMetadata} from '../services/kittygotchi';
import {leftPad} from 'utils';

const useStyles = makeStyles((theme) => ({
  atkLinearColor: {
    backgroundColor: '#B892FF',
  },
  defLinearColor: {
    backgroundColor: '#7765E3',
  },
  runLinearColor: {
    backgroundColor: '#60A561',
  },
  circularProgress: {},
  avatar: {
    width: theme.spacing(40),
    height: theme.spacing(40),
    border: ' 1px solid #525C75',
    backgroundColor: '#2E3243',
  },
  relative: {
    position: 'relative',
  },
  collectRewardButton: {
    display: 'block',
    width: '100%',
  },
  collectRewardButtonIconSquare: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: alpha(theme.palette.common.white, 0.12),
    borderStyle: 'solid',
  },
  iconOutlinedWrapper: {
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
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  icon: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

interface Params {
  id: string;
}

export const KittyDetail: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const {messages} = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>();
  const params = useParams<Params>();

  const profileKittygotchi = useProfileKittygotchi();

  const {chainId, web3State, account, getProvider} = useWeb3();

  const {getTransactionScannerUrl} = useChainInfo();

  const rewardToggler = useToggler(false);

  const kittygotchi = useKittygotchiOnChain();

  const isMobile = useMobile();

  const history = useHistory();

  const {createNotification} = useNotifications();

  const handleClickEdit = useCallback(() => {
    history.push(`/kittygotchi/${params.id}/edit`);
  }, [history, params]);

  const {onFeedCallback} = useKittygotchiFeed();

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const feedingToggler = useToggler();

  const [feedLoading, setFeedLoading] = useState(false);
  const [feedingDone, setFeedingDone] = useState(false);
  const [feedErrorMessage, setFeedErrorMessage] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();

  const clearState = useCallback(() => {
    setFeedLoading(false);
    setFeedingDone(false);
    setFeedErrorMessage(undefined);
    setTransactionHash(undefined);
  }, []);

  const handleFeed = useCallback(() => {
    clearState();

    setFeedLoading(true);
    feedingToggler.set(true);

    const onSubmit = (hash?: string) => {
      if (hash && chainId) {
        setTransactionHash(hash);

        createNotification({
          title: 'Feeding Kittygotchi',
          body: `Feeding Kittygotchi #${params.id}`,
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

    const onConfirmation = async (hash?: string) => {
      await refetchKittygotchiMetadata(params.id, chainId);

      kittygotchi.get(params.id);

      setFeedLoading(false);
      setFeedingDone(true);
    };

    /* eslint-disable */
    const onError = (error?: any) => {
      if (error.data) {
        setErrorMessage(error.data.message);
        setFeedErrorMessage(error.data.message);
      } else {
        setErrorMessage(error.message);
        setFeedErrorMessage(error.message);
      }

      setFeedLoading(false);
      setFeedingDone(false);
    };

    onFeedCallback(params.id, {
      onConfirmation,
      onError,
      onSubmit,
    });
  }, [onFeedCallback, params.id, createNotification, chainId]);

  /* eslint-disable */
  useEffect(() => {
    if (
      params.id &&
      web3State === Web3State.Done &&
      isKittygotchiNetworkSupported(chainId)
    ) {
      kittygotchi.get(params.id);
    }
  }, [params.id, web3State, chainId]);

  const goToOpenSea = useCallback(() => {
    if (kittygotchi.data) {
      // TODO: use the new opensea link.
      window.open(
        `https://opensea.io/assets/matic/0xea88540adb1664999524d1a698cb84f6c922d2a1/${kittygotchi.data?.id}`,
      );
    }
  }, [kittygotchi.data]);

  const handleCloseFeedingDialog = useCallback(() => {
    setFeedLoading(false);
    setFeedingDone(false);
    setFeedErrorMessage(undefined);
    setTransactionHash(undefined);

    feedingToggler.toggle();
  }, []);

  const defaultAccount = useDefaultAccount();

  /* eslint-disable */
  const [forceUpdate, setForceUpdate] = useState(false);

  const handleMakeDefault = useCallback(() => {
    if (kittygotchi.data && defaultAccount && chainId) {
      profileKittygotchi.setDefaultKittygothchi(
        defaultAccount,
        chainId,
        kittygotchi.data,
      );

      setForceUpdate((value) => !value);
    }
  }, [kittygotchi.data, chainId, defaultAccount]);

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
        if (contractAddress && kittygotchi.data) {
          let owner = await ownerOf(
            contractAddress,
            kittygotchi.data.id,
            getProvider(),
          );

          if (owner !== account) {
            if (profileKittygotchi.isDefault(kittygotchi.data)) {
              profileKittygotchi.unsetDefaultKittygothchi(account, chainId);
            }

            history.push('/kittygotchi');
            clearInterval(interval);
          }
        }
      }
    }, 2000);
  }, [history, account, kittygotchi, chainId, getProvider]);

  const handleCloseTransferDialog = useCallback(() => {
    transferAssetDialogToggler.set(false);
    startOwnerChecker();
  }, [transferAssetDialogToggler]);

  return (
    <>
      <RewardDialog
        dialogProps={{
          open: rewardToggler.show,
          onClose: rewardToggler.toggle,
        }}
      />
      <FeedingKittygotchiDialog
        done={feedingDone}
        onTryAgain={handleFeed}
        loading={feedLoading}
        transactionHash={transactionHash}
        error={feedErrorMessage}
        dialogProps={{
          open: feedingToggler.show,
          onClose: handleCloseFeedingDialog,
        }}
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
        tokenId={kittygotchi.data?.id}
      />
      <Box>
        <Box mb={4}>
          <Grid container spacing={2}>
            {!isMobile && (
              <Grid item xs={12}>
                <Breadcrumbs>
                  <Link color='inherit' component={RouterLink} to='/'>
                    <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                  </Link>
                  <Link
                    color='inherit'
                    component={RouterLink}
                    to='/kittygotchi'>
                    <IntlMessages id='app.kittygotchi.kittygotchi' />
                  </Link>
                </Breadcrumbs>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='centerw'
                  mr={2}>
                  <IconButton
                    size='small'
                    component={RouterLink}
                    to={'/kittygotchi'}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography variant='h5'>
                  {kittygotchi.isLoading ? (
                    <Skeleton width={theme.spacing(24)} />
                  ) : (
                    <>
                      <IntlMessages id='app.kittygotchi.kittygotchi' /> #
                      {kittygotchi.data?.id}
                    </>
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleClearError}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <Paper>
                      <Box p={4}>
                        <Box
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          mb={2}>
                          {kittygotchi.isLoading ? (
                            <Skeleton
                              variant='circle'
                              className={classes.avatar}
                            />
                          ) : (
                            <Avatar
                              className={classes.avatar}
                              src={kittygotchi?.data?.image}
                            />
                          )}
                        </Box>
                        <Grid
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          container
                          spacing={2}>
                          <Grid item>
                            <Tooltip title='Feed'>
                              <FeedKittygotchiButton
                                disabled={!canFeedKitty(kittygotchi?.data)}
                                onClick={handleFeed}
                              />
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip title='Edit'>
                              <RoundedIconButton onClick={handleClickEdit}>
                                <Edit />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip
                              title={
                                messages['app.kittygotchi.transfer'] as string
                              }>
                              <RoundedIconButton onClick={handleOpenTransfer}>
                                <SendIcon />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip
                              title={
                                chainId === ChainId.Binance
                                  ? (messages[
                                      'app.kittygotchi.openSeaIsNotSupported'
                                    ] as string)
                                  : (messages[
                                      'app.kittygotchi.viewOnOpenSea'
                                    ] as string)
                              }>
                              <RoundedIconButton
                                disabled={chainId === ChainId.Binance}
                                onClick={goToOpenSea}>
                                <ShareIcon />
                              </RoundedIconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Paper>
                      <Box p={4}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box mb={isMobile ? 4 : 0}>
                              <Grid
                                container
                                alignItems='center'
                                alignContent='center'
                                justifyContent='space-between'>
                                <Grid item>
                                  <Typography
                                    align={isMobile ? 'center' : 'left'}
                                    variant='h5'>
                                    {kittygotchi.isLoading ? (
                                      <Skeleton width={theme.spacing(12)} />
                                    ) : (
                                      <>
                                        <IntlMessages id='app.kittygotchi.kittygotchi' />{' '}
                                        #{kittygotchi.data?.id}
                                      </>
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  {profileKittygotchi.isDefault(
                                    kittygotchi.data,
                                  ) ? (
                                    kittygotchi.isLoading ? (
                                      <Skeleton width={theme.spacing(10)} />
                                    ) : (
                                      <Chip label='Default' size='small' />
                                    )
                                  ) : (
                                    <>
                                      {kittygotchi.data ? (
                                        <>
                                          {isMobile ? (
                                            <Tooltip title='Make default'>
                                              <IconButton
                                                color='primary'
                                                size='small'
                                                onClick={handleMakeDefault}>
                                                <CheckIcon />
                                              </IconButton>
                                            </Tooltip>
                                          ) : (
                                            <Button
                                              onClick={handleMakeDefault}
                                              size='small'
                                              startIcon={<CheckIcon />}
                                              variant='outlined'
                                              color='primary'>
                                              <IntlMessages id='app.kittygotchi.setDefault' />
                                            </Button>
                                          )}
                                        </>
                                      ) : null}
                                    </>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid
                              container
                              spacing={2}
                              alignItems='center'
                              alignContent='center'>
                              <Grid item>
                                {!kittygotchi.isLoading ? (
                                  <Typography
                                    color='textSecondary'
                                    variant='caption'>
                                    <IntlMessages id='app.kittygotchi.atk' />
                                  </Typography>
                                ) : null}
                                <Typography variant='h5'>
                                  {kittygotchi.isLoading ? (
                                    <Skeleton width={theme.spacing(10)} />
                                  ) : (
                                    leftPad(kittygotchi.data?.attack || 0, 2)
                                  )}
                                </Typography>
                              </Grid>
                              <Grid item>
                                {!kittygotchi.isLoading ? (
                                  <Typography
                                    color='textSecondary'
                                    variant='caption'>
                                    <IntlMessages id='app.kittygotchi.def' />
                                  </Typography>
                                ) : null}
                                <Typography variant='h5'>
                                  {kittygotchi.isLoading ? (
                                    <Skeleton width={theme.spacing(10)} />
                                  ) : (
                                    leftPad(kittygotchi.data?.defense || 0, 2)
                                  )}
                                </Typography>
                              </Grid>
                              <Grid item>
                                {!kittygotchi.isLoading ? (
                                  <Typography
                                    color='textSecondary'
                                    variant='caption'>
                                    <IntlMessages id='app.kittygotchi.run' />
                                  </Typography>
                                ) : null}
                                <Typography variant='h5'>
                                  {kittygotchi.isLoading ? (
                                    <Skeleton width={theme.spacing(10)} />
                                  ) : (
                                    leftPad(kittygotchi.data?.run || 0, 2)
                                  )}
                                </Typography>
                              </Grid>
                              <Grid item>
                                {!kittygotchi.isLoading ? (
                                  <Typography
                                    color='textSecondary'
                                    variant='caption'>
                                    <IntlMessages id='app.kittygotchi.str' />
                                  </Typography>
                                ) : null}
                                <Typography variant='h5'>
                                  {kittygotchi.isLoading ? (
                                    <Skeleton width={theme.spacing(10)} />
                                  ) : (
                                    leftPad(
                                      (kittygotchi.data?.run || 0) +
                                        (kittygotchi.data?.attack || 0) +
                                        (kittygotchi.data?.defense || 0),
                                      2,
                                    )
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            {isKittyTired(kittygotchi?.data) ? (
                              <Typography
                                align={isMobile ? 'center' : 'left'}
                                variant='body1'>
                                <IntlMessages id='app.kittygotchi.kittyHungry' />{' '}
                                <strong>
                                  {moment
                                    .unix(kittygotchi?.data?.lastUpdated || 0)
                                    .fromNow()}
                                </strong>
                              </Typography>
                            ) : null}
                            <Typography variant='body1'>
                              {!canFeedKitty(kittygotchi?.data) ? (
                                kittygotchi?.data?.lastUpdated ? (
                                  <>
                                    <IntlMessages id='app.kittygotchi.canFeed' />{' '}
                                    <strong>
                                      <CountdownSpan
                                        toDate={moment
                                          .unix(kittygotchi?.data?.lastUpdated)
                                          .add(24, 'hours')}
                                      />
                                    </strong>
                                  </>
                                ) : (
                                  <Skeleton />
                                )
                              ) : null}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittyDetail;
