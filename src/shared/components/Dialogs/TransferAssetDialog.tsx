import React, {useCallback, useState, useEffect} from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogProps,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Link,
  makeStyles,
  Paper,
  Button,
  Grid,
  DialogTitle,
  useTheme,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import {Skeleton} from '@material-ui/lab';
import IntlMessages from '@crema/utility/IntlMessages';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {useAsset} from 'hooks/useAsset';
import {transferFrom} from 'services/nfts';
import {useWeb3} from 'hooks/useWeb3';
import {getScannerUrl, isAddressEqual} from 'utils/blockchain';
import {useIntl} from 'react-intl';
import {truncateAddress} from 'utils';

import {useRemoveCustomAsset} from 'hooks/tokens';

import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {ErrorIcon, SuccessIcon} from '../Icons';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useNotifications} from 'hooks/useNotifications';

const useStyles = makeStyles(() => ({
  image: {
    width: '100%',
    height: 'auto',
  },
}));

interface Props {
  dialogProps: DialogProps;
  contractAddress?: string;
  tokenId?: string;
  defaultAddress?: string;
  onSelectAddress: () => void;
}

export const TransferAssetDialog: React.FC<Props> = ({
  dialogProps,
  contractAddress,
  tokenId,
  defaultAddress,
  onSelectAddress,
}) => {
  const theme = useTheme();
  const {onClose} = dialogProps;

  const {messages} = useIntl();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();
  const classes = useStyles();

  const {account, chainId, getProvider} = useWeb3();
  const [toAddress, setToAddress] = useState('');

  const {createNotification} = useNotifications();

  const {removeAsset} = useRemoveCustomAsset();

  const {data, isLoading, refetch} = useAsset(contractAddress, tokenId);

  const handleConfirm = useCallback(() => {
    if (contractAddress && account && toAddress && tokenId && chainId) {
      setLoading(true);

      transferFrom(contractAddress, account, toAddress, tokenId, getProvider())
        .then(async (result) => {
          setTransactionHash(result.hash);

          createNotification({
            title: messages['app.wallet.transferringAsset'].toString(),
            body: messages['app.wallet.trasnferingAssetTo'].toString(),
            timestamp: Date.now(),
            url: `${getScannerUrl(chainId)}/tx/`,
            urlCaption: messages['app.wallet.viewTransaction'].toString(),
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: result.hash,
              status: 'pending',
            } as TxNotificationMetadata,
          });

          await result.wait();
          setDone(true);

          removeAsset({contractAddress, tokenId, chainId});
          refetch();

          setLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setLoading(false);
        });
    }
  }, [
    createNotification,
    refetch,
    account,
    contractAddress,
    tokenId,
    toAddress,
    getProvider,
    removeAsset,
    chainId,
    messages,
  ]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setToAddress('');
      setDone(false);
      setTransactionHash(undefined);
    }
  }, [onClose]);

  const handleChangeToAddress = useCallback((e) => {
    setToAddress((e.target.value as string).trim());
  }, []);

  const isAddressValid = useCallback((address: string) => {
    return Web3Wrapper.isAddress(address);
  }, []);

  const isOwner = useCallback((address: string, owner: string) => {
    return isAddressEqual(address, owner);
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  useEffect(() => {
    if (defaultAddress) {
      setToAddress(defaultAddress);
    }
  }, [defaultAddress]);

  function renderLoading() {
    return (
      <Grid
        container
        alignItems='center'
        alignContent='center'
        spacing={4}
        direction='column'>
        <Grid item>
          <CircularProgress size={theme.spacing(32)} color='primary' />
        </Grid>
        <Grid item>
          <Typography align='center' variant='h5'>
            <IntlMessages id='app.wallet.transferringAsset' />
          </Typography>
          <Typography align='center' variant='body1' color='textSecondary'>
            <IntlMessages id='nfts.wallet.transfer.waitingBlockForConfirmation' />
          </Typography>
        </Grid>
        {transactionHash && chainId && (
          <Grid item>
            <Button
              color='primary'
              target='_blank'
              rel='noopener noreferrer'
              href={`${getScannerUrl(chainId)}/tx/${transactionHash}`}>
              <IntlMessages id='app.wallet.viewTransaction' />
            </Button>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderContent() {
    return (
      <Grid container spacing={4} direction='column'>
        <Grid item>
          <Paper variant='outlined'>
            <Box p={4}>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                spacing={4}>
                <Grid item xs={12} sm={3}>
                  {isLoading ? (
                    <Skeleton variant='rect' className={classes.image} />
                  ) : (
                    <img
                      alt='Token Imagem'
                      src={data?.imageUrl}
                      className={classes.image}
                    />
                  )}
                </Grid>
                <Grid
                  direction='column'
                  container
                  xs={12}
                  sm={9}
                  item
                  spacing={2}>
                  <Grid item>
                    <Typography variant='caption'>
                      {isLoading ? <Skeleton /> : data?.collectionName} (
                      {data?.symbol})
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>
                      {isLoading ? <Skeleton /> : data?.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2'>
                      {isLoading ? (
                        <Skeleton />
                      ) : (
                        <>
                          <IntlMessages id='app.settings.ownedBy' />{' '}
                          <Link
                            target='_blank'
                            rel='noopener noreferrer'
                            href={
                              chainId
                                ? `${getScannerUrl(chainId)}/address/${
                                    data?.owner
                                  }`
                                : ''
                            }>
                            {account &&
                            isAddressEqual(account, data?.owner || '')
                              ? messages['app.wallet.you']
                              : truncateAddress(data?.owner)}
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color='textSecondary' variant='body2'>
                      {isLoading ? <Skeleton /> : data?.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            value={toAddress}
            onChange={handleChangeToAddress}
            label=''
            fullWidth
            error={toAddress !== '' && !isAddressValid(toAddress)}
            helperText={
              toAddress !== '' && !isAddressValid(toAddress)
                ? messages['app.wallet.invalidAddress']
                : undefined
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton size='small' onClick={onSelectAddress} edge='end'>
                    <AccountBoxIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {isOwner(toAddress, data?.owner || ' ') ? (
          <Grid item>
            <Alert severity='error'>
              <IntlMessages id='app.wallet.cannotTransferToOwner' />
            </Alert>
          </Grid>
        ) : null}
      </Grid>
    );
  }

  function renderActions() {
    return !loading && !errorMessage && !done ? (
      <>
        <Button
          startIcon={<SendIcon />}
          disabled={
            !isAddressValid(toAddress) ||
            toAddress === '' ||
            isOwner(toAddress, data?.owner || ' ')
          }
          variant='contained'
          color='primary'
          onClick={handleConfirm}>
          <IntlMessages id='app.wallet.transfer' />
        </Button>
        <Button startIcon={<CloseIcon />} onClick={handleClose}>
          <IntlMessages id='app.wallet.cancel' />
        </Button>
      </>
    ) : null;
  }

  const renderError = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <ErrorIcon />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom align='center' variant='h5'>
              <IntlMessages id='app.wallet.oopsAnErrorOccurred' />
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              <IntlMessages id='app.wallet.pleaseTryAgainLater' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              onClick={handleCloseError}
              color='primary'
              fullWidth>
              <IntlMessages id='app.wallet.tryAgain' />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleClose} color='primary' fullWidth>
              <IntlMessages id='app.wallet.close' />
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderDone = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <SuccessIcon />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom align='center' variant='h5'>
              <IntlMessages id='app.wallet.success' />
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              <IntlMessages id='app.wallet.yourAssetWasTransferredSuccessfully' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleClose} color='primary' fullWidth>
              <IntlMessages id='app.wallet.close' />
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box>
            <Typography variant='body1'>
              <IntlMessages id='app.settings.transferAsser' />
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box py={4}>
          {done
            ? renderDone()
            : errorMessage
            ? renderError()
            : loading
            ? renderLoading()
            : renderContent()}
        </Box>
      </DialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default TransferAssetDialog;
