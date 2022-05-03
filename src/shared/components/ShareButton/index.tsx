import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import React, {useCallback, useState} from 'react';
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

import {Box, makeStyles, Typography} from '@material-ui/core';
import {IconButtonProps} from '@material-ui/core/IconButton';
import {RoundedIconButton} from '../ActionsButtons/RoundedIconButton';
import Share from '@material-ui/icons/Share';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props extends IconButtonProps {
  shareText?: string;
}
const useStyles = makeStyles((theme: CremaTheme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

export const ShareButton = (props: Props) => {
  const {shareText} = props;
  const classes = useStyles();

  const tradeShareText =
    shareText || `Trade and Analyze Your Favourite Tokens at DexKit`;
  const shareUrl = window.location.href;

  const [openShareModal, setOpenShareModal] = useState(false);
  const toggleShareModal = useCallback(() => {
    setOpenShareModal((value) => !value);
  }, []);

  return (
    <>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Box mb={1}>
          <RoundedIconButton onClick={toggleShareModal}>
            <Share className={classes.icon} />
          </RoundedIconButton>
        </Box>
        <Typography variant='caption'>Share</Typography>
      </Box>
      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='paper'
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        aria-labelledby='share-button'>
        <MuiDialogTitle>Share URL</MuiDialogTitle>
        <MuiDialogContent dividers>
          <Box display={'flex'} justifyContent={'center'}>
            <TelegramShareButton
              url={shareUrl}
              title={tradeShareText}
              style={{marginRight: '10px'}}>
              <TelegramIcon size={48} round path={''} crossOrigin={''} />
            </TelegramShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={tradeShareText}
              style={{marginRight: '10px'}}>
              <TwitterIcon size={48} round path={''} crossOrigin={''} />
            </TwitterShareButton>

            <WhatsappShareButton
              url={shareUrl}
              title={tradeShareText}
              style={{marginRight: '10px'}}>
              <WhatsappIcon size={48} round path={''} crossOrigin={''} />
            </WhatsappShareButton>

            <FacebookShareButton
              url={shareUrl}
              title={tradeShareText}
              style={{marginRight: '10px'}}>
              <FacebookIcon size={48} round path={''} crossOrigin={''} />
            </FacebookShareButton>
            <EmailShareButton url={shareUrl} title={tradeShareText}>
              <EmailIcon size={48} round path={''} crossOrigin={''} />
            </EmailShareButton>
          </Box>
        </MuiDialogContent>
      </Dialog>
    </>
  );
};
