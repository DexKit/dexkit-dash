import React, {useCallback, useState} from 'react';

import {Box, Dialog, DialogProps, CircularProgress} from '@material-ui/core';

import Slider from './Slider';
import {makeStyles} from '@material-ui/core';

import {useHistory} from 'react-router';
import {useMobile} from 'hooks/useMobile';

const useStyles = makeStyles((theme) => ({
  slide: {
    width: '100%',
    height: 'auto',
  },
  dialogPaper: {
    overflow: 'inherit',
    borderRadius: theme.shape.borderRadius,
  },
}));

interface LazyImageProps {
  src: string;
  className: string;
}

const LazyImage = (props: LazyImageProps) => {
  const {src, className} = props;

  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {}, []);

  return (
    <>
      <div
        style={{
          display: loading ? 'flex' : 'none',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          height: '40vh',
        }}
        className={className}>
        <CircularProgress className={className} />
      </div>
      <img
        alt=''
        style={{display: loading ? 'none' : 'block'}}
        className={className}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};

const SLIDES_TEXTS: {title: string; description: string}[] = [
  {
    title: 'Super App Dexkit',
    description:
      'You can manage all your ERC, BEP and POLY assets from any internet connected device.',
  },
  {
    title: 'Maximum control over your finances.',
    description:
      'Buy, trade or exchange cryptocurrencies from the platform and manage them as you prefer.',
  },
  {
    title: 'Enjoy all your NFTs',
    description:
      'As a designer or enthusiast, you will be able to see all your non-fungible tokens in just one place, no matter the Blockchain.',
  },
  {
    title: 'Affiliate program',
    description:
      'Earn passive income by inviting your friends to use the platform.',
  },
];

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
  }, [onClose, history]);

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
      fullScreen={isMobile}
      maxWidth='sm'
      classes={{paper: classes.dialogPaper}}>
      <Slider
        slideCount={4}
        index={index}
        onChangeIndex={handleChangeIndex}
        onSelectIndex={handleSelectIndex}
        onNext={handleNext}
        interval={5000}
        onPrevious={handlePrevious}
        description={SLIDES_TEXTS[index].description}
        title={SLIDES_TEXTS[index].title}
        onStart={handleGoLogin}>
        <Box>
          <LazyImage
            src={
              isMobile
                ? require('assets/images/slides/welcome/slide-1-mobile.png')
                : require('assets/images/slides/welcome/slide-1.png')
            }
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={
              isMobile
                ? require('assets/images/slides/welcome/slide-2-mobile.png')
                : require('assets/images/slides/welcome/slide-2.png')
            }
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={
              isMobile
                ? require('assets/images/slides/welcome/slide-3-mobile.png')
                : require('assets/images/slides/welcome/slide-3.png')
            }
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={
              isMobile
                ? require('assets/images/slides/welcome/slide-4-mobile.png')
                : require('assets/images/slides/welcome/slide-4.png')
            }
            className={classes.slide}
          />
        </Box>
      </Slider>
    </Dialog>
  );
};

export default WelcomeDialog;
