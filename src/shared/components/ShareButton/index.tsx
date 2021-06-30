import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import React, { useState } from "react";
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
    EmailShareButton
  } from "react-share";
import ShareIcon from '@material-ui/icons/Share';
import { Box, Tooltip } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
type Props = {
    shareText?: string
}

export const ShareButton = (props: Props) => {
    const {shareText} = props;

    let tradeShareText = shareText || `Trade and Analyze Your Favourite Tokens at DexKit`
    const shareUrl = window.location.href;
    
    const [openShareModal, setOpenShareModal] = useState(false);
    const toggleShareModal = () => {
        setOpenShareModal(!openShareModal);
      }
   

    return (
        <>
        <Box>
            <Tooltip title={'Share URL'}>
                <IconButton aria-label="share-url" color="primary" onClick={()=> toggleShareModal()}>
                 <ShareIcon />
                </IconButton>
            </Tooltip>
        </Box>
        <Dialog
            fullWidth
            maxWidth='sm'
            scroll='paper'
            open={openShareModal}
            onClose={()=> setOpenShareModal(false)}
            aria-labelledby='share-button'>
                 <MuiDialogTitle>
                    Share URL
                </MuiDialogTitle>
                <MuiDialogContent dividers>
                <Box display={'flex'} justifyContent={'center'}>
            <TelegramShareButton
                    url={shareUrl}
                    title={tradeShareText}
                    style={{marginRight: '10px'}}
                >

                        <TelegramIcon size={48} round path={''} crossOrigin={''}/>

                </TelegramShareButton>
    
                <TwitterShareButton
                    url={shareUrl}
                    title={tradeShareText}
                    style={{marginRight: '10px'}}
                  
                >
      
                    <TwitterIcon size={48} round path={''} crossOrigin={''}/>

                </TwitterShareButton>

                <WhatsappShareButton
                    url={shareUrl}
                    title={tradeShareText}
                    style={{marginRight: '10px'}}
                 
                
                >

                    <WhatsappIcon size={48} round path={''} crossOrigin={''}/>

                </WhatsappShareButton>

                <FacebookShareButton
                    url={shareUrl}
                    title={tradeShareText}
                    style={{marginRight: '10px'}}
                 
                >
    
                       <FacebookIcon  size={48} round path={''} crossOrigin={''}/>
       
                </FacebookShareButton>
                <EmailShareButton
                    url={shareUrl}
                    title={tradeShareText}
                    
                >
   
                       <EmailIcon  size={48} round path={''} crossOrigin={''}/>
                </EmailShareButton>
                </Box>
                </MuiDialogContent>
        </Dialog>
        </>


    )


}