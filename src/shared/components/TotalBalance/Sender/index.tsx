import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Box,
  Dialog,
  Tabs,
  Tab,
  Card,
  makeStyles,
  Typography,
  DialogTitle,
  DialogContent,
  Chip,
  IconButton,
} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import SenderForm from './SenderForm';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {useNetwork} from 'hooks/useNetwork';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';
import Tooltip from '@material-ui/core/Tooltip';
import {ExportWhiteIcon} from 'shared/components/Icons';

import CloseIcon from '@material-ui/icons/Close';

interface Props {
  open: boolean;
  balances: GetMyBalance_ethereum_address_balances[];
  onClose: () => void;
  amount?: number;
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
  const classes = useStyles();
  const networkName = useNetwork();

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={props.open}
      onClose={props.onClose}
      aria-labelledby='form-dialog-title'>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <ExportWhiteIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>
              <IntlMessages id='Send' />
            </Typography>
          </Box>
          <Box>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <SenderForm balances={props.balances} amount={props.amount} />
      </DialogContent>
    </Dialog>
  );
};

export default Sender;
