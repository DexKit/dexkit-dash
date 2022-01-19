import React, {useCallback} from 'react';

import {
  Dialog,
  makeStyles,
  DialogContent,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import SenderForm from './SenderForm';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {ExportWhiteIcon} from 'shared/components/Icons';

import {Token} from 'types/app';
import {CustomDialogTitle} from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

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
}));

const Sender: React.FC<Props> = (props) => {
  const {token: defaultToken, disableClose, onResult, error} = props;

  const classes = useStyles();
  // const networkName = useNetwork();

  // const a11yProps = (index: number) => {
  //   return {
  //     id: `simple-tab-${index}`,
  //     'aria-controls': `simple-tabpanel-${index}`,
  //   };
  // };

  const {onClose} = props;

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose();
      }
    },
    [onClose],
  );

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {messages} = useIntl();

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
        <SenderForm
          balances={props.balances}
          amount={props.amount}
          token={defaultToken}
          address={props.address}
          onResult={onResult}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Sender;
