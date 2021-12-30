import React, {useCallback} from 'react';

import {
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  IconButton,
  Button,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';
import Info from '@material-ui/icons/Info';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

interface Props extends DialogProps {
  textInfo: string;
}

export const AbountDialog = (props: Props) => {
  const {open, onClose, textInfo} = props;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const {messages} = useIntl();

  return (
    <Dialog open={open}>
      <CustomDialogTitle
        title={messages['app.protocolExplorer.receive']}
        icon={<Info />}
        onClose={handleClose}
      />

      <DialogContent>
        <Typography variant='body1'>{textInfo}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
