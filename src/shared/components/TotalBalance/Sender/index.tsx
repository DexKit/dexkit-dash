import React, {useCallback, useState} from 'react';
import clsx from 'clsx';

import IntlMessages from '@crema/utility/IntlMessages';

import {
  Dialog,
  makeStyles,
  DialogContent,
  useMediaQuery,
  useTheme,
  Box,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import SenderForm from './SenderForm';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {ExportWhiteIcon} from 'shared/components/Icons';

import {Token} from 'types/app';
import {CustomDialogTitle} from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import {useChainInfo} from 'hooks/useChainInfo';
import {useWeb3} from 'hooks/useWeb3';

interface Props {
  open: boolean;
  balances: GetMyBalance_ethereum_address_balances[];
  onClose: () => void;
  disableClose?: boolean;
  amount?: number;
  token?: Token;
  address?: string;
  onResult?: (err?: any) => void;
  error?: string;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  muiTabsRoot: {
    position: 'relative',
    marginTop: -8,
    marginLeft: -8,
    marginBottom: 16,
    [theme.breakpoints.up('xl')]: {
      marginLeft: -20,
      marginBottom: 32,
    },
    '& .Mui-selected': {
      fontFamily: Fonts.LIGHT,
    },
  },
  muiTab: {
    fontSize: 16,
    textTransform: 'capitalize',
    padding: 0,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 10,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
      marginLeft: 20,
      marginRight: 20,
    },
  },
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },

  iconLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  iconSmall: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

const Sender: React.FC<Props> = (props) => {
  const {token: defaultToken, disableClose, onResult, error} = props;

  const [transactionHash, setTransactioHash] = useState<string>();

  const classes = useStyles();

  const {chainId} = useWeb3();
  const {onClose} = props;

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose();
      }

      setTransactioHash(undefined);
    },
    [onClose],
  );

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {messages} = useIntl();

  const handleHash = useCallback((hash: string) => {
    setTransactioHash(hash);
  }, []);

  const {getTransactionScannerUrl} = useChainInfo();

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash, getTransactionScannerUrl]);

  return (
    <Dialog
      fullWidth
      fullScreen={isMobile}
      maxWidth='xs'
      open={props.open}
      onClose={props.onClose}
      aria-labelledby='form-dialog-title'>
      <CustomDialogTitle
        title={messages['app.send'] as string}
        icon={<ExportWhiteIcon className={classes.icon} />}
        onClose={disableClose ? undefined : handleClose}
      />

      <DialogContent dividers>
        {transactionHash ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box
                py={4}
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <CheckCircleOutlineIcon
                  style={{color: theme.palette.success.main}}
                  className={clsx(classes.iconLarge)}
                />
              </Box>
              <Box mb={2}>
                <Typography align='center' variant='h5'>
                  <IntlMessages id='app.wizard.transactionCreated' />
                </Typography>
                <Typography align='center' variant='body1'>
                  <IntlMessages id='app.wizard.pleaseViewTheTransaction' />
                </Typography>
              </Box>
              <Button onClick={handleViewTransaction} color='primary' fullWidth>
                <IntlMessages id='app.wizard.viewTransaction' />
              </Button>
            </Grid>
          </Grid>
        ) : (
          <SenderForm
            balances={props.balances}
            amount={props.amount}
            token={defaultToken}
            address={props.address}
            onResult={onResult}
            onHash={handleHash}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Sender;
