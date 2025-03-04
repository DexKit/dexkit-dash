import React, {useCallback, useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {
  Box,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Collapse,
  Typography,
  IconButton,
  Paper,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopy';
import CopyButton from 'shared/components/CopyButton';
import {useHistory} from 'react-router';
import {useNetwork} from 'hooks/useNetwork';
import {Token} from 'types/app';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {useSenderTokens} from 'hooks/useSenderTokens';
import SelectTokenButton from '../Sender/SelectTokenButton';
import SelectTokenDialog from 'shared/components/Dialogs/SelectTokenDialog';
import ShareDialog from 'shared/components/ShareDialog';
import {getWindowUrl} from 'utils/browser';

import ShareIcon from '@material-ui/icons/Share';

interface Props {}

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    color: theme.palette.secondary.main,
    fontSize: 18,
    marginTop: 6,
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
      marginTop: 16,
    },
  },
  textRes: {
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
  inputText: {
    fontFamily: Fonts.MEDIUM,
    width: '100%',
  },
}));

const ReceiverForm: React.FC<Props> = (props) => {
  const classes = useStyles();

  const {account} = useWeb3();

  const networkName = useNetwork();

  const history = useHistory();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputAddress] = useState(account);
  const [amount, setAmount] = useState('0.0');

  const [showSharedDialog, setShowShareDialog] = useState(false);
  const [showSelectTokenDialog, setShowSelectTokenDialog] = useState(false);
  const [token, setToken] = useState<Token>();
  const [shareUrl, setShareURL] = useState('');
  const {tokens} = useSenderTokens();

  const [qrCodeText, setQRCodeText] = useState(inputAddress ?? '');

  // generate QR code
  const generateQRCode = useCallback((code: string) => {
    setQRCodeText(code);
  }, []);

  useEffect(() => {
    let urlParams = new URLSearchParams();

    urlParams.append('network', networkName);
    urlParams.append('amount', amount);

    if (inputAddress) {
      urlParams.append('address', inputAddress);
    }

    if (token) {
      urlParams.append('token', token?.address);
    }

    setShareURL(`${getWindowUrl()}/wallet/send?${urlParams.toString()}`);
  }, [networkName, amount, inputAddress, token]);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((value) => !value);
  }, []);

  const handleAmountChange = useCallback((e) => {
    setAmount(e.target.value);
  }, []);

  const handleShowDialog = useCallback(() => {
    setShowSelectTokenDialog(true);
  }, []);

  const handleSelectTokenDialogClose = useCallback(() => {
    setShowSelectTokenDialog(false);
  }, []);

  const handleSelectToken = useCallback((token: Token) => {
    setToken(token);
    setShowSelectTokenDialog(false);
  }, []);

  const handleShowShare = useCallback(() => {
    setShowShareDialog(true);
  }, []);

  const handleCloseShareDialog = useCallback(() => {
    setShowShareDialog(false);
  }, []);

  useEffect(() => {
    generateQRCode(inputAddress ?? '');
  }, [inputAddress]);

  return (
    <>
      <SelectTokenDialog
        title='Select a token'
        open={showSelectTokenDialog}
        tokens={tokens}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
        showNetwork
      />
      <ShareDialog
        open={showSharedDialog}
        shareUrl={shareUrl}
        shareText='Share'
        onClose={handleCloseShareDialog}
      />
      <Box pb={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box pt={4} pb={6} display='flex' justifyContent='center'>
              <QRCode id='walletAddressQrCode' size={180} value={qrCodeText} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label={'My Address'}
              value={inputAddress}
              InputProps={{
                className: classes.inputText,
                endAdornment: (
                  <InputAdornment position='end'>
                    <CopyButton copyText={inputAddress || ''} tooltip='Copied!'>
                      <FileCopy />
                    </CopyButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Paper variant='outlined'>
              <Box p={4}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Typography variant='body1'>Advanced</Typography>
                  <IconButton size='small' onClick={handleToggleAdvanced}>
                    {showAdvanced ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={showAdvanced}>
                  <Box mt={2}>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <SelectTokenButton
                          onClick={handleShowDialog}
                          token={token}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant='outlined'
                          label='Amount'
                          value={amount}
                          type='number'
                          onChange={handleAmountChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant='contained'
              onClick={handleShowShare}
              color='primary'
              startIcon={<ShareIcon />}
              size='large'>
              Share address
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ReceiverForm;
