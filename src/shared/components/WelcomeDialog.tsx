import React, {useCallback, useState} from 'react';

import {
  Box,
  Dialog,
  DialogProps,
  CircularProgress,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Slider from './Slider';
import {makeStyles} from '@material-ui/core';

import {useHistory} from 'react-router';
import {useMobile} from 'hooks/useMobile';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';

const useStyles = makeStyles((theme) => ({
  slide: {
    width: '100%',
    height: 'auto',
  },
  dialogPaper: {
    overflow: 'inherit',
    borderRadius: theme.shape.borderRadius,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
    title: 'Coinleague',
    description:
      'Welcome to Coinleague, the on-chain crypto price prediction game. Test your knowledge and skills, play levels from Beginner to Grand master.',
  },
  {
    title: 'Maximum control over your finances',
    description:
      'Use the buttons to swap, buy or bridge Matic to play, all from within this website.',
  },
  {
    title: 'Enjoy game and join community',
    description:
      'Detailed instructions on how to play can be found in the menu on the right, join the Discord for community and help.',
  },
  {
    title: "Play with your NFT's ",
    description: "CoinLeague NFT's with instant in game utility.",
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

    history.push(LOGIN_WALLET_ROUTE);
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
      {onClose && (
        <DialogTitle>
          <IconButton
            aria-label='close'
            className={classes.closeButton}
            onClick={() => onClose({}, 'backdropClick')}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <Slider
        slideCount={4}
        index={index}
        onChangeIndex={handleChangeIndex}
        onSelectIndex={handleSelectIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        description={SLIDES_TEXTS[index].description}
        title={SLIDES_TEXTS[index].title}
        onStart={handleGoLogin}>
        <Box m={1}>
          <LazyImage
            src={require('assets/images/slides/welcome/01_welcome.svg')}
            className={classes.slide}
          />
        </Box>
        <Box m={1}>
          <LazyImage
            src={require('assets/images/slides/welcome/02_on_polygon.svg')}
            className={classes.slide}
          />
        </Box>
        <Box m={1}>
          <LazyImage
            src={require('assets/images/slides/welcome/03_how_to_play.svg')}
            className={classes.slide}
          />
        </Box>
        <Box m={1}>
          <LazyImage
            src={require('assets/images/slides/welcome/04_NFT.svg')}
            className={classes.slide}
          />
        </Box>
      </Slider>
    </Dialog>
  );
};

export default WelcomeDialog;
