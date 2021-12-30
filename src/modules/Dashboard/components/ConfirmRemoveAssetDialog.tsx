import React, {useCallback} from 'react';

import {useDefaultAccount} from 'hooks/useDefaultAccount';

import {getScannerUrl, isAddressEqual} from 'utils/blockchain';

import Close from '@material-ui/icons/Close';

import {truncateAddress} from 'utils';

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogProps,
  Divider,
  DialogTitle,
  makeStyles,
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  Link,
  Paper,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {useAsset} from 'hooks/useAsset';
import {useWeb3} from 'hooks/useWeb3';

import {Skeleton} from '@material-ui/lab';
import {useIntl} from 'react-intl';
import DoneIcon from '@material-ui/icons/Done';
import {useMobile} from 'hooks/useMobile';

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
  onConfirm: () => void;
}

export const ConfirmRemoveAssetDialog: React.FC<Props> = ({
  dialogProps,
  contractAddress,
  tokenId,
  onConfirm,
}) => {
  const {onClose} = dialogProps;

  const {messages} = useIntl();

  const classes = useStyles();

  const {chainId} = useWeb3();

  const account = useDefaultAccount();

  const {data, isLoading, error} = useAsset(contractAddress, tokenId);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const isMobile = useMobile();

  const renderDetails = () => {
    return (
      <Grid direction='column' container spacing={4}>
        <Grid item>
          <Paper variant='outlined'>
            <Box p={4}>
              {error ? (
                <Grid
                  container
                  alignItems='center'
                  alignContent='center'
                  spacing={4}>
                  {contractAddress && chainId ? (
                    <Grid item xs={12}>
                      <Typography variant='body2'>
                        Contract:{' '}
                        <Link
                          href={`${getScannerUrl(
                            chainId,
                          )}/address/${contractAddress}`}
                          target='_blank'
                          rel='noopener noreferrer'>
                          {isMobile
                            ? truncateAddress(contractAddress)
                            : contractAddress}
                        </Link>
                      </Typography>
                    </Grid>
                  ) : null}
                  {tokenId ? (
                    <Grid item xs={12}>
                      <Typography variant='body1'>
                        <IntlMessages id='app.wallet.token' />: #{tokenId}
                      </Typography>
                    </Grid>
                  ) : null}
                </Grid>
              ) : (
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
                  <Grid container xs={12} sm={9} item spacing={2}>
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
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Typography variant='body1'>
            <IntlMessages id='app.wallet.areYouSureThisTokenWillBeRemovedFormTheList' />
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
              <IntlMessages id='app.wallet.confirmRemove' />
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box py={4}>{renderDetails()}</Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DoneIcon />}
          onClick={onConfirm}
          variant='contained'
          color='primary'>
          <IntlMessages id='app.wallet.confirm' />
        </Button>
        <Button startIcon={<Close />} onClick={handleClose}>
          <IntlMessages id='app.wallet.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRemoveAssetDialog;
