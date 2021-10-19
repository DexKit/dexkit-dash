import React, {useRef, useState, useCallback, useEffect} from 'react';

import {
  makeStyles,
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import {FlashOutlinedIcon, ShieldOutlinedIcon} from 'shared/components/Icons';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {RewardDialog} from '../components/dialogs/RewardDialog';
import {MintKittygotchiDialog} from '../components/dialogs/MintKittygotchiDialog';

import GavelIcon from '@material-ui/icons/Gavel';
import SearchIcon from '@material-ui/icons/Search';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import {useToggler} from 'hooks/useToggler';
import {useKittygotchiList, useKittygotchiMint} from '../hooks/index';
import {KittygotchiCard} from '../components/KittygotchiCard';
import {Kittygotchi} from 'types/kittygotchi';
import {ButtonState, SubmitState} from '../components/ButtonState';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {ChainId, Web3State} from 'types/blockchain';
import MintingKittygotchiDialog from '../components/dialogs/MintingKittygotchiDialog';

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

export const KittygotchiIndex = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const {chainId, web3State} = useWeb3();
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const rewardToggler = useToggler(false);
  const mintKittyToggler = useToggler(false);
  const mintSuccessToggler = useToggler(false);

  const emtpyArrayRef = useRef(new Array(8).fill(null));

  const [errorMessage, setErrorMessage] = useState<string>();

  const defaultAccount = useDefaultAccount();

  const kittygotchiList = useKittygotchiList();

  const {onMintCallback} = useKittygotchiMint();

  const [transactionHash, setTransactionHash] = useState<string>();

  const {createNotification} = useNotifications();

  const mintingToggler = useToggler();

  const [mintingLoading, setMintingLoading] = useState(false);
  const [mintingError, setMintingError] = useState<string>();
  const [mintingDone, setMintingDone] = useState(false);
  const [mintingResultTokenId, setMintingResultTokenId] = useState<number>();

  const clearState = useCallback(() => {
    setMintingError(undefined);
    setMintingDone(false);
    setMintingLoading(false);
    mintingToggler.set(false);
  }, []);

  const onMintGotchi = useCallback(() => {
    clearState();
    setSubmitState(SubmitState.WaitingWallet);

    const onSubmitTx = (hash?: string) => {
      setTransactionHash(hash);
      setMintingLoading(true);
      if (chainId && hash) {
        createNotification({
          title: 'Create new Kittygotchi',
          body: `Creating a new Kittygotchi`,
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
      mintKittyToggler.set(false);

      mintingToggler.set(true);

      setSubmitState(SubmitState.Submitted);
    };
    const onConfirmTx = (hash?: string, tokenId?: number) => {
      // Save here the current id minted
      setSubmitState(SubmitState.Confirmed);

      setMintingResultTokenId(tokenId);

      mintKittyToggler.set(false);

      kittygotchiList.get(defaultAccount);

      setMintingLoading(false);
      setMintingDone(true);
    };
    const onError = (error: any) => {
      setSubmitState(SubmitState.Error);
      setErrorMessage(error.message);
      setMintingError(error.message);

      setMintingDone(false);

      mintKittyToggler.set(false);
      setMintingLoading(false);

      setTimeout(() => {
        setSubmitState(SubmitState.None);
      }, 3000);
    };

    onMintCallback({
      onConfirmation: onConfirmTx,
      onError,
      onSubmit: onSubmitTx,
    });
  }, [onMintCallback, createNotification, chainId, defaultAccount]);

  const handleKittygotchiClick = useCallback(
    (kittygotchi: Kittygotchi) => {
      history.push(`/kittygotchi/${kittygotchi.id}/`);
    },
    [history],
  );

  const handleConfirmMint = useCallback(() => {
    onMintGotchi();
  }, [onMintGotchi]);

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  useEffect(() => {
    console.log('entraaaa');
    if (
      defaultAccount &&
      web3State === Web3State.Done &&
      (chainId === ChainId.Matic || ChainId.Mumbai)
    ) {
      kittygotchiList.get(defaultAccount);
    }
  }, [defaultAccount, web3State, chainId]);

  const onClickBack = useCallback(() => {
    history.goBack();
  }, []);

  return (
    <>
      <RewardDialog
        dialogProps={{
          open: rewardToggler.show,
          onClose: rewardToggler.toggle,
        }}
      />
      <MintKittygotchiDialog
        dialogProps={{
          open: mintKittyToggler.show,
          onClose: mintKittyToggler.toggle,
        }}
        loading={
          submitState === SubmitState.WaitingWallet ||
          submitState === SubmitState.Submitted
        }
        onConfirm={handleConfirmMint}
      />
      <MintingKittygotchiDialog
        transactionHash={transactionHash}
        dialogProps={{
          open: mintingToggler.show,
          onClose: mintingToggler.toggle,
        }}
        onTryAgain={onMintGotchi}
        loading={mintingLoading}
        done={mintingDone}
        error={mintingError}
        tokenId={mintingResultTokenId}
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
                <Typography variant='h5'>My Kitties</Typography>
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
                <Paper>
                  <Box display='flex' justifyContent='space-between' p={4}>
                    <Box></Box>
                    <Button
                      startIcon={<GavelIcon />}
                      variant='contained'
                      color='primary'
                      onClick={mintKittyToggler.toggle}>
                      Create Kitty
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {kittygotchiList.isLoading ? (
                  <Grid container spacing={4}>
                    {emtpyArrayRef.current.map((i, index) => (
                      <Grid item xs={12} sm={3} key={index}>
                        <KittygotchiCard loading />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <>
                    {kittygotchiList.data?.length === 0 && (
                      <Box py={4}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Box
                              display='flex'
                              justifyContent='center'
                              alignContent='center'
                              alignItems='center'>
                              <NFTEmptyStateImage />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align='center' variant='h5'>
                              <IntlMessages id='nfts.wallet.noItemsFound' />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                    <Grid container spacing={4}>
                      {kittygotchiList.data?.map((kittygotchi, index) => (
                        <Grid item xs={12} sm={3} key={index}>
                          <KittygotchiCard
                            onClick={handleKittygotchiClick}
                            kittygotchi={kittygotchi}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default KittygotchiIndex;
