import React, {useCallback} from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import {
  TelegramShareButton,
  TelegramIcon,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  FacebookIcon,
  FacebookShareButton,
  EmailIcon,
  EmailShareButton,
} from 'react-share';
import ShareIcon from '@material-ui/icons/Share';
import {Box, Tooltip, DialogProps, Typography} from '@material-ui/core';
import IconButton, {IconButtonProps} from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import {Share} from '@material-ui/icons';

interface ShareDialogProps extends DialogProps {
  shareText?: string;
  shareUrl: string;
}

export const ShareDialog = (props: ShareDialogProps) => {
  const {shareText, shareUrl, onClose} = props;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  return (
    <Dialog {...props}>
      <MuiDialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'
              mr={2}>
              <ShareIcon />
            </Box>
            <Typography variant='body1'>Share URL</Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        <Box display={'flex'} justifyContent={'center'}>
          <TelegramShareButton
            url={shareUrl}
            title={shareText}
            style={{marginRight: '10px'}}>
            <TelegramIcon size={48} round path={''} crossOrigin={''} />
          </TelegramShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={shareText}
            style={{marginRight: '10px'}}>
            <TwitterIcon size={48} round path={''} crossOrigin={''} />
          </TwitterShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={shareText}
            style={{marginRight: '10px'}}>
            <WhatsappIcon size={48} round path={''} crossOrigin={''} />
          </WhatsappShareButton>

          <FacebookShareButton
            url={shareUrl}
            title={shareText}
            style={{marginRight: '10px'}}>
            <FacebookIcon size={48} round path={''} crossOrigin={''} />
          </FacebookShareButton>
          <EmailShareButton url={shareUrl} title={shareText}>
            <EmailIcon size={48} round path={''} crossOrigin={''} />
          </EmailShareButton>
        </Box>
      </MuiDialogContent>
    </Dialog>
  );
};

export default ShareDialog;
