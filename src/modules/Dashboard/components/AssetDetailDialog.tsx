import React, {useCallback} from 'react';

import {useDefaultAccount} from 'hooks/useDefaultAccount';

import {getScannerUrl, isAddressEqual} from 'utils/blockchain';

import {truncateAddress} from 'utils';

import Close from '@material-ui/icons/Close';
import {ErrorIcon} from 'shared/components/Icons';

import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  DialogTitle,
  Link,
  makeStyles,
  Grid,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import {useAsset} from 'hooks/useAsset';
import IntlMessages from '@crema/utility/IntlMessages';
import {useMobile} from 'hooks/useMobile';
import {useWeb3} from 'hooks/useWeb3';
import {useIntl} from 'react-intl';

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
}

export const AssetDetailDialog: React.FC<Props> = ({
  dialogProps,
  contractAddress,
  tokenId,
}) => {
  const classes = useStyles();

  const {messages} = useIntl();
  const {onClose} = dialogProps;

  const {chainId} = useWeb3();

  const account = useDefaultAccount();

  const {data, isLoading, error} = useAsset(contractAddress, tokenId);

  const isMobile = useMobile();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const renderError = () => {
    return (
      <Grid
        spacing={4}
        alignItems='center'
        alignContent='center'
        direction='column'>
        <Grid item>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <ErrorIcon />
          </Box>
        </Grid>
        <Grid item>
          <Typography align='center' variant='h5'>
            <IntlMessages id='app.settings.oopsAnErrorOccurred' />
          </Typography>
        </Grid>
        <Grid item>
          <Typography align='center' variant='body1' color='textSecondary'>
            <IntlMessages id='app.settings.errorWhileLoadingNftData' />
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderDetails = () => {
    return (
      <Grid direction='column' container spacing={4}>
        <Grid item>
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
                      ? `${getScannerUrl(chainId)}/address/${data?.owner}`
                      : ''
                  }>
                  {account && isAddressEqual(account, data?.owner || '')
                    ? messages['app.wallet.you']
                    : isMobile
                    ? truncateAddress(data?.owner)
                    : data?.owner}
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
    );
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box>
            <Typography variant='body1'>
              <IntlMessages id='app.settings.assetDetails' />
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box py={4}>{error ? renderError() : renderDetails()}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailDialog;
