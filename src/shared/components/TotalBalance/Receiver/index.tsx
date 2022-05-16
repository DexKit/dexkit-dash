import React, {useCallback} from 'react';
import ReceiverForm from './ReceiverForm';
import {
  Dialog,
  DialogContent,
  makeStyles,
  useTheme,
  useMediaQuery,
  Chip,
} from '@material-ui/core';
import {ImportWhiteIcon} from 'shared/components/Icons';

import {useChainInfo} from 'hooks/useChainInfo';

import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

const Receiver: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {open, onClose} = props;

  const {formatMessage} = useIntl();

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

  const {chainName} = useChainInfo();
  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      fullScreen={isMobile}>
      <CustomDialogTitle
        icon={<ImportWhiteIcon className={classes.icon} />}
        title={formatMessage({id: 'common.receive', defaultMessage: 'Receive'})}
        chip={<Chip size='small' label={chainName} />}
        onClose={handleClose}
      />
      <DialogContent dividers>
        <ReceiverForm />
      </DialogContent>
    </Dialog>
  );
};

export default Receiver;
