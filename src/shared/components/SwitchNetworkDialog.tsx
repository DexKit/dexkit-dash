import React, {useCallback} from 'react';
import {
  Typography,
  Box,
  Dialog,
  DialogProps,
  List,
  ListItem,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  ListItemIcon,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {useMobile} from 'hooks/useMobile';
import {NetworkCodes} from 'utils/blockchain';
import CustomDialogTitle from './CustomDialogTitle';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  icon: {
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(8),
    width: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
  },
}));

interface SwitchNetworkDialogProps extends DialogProps {
  selected: number;
  onSelectChain: (chainId: number) => void;
}

export const SwitchNetworkDialog = (props: SwitchNetworkDialogProps) => {
  const {onClose, onSelectChain, selected} = props;

  const theme = useTheme();

  const classes = useStyles();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const isMobile = useMobile();

  const handleEthereum = useCallback(() => {
    onSelectChain(NetworkCodes.Ethereum);
  }, [onSelectChain]);

  const handleBsc = useCallback(() => {
    onSelectChain(NetworkCodes.SmartChain);
  }, [onSelectChain]);

  const handlePolygon = useCallback(() => {
    onSelectChain(NetworkCodes.Matic);
  }, [onSelectChain]);

  // const handleRopsten = useCallback(() => {
  //   onSelectChain(NetworkCodes.Ropsten);
  // }, [onSelectChain]);
  const {messages} = useIntl();
  return (
    <Dialog {...props} fullScreen={isMobile} fullWidth maxWidth='xs'>
      <CustomDialogTitle
        title={messages['app.shared.switchNetwork']}
        icon={<SwapHorizIcon fontSize='inherit' />}
        onClose={handleClose}
      />

      <Divider />
      <List disablePadding>
        <ListItem
          button
          onClick={handleEthereum}
          selected={NetworkCodes.Ethereum === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                alt=''
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/eth_logo.png')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Ethereum' />
        </ListItem>
        <ListItem
          button
          onClick={handleBsc}
          selected={NetworkCodes.SmartChain === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                alt=''
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/chains/binance-coin-bnb-logo.svg')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Binance Smart Chain' />
        </ListItem>
        <ListItem
          button
          onClick={handlePolygon}
          selected={NetworkCodes.Matic === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                alt=''
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/chains/polygon-matic-logo.svg')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Polygon' />
        </ListItem>
        {/* <Divider />
        <ListItem
          button
          onClick={handleRopsten}
          selected={NetworkCodes.Ropsten === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/eth_logo.png')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Ropsten' secondary='Testnet' />
        </ListItem>
        <ListItem
          button
          onClick={handleMumbai}
          selected={NetworkCodes.MaticTestnet === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/chains/polygon-matic-logo.svg')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Polygon' secondary='Mumbai Testnet' />
        </ListItem> */}
      </List>
    </Dialog>
  );
};

export default SwitchNetworkDialog;
