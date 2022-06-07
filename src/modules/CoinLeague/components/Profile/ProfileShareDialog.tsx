import React, {useState, useCallback, useMemo, useRef} from 'react';

import {
  Dialog,
  DialogContent,
  DialogProps,
  TextField,
  Grid,
  Typography,
  Button,
  makeStyles,
  Divider,
} from '@material-ui/core';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import ShareIcon from '@material-ui/icons/Share';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {getWindowUrl} from 'utils/browser';
import {ChainId} from 'types/blockchain';
import {coinLeagueGamesToSlug} from 'modules/CoinLeague/utils/game';
import {chainIdToSlug} from 'utils/nft';
import {CoinLeagueGames} from 'modules/CoinLeague/utils/types';

interface Props {
  dialogProps: DialogProps;
  address?: string;
  network?: ChainId;
  game?: CoinLeagueGames;
}

const useStyles = makeStyles((theme) => ({
  fontBold: {
    fontWeight: 600,
  },
}));

export const ProfileShareDialog: React.FC<Props> = ({
  dialogProps,
  address,
  game,
  network,
}) => {
  const classes = useStyles();
  const {onClose} = dialogProps;

  const inputRef = useRef<HTMLInputElement>();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const {messages} = useIntl();

  const [showCopiedText, setShowCopiedText] = useState(false);

  const profileAddress = useMemo(() => {
    if (game !== undefined && network !== undefined && address) {
      return `${getWindowUrl()}/coin-league/profile/${address}?network=${chainIdToSlug(
        network,
      )}&game=${coinLeagueGamesToSlug(game)}`;
    }
  }, [address, game, network]);

  const handleTooltipOpen = useCallback(() => {
    setShowCopiedText(true);
    setTimeout(() => {
      setShowCopiedText(false);
    }, 3000);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      inputRef.current?.select();

      inputRef.current?.setSelectionRange(0, 99999); /* For mobile devices */

      new Promise((resolve, reject) => {
        document.execCommand('copy') ? resolve() : reject();
      });

      navigator.clipboard.writeText(inputRef.current?.value || '');
    } catch (err) {}

    handleTooltipOpen();
    // eslint-disable-next-line
  }, [handleTooltipOpen, inputRef.current]);

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        icon={<ShareIcon />}
        title={messages['app.coinLeague.shareProfile'] as string}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item>
            <Typography
              className={classes.fontBold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='app.coinLeague.shareProfile' />
            </Typography>
            <Typography gutterBottom variant='body2' color='textSecondary'>
              <IntlMessages id='app.coinLeague.clickBelowToCopyTheProfileLink' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={(ref) => {
                if (ref !== null) {
                  inputRef.current = ref;
                }
              }}
              label={messages['app.coinLeague.profilesUrl'] as string}
              variant='outlined'
              value={profileAddress}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleCopy}
              fullWidth
              disabled={showCopiedText}
              startIcon={<FileCopyIcon />}
              variant='contained'
              color='primary'>
              {showCopiedText ? (
                <IntlMessages id='app.coinLeague.copied' />
              ) : (
                <IntlMessages id='app.coinLeague.copyLink' />
              )}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileShareDialog;
