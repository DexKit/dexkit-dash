import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';

import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import FileCopy from '@material-ui/icons/FileCopyOutlined';
import CheckCircle from '@material-ui/icons/CheckCircleOutlineOutlined';

import {makeStyles} from '@material-ui/core/styles';

import {AppDispatch} from 'redux/store';
import generateWallet from 'utils/generateWallet';
import {addAccounts, setUserEncryptedSeed} from 'redux/_ui/actions';
import {SupportedNetworkType, Network} from 'types/blockchain';

const useStyles = makeStyles(() => ({
  aligned: {width: '100%', textAlign: 'center'},
}));

const GeneratedWallet: React.FC<any> = ({mnemonics, passphrase}) => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [address, setAddress] = useState<string | undefined>();

  const [toClipboard, setToClipboard] = useState(false);
  useEffect(() => {
    generateWallet(mnemonics, passphrase).then((w) => {
      setAddress(w.address);
      addAccounts({accounts: [
        {
          address: w.address,
          label: w.address,
          networkType: SupportedNetworkType.evm
        },
      ], type: SupportedNetworkType.evm} );
      dispatch(setUserEncryptedSeed(w.encryptedSeed));
    });
  }, []);

  return (
    <Container maxWidth='sm'>
      <Box className={classes.aligned} style={{margin: 15}}>
        <Typography>This is your generated crypto wallet!</Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Box className={classes.aligned} style={{margin: 15}}>
        <OutlinedInput
          value={address}
          fullWidth
          title='Copy the wallet address to your clipboard'
          onClick={() => setToClipboard(true)}
          endAdornment={
            <InputAdornment position='end'>
              <Fade in>
                <IconButton
                  onClick={() =>
                    address ? navigator.clipboard.writeText(address) : null
                  }>
                  {toClipboard ? <CheckCircle /> : <FileCopy />}
                </IconButton>
              </Fade>
            </InputAdornment>
          }
        />
      </Box>
      {/*   <Box>
        <FormControlLabel
          control={
            <Switch
              checked={lockSeed}
              onChange={() => setLockSeed((prev) => !prev)}
              color='primary'
            />
          }
          label='Lock wallet'
        />
        </Box>*/}
    </Container>
  );
};

export default GeneratedWallet;
