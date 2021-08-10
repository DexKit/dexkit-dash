import React, {useCallback, useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {Box, Button, TextField, Grid} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

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

  const [inputAddress] = useState(account);
  const [qrCodeText, setQRCodeText] = useState(inputAddress ?? '');

  // generate QR code
  const generateQRCode = useCallback((code: string) => {
    setQRCodeText(code);
  }, []);

  useEffect(() => {
    generateQRCode(inputAddress ?? '');
  }, [inputAddress]);

  return (
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
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => copy(inputAddress ?? '')}
            color='primary'
            size='large'>
            Copy To Clipboard
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceiverForm;
