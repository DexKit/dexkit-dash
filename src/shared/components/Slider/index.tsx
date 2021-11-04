import {IconButton} from '@material-ui/core';
import React from 'react';

import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SliderPagination from './SliderPagination';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  anchor: {
    padding: theme.spacing(2),
    position: 'absolute',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchorLeft: {
    left: 0,
    top: 0,
    bottom: 0,
  },
  anchorRight: {
    right: 0,
    top: 0,
    bottom: 0,
  },
  anchorBottom: {
    left: 0,
    right: 0,
    bottom: 0,

    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

interface SliderProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSelectIndex: (index: number) => void;
  onChangeIndex: (index: number) => void;
  children?: React.ReactNode | React.ReactNode[];
  slideCount: number;
  index: number;
  interval: number;
}

export const Slider = (props: SliderProps) => {
  const {
    children,
    index,
    interval,
    onSelectIndex,
    onChangeIndex,
    onPrevious,
    onNext,
    slideCount,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={clsx(classes.anchor, classes.anchorLeft)}>
        <IconButton onClick={onPrevious} size='small'>
          <NavigateBeforeIcon />
        </IconButton>
      </div>
      <div className={clsx(classes.anchor, classes.anchorRight)}>
        <IconButton onClick={onNext} size='small'>
          <NavigateNextIcon />
        </IconButton>
      </div>
      <div className={clsx(classes.anchor, classes.anchorBottom)}>
        <SliderPagination
          onSelectIndex={onSelectIndex}
          dots={slideCount}
          index={index}
        />
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
