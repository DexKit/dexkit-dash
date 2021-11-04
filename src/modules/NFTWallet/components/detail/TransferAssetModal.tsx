import React, {useCallback, useState} from 'react';

import {
  Dialog,
  Paper,
  DialogContent,
  Grid,
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  Box,
  InputAdornment,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {isAddress} from 'web3-utils';
import {useIntl} from 'react-intl';
import PasteIconButton from 'shared/components/PasteIconButton';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minWeight: '100%',
  },
}));

interface Props {
  open: boolean;
  asset: any;
  onClose: () => void;
  onTransfer: (asset: any, to: string) => void;
}

export default (props: Props) => {
  const {open, asset, onClose, onTransfer} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {messages} = useIntl();
  const [address, setAddress] = useState('');

  const classes = useStyles();

  const handleChangeAddress = useCallback(
    (e) => setAddress(e.target.value),
    [],
  );

  /* eslint-disable */
  const handleTransferNFT = useCallback(
    async (asset) => {
      onTransfer(asset, address);
    },
    [asset, address, onTransfer],
  );

  const handleClose = useCallback(() => {
    setAddress('');
    onClose();
  }, [onClose]);

  const handlePaste = useCallback((text: string) => {
    setAddress(text);
  }, []);

  return (
    <Dialog fullScreen={isMobile} onClose={handleClose} open={open} fullWidth>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant='body1' color='textSecondary'>
              <IntlMessages id='nfts.wallet.transferTransfering' />:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <Paper
                  style={{
                    backgroundColor: asset?.background_color
                      ? `#${asset?.background_color}`
                      : '#fff',
                  }}>
                  <img
                    alt=''
                    src={asset?.image_thumbnail_url}
                    className={classes.img}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant='h5'>{asset?.name}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={address}
              onChange={handleChangeAddress}
              variant='outlined'
              label={messages['nfts.wallet.transfer.walletAddress'].toString()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' variant='standard'>
                    <PasteIconButton onPaste={handlePaste} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {isAddress(address) ? (
            <Grid item xs={12}>
              <Typography variant='body1'>
                "<strong>{asset?.name}</strong>"{' '}
                <IntlMessages id='nfts.wallet.transfer.willBeTransfered' />{' '}
                {address}
              </Typography>
            </Grid>
          ) : null}
          <Grid item>
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    size='large'
                    onClick={handleTransferNFT}
                    color='primary'
                    variant='contained'>
                    <IntlMessages id='nfts.wallet.transferTransfer' />
                  </Button>
                </Grid>
                <Grid item>
                  <Button size='large' onClick={onClose} variant='contained'>
                    <IntlMessages id='nfts.wallet.transferCancel' />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
