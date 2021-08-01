import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';

import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FileCopy from '@material-ui/icons/FileCopyOutlined';
import CheckCircle from '@material-ui/icons/CheckCircleOutlineOutlined';

import {makeStyles} from '@material-ui/core/styles';

import {AppDispatch} from 'redux/store';
import {setBTCAccount} from 'redux/actions';
import generateWallet from 'utils/generateWallet';

const useStyles = makeStyles(() => ({
  aligned: {width: '100%', textAlign: 'center'},
}));

const GeneratedWallet: React.FC<any> = ({mnemonics, passphrase}) => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const wallet = generateWallet(mnemonics, passphrase);

  const [lockSeed, setLockSeed] = useState(false);
  const [toClipboard, setToClipboard] = useState(false);

  useEffect(() => {
    // Stores the encrypted seed into the Redux
    dispatch(setBTCAccount(lockSeed ? undefined : wallet));
    // eslint-disable-next-line
  }, [lockSeed]);

  return (
    <Container maxWidth='sm'>
      <Box className={classes.aligned} style={{margin: 15}}>
        <Typography>This is your generated crypto wallet!</Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Box className={classes.aligned} style={{margin: 15}}>
        <OutlinedInput
          value={wallet}
          fullWidth
          title='Copy the wallet address to your clipboard'
          onClick={() => setToClipboard(true)}
          endAdornment={
            <InputAdornment position='end'>
              <Fade in>
                <IconButton
                  onClick={() => navigator.clipboard.writeText(wallet)}>
                  {toClipboard ? <CheckCircle /> : <FileCopy />}
                </IconButton>
              </Fade>
            </InputAdornment>
          }
        />
      </Box>
      <Box>
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
      </Box>
    </Container>
  );
};

export default GeneratedWallet;
