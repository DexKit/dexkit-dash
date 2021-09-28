import React, {useCallback, useState} from 'react';
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  Typography,
} from '@material-ui/core';
import Slider from './Slider';
import {makeStyles} from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import {useMobile} from 'hooks/useMobile';

import {useHistory} from 'react-router';

const DESCRIPTIONS = [
  'Welcome to Super App Dexkit, here you can make your transactions and maintenance in the wallet, in addition to several other tools.',
  'Manage your assets and explorer ',
  'lorem ipsum indolor 3',
  'Dexkit others',
];

const useStyles = makeStyles(() => ({
  slide: {
    width: '100%',
    height: 'auto',
  },
  dialogPaper: {
    overflow: 'inherit',
  },
}));

interface WelcomeDialogProps extends DialogProps {}

export const WelcomeDialog = (props: WelcomeDialogProps) => {
  const {onClose} = props;

  const classes = useStyles();

  const [index, setIndex] = useState(0);

  const history = useHistory();

  const handleGoLogin = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    history.push('/onboarding/login-wallet');
  }, [onClose]);

  const handleChangeIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  const handleSelectIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  const handleNext = useCallback(() => {
    setIndex((value) => {
      return value + 1 > 0 && value + 1 <= 3 ? value + 1 : value;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setIndex((value) => {
      return value - 1 >= 0 ? value - 1 : value;
    });
  }, []);

  const isMobile = useMobile();

  return (
    <Dialog
      {...props}
      fullWidth
      maxWidth={'sm'}
      classes={{paper: classes.dialogPaper}}>
      <Slider
        slideCount={4}
        index={index}
        onChangeIndex={handleChangeIndex}
        onSelectIndex={handleSelectIndex}
        onNext={handleNext}
        interval={5000}
        onPrevious={handlePrevious}>
        <Box>
          <img
            src={require('assets/images/slides/welcome/trade-slide.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <img
            src={require('assets/images/slides/welcome/wallet-slide.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <img
            src={require('assets/images/slides/welcome/nft-slide.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <img
            src={require('assets/images/slides/welcome/others-slide.svg')}
            className={classes.slide}
          />
        </Box>
      </Slider>
      <Box p={4}>
        <Grid container alignItems='center' alignContent='center' spacing={4}>
          <Grid item xs={isMobile ? 12 : true}>
            {DESCRIPTIONS[index]}
          </Grid>
          <Grid item xs={isMobile ? 12 : undefined}>
            <Button
              fullWidth={isMobile}
              onClick={handleGoLogin}
              variant='outlined'
              startIcon={<Close />}
              color='primary'>
              Skip
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default WelcomeDialog;
