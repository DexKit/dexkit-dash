import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Fonts } from 'shared/constants/AppEnums';
import { BuySellDataProps } from 'types/models/Crypto';
import { CremaTheme } from 'types/AppContextPropsType';
import { useWeb3 } from 'hooks/useWeb3';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
interface TabFormProps {
  data: BuySellDataProps;
}
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

const TabForm: React.FC<TabFormProps> = ({ data }) => {
  const classes = useStyles();
  const { account } = useWeb3();
  const [inputAddress] = useState(account);
  const [qrCodeText, setQRCodeText] = useState(inputAddress ?? '');

  // generate QR code
  const generateQRCode = useCallback((code: string) => {
    setQRCodeText(code);
  }, []);

  useEffect(useCallback(() => {
    generateQRCode(inputAddress ?? '');
  }, [inputAddress]), [inputAddress]);

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box textAlign="center" mb={5}>
          <QRCode
            id="walletAddressQrCode"
            size={180}
            value={qrCodeText}
          />
          {/* <img width="50%" height="50%" alt="qr code" src='https://www.kaspersky.com.br/content/pt-br/images/repository/isc/2020/9910/a-guide-to-qr-codes-and-how-to-scan-qr-codes-2.png' /> */}
        </Box>
        <Box mb={5}>
          <TextField
            fullWidth
            variant='outlined'
            label={'My Adress'}
            value={inputAddress}
            // onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box textAlign="center" mb={5}>
          <Button
            fullWidth
            style={{ maxWidth: '60%' }}
            variant="contained"
            onClick={() => copy(inputAddress ?? '')}
            color="primary"
          >
            Copy To Clipboard
          </Button>
        </Box>

      </form>


    </Box>
  );
};

export default TabForm;
