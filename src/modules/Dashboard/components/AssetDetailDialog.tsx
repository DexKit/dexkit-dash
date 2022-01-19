import React, {useCallback, useState} from 'react';

import {useDefaultAccount} from 'hooks/useDefaultAccount';

import {isAddressEqual} from 'utils/blockchain';

import {useChainInfo} from 'hooks/useChainInfo';

import {truncateAddress} from 'utils';

import Close from '@material-ui/icons/Close';
import {ErrorIcon} from 'shared/components/Icons';
import {OpenSeaIcon} from 'shared/components/Icons';

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
  Chip,
  Tooltip,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import IntlMessages from '@crema/utility/IntlMessages';
import {useMobile} from 'hooks/useMobile';

import {useIntl} from 'react-intl';
import {GET_CHAIN_ID_NAME_V2} from 'shared/constants/Blockchain';
import {useCustomNetworkList} from 'hooks/network';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: 'auto',
  },
  openSeaIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

interface Props {
  dialogProps: DialogProps;
  contractAddress?: string;
  tokenId?: string;
  metadata?: any;
  chainId?: number;
}

export const AssetDetailDialog: React.FC<Props> = ({
  dialogProps,
  contractAddress,
  metadata,
  tokenId,
  chainId: tokenChainId,
}) => {
  const classes = useStyles();

  const {networks} = useCustomNetworkList();

  // eslint-disable-next-line
  const [error, setError] = useState<any>();
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);

  const {messages} = useIntl();
  const {onClose} = dialogProps;

  const {getScannerUrl} = useChainInfo();

  const account = useDefaultAccount();

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
              src={metadata?.imageUrl}
              className={classes.image}
            />
          )}
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'>
            <Grid item>
              <Typography variant='caption'>
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <Link
                      href={
                        tokenChainId && contractAddress
                          ? `${getScannerUrl(
                              tokenChainId,
                            )}/address/${contractAddress}`
                          : ''
                      }
                      target='_blank'
                      rel='noopener noreferrer'>
                      {metadata?.collectionName} ({metadata?.symbol})
                    </Link>
                  </>
                )}
              </Typography>
              <Typography variant='h5'>
                {isLoading ? <Skeleton /> : metadata?.title}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title={<IntlMessages id='app.wallet.viewOnOpenSea' />}>
                <IconButton
                  href='https://opensea.io/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  <OpenSeaIcon className={classes.openSeaIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
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
                    tokenChainId
                      ? `${getScannerUrl(tokenChainId)}/address/${
                          metadata?.owner
                        }`
                      : ''
                  }>
                  {account && isAddressEqual(account, metadata?.owner || '')
                    ? messages['app.wallet.you']
                    : isMobile
                    ? truncateAddress(metadata?.owner)
                    : metadata?.owner}
                </Link>
              </>
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color='textSecondary' variant='body2'>
            {isLoading ? <Skeleton /> : metadata?.description}
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
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'>
            <Box mr={2}>
              <Chip
                label={
                  tokenChainId && GET_CHAIN_ID_NAME_V2(tokenChainId, networks)
                }
              />
            </Box>
            <IconButton size='small' onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
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
