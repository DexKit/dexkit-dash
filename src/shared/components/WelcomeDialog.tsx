import React, {useCallback, useState, useEffect, useRef} from 'react';

import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogProps,
  CircularProgress,
} from '@material-ui/core';

import Slider from './Slider';
import {makeStyles} from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import {useMobile} from 'hooks/useMobile';

import {useHistory} from 'react-router';

const useStyles = makeStyles(() => ({
  slide: {
    width: '100%',
    height: 'auto',
  },
  dialogPaper: {
    overflow: 'inherit',
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
        style={{display: loading ? 'none' : 'block'}}
        className={className}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};

const DESCRIPTIONS = [
  'Welcome to Coinleague, the on-chain crypto price prediction game. Test your knowledge and skills, play levels from Beginner to Grand master.',
  'Use the buttons to swap, buy or bridge Matic to play, all from within this website.',
  'Detailed instructions on how to play can be found in the menu on the right, join the Discord for community and help. ',
  'CoinLeague NFT\'s with instant in game utility coming soon. Mint your Coinleague NFT to enter the NFT games room. - coming real soon! Like we mean weeks not years like those other NFT projects',
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
        interval={20000}
        onPrevious={handlePrevious}>
        <Box>
          <LazyImage
            src={require('assets/images/slides/welcome/01_welcome.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={require('assets/images/slides/welcome/02_on_polygon.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={require('assets/images/slides/welcome/03_how_to_play.svg')}
            className={classes.slide}
          />
        </Box>
        <Box>
          <LazyImage
            src={require('assets/images/slides/welcome/04_NFT.svg')}
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
              color='primary'>
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default WelcomeDialog;
