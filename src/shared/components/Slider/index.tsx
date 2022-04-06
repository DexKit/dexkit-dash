import {Button, Grid, Typography, Box, useTheme} from '@material-ui/core';
import React from 'react';

import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import SliderPagination from './SliderPagination';
import IntlMessages from '@crema/utility/IntlMessages';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {useMobile} from 'hooks/useMobile';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
  },
  anchor: {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    position: 'absolute',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGardient: {
    background: `linear-gradient(269.32deg, rgba(13, 16, 23, 0) 12.88%, ${theme.palette.background.paper} 50%)`,
  },
  backgroundGradientVertical: {
    background: `linear-gradient(180deg, rgba(13, 16, 23, 0) 0%, ${theme.palette.background.paper} 50%)`,
  },
  anchorLeft: {
    left: 0,
    top: 0,
    bottom: 0,
  },
}));

interface SliderProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onStart?: () => void;
  onSelectIndex: (index: number) => void;
  onChangeIndex: (index: number) => void;
  children?: React.ReactNode | React.ReactNode[];
  slideCount: number;
  index: number;
  interval: number;
  description?: string;
  title?: string;
}

export const Slider = (props: SliderProps) => {
  const {
    children,
    index,
    interval,
    onSelectIndex,
    onChangeIndex,
    onStart,
    onNext,
    slideCount,
    title,
    description,
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMobile();

  return (
    <div className={classes.container}>
      <div
        className={clsx(
          classes.anchor,
          classes.anchorLeft,
          !isMobile
            ? classes.backgroundGardient
            : classes.backgroundGradientVertical,
        )}>
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                align={isMobile ? 'center' : undefined}
                gutterBottom
                variant={isMobile ? 'h6' : 'h5'}>
                {title}
              </Typography>
              <Box minHeight={theme.spacing(15)}>
                <Typography
                  align={isMobile ? 'center' : undefined}
                  variant={isMobile ? 'body2' : 'body1'}
                  color='textSecondary'>
                  {description}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <SliderPagination
                onSelectIndex={onSelectIndex}
                dots={slideCount}
                index={index}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth={isMobile}
                size={isMobile ? 'small' : 'medium'}
                startIcon={<ArrowForwardIcon />}
                color='primary'
                onClick={index === slideCount - 1 ? onStart : onNext}
                variant='contained'>
                {index === slideCount - 1 ? (
                  <IntlMessages id='common.start' defaultMessage='Start' />
                ) : (
                  <IntlMessages
                    id='common.continue'
                    defaultMessage='Continue'
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
      <AutoPlaySwipeableViews
        interval={interval}
        index={index}
        onChangeIndex={onChangeIndex}>
        {children}
      </AutoPlaySwipeableViews>
    </div>
  );
};

export default Slider;
