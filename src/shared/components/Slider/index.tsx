import {Box, IconButton, Paper} from '@material-ui/core';
import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SliderPagination from './SliderPagination';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
  },
  anchor: {
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
  children?: React.ReactNode | React.ReactNode[];
  slideCount: number;
}

export const Slider = (props: SliderProps) => {
  const {children, onPrevious, onNext, slideCount} = props;
  const classes = useStyles();

  const [index, setIndex] = useState(0);

  const handleChangeIndex = useCallback((itemIndex: number) => {
    setIndex(itemIndex);
  }, []);

  return (
    <Paper className={classes.paper}>
      <div className={clsx(classes.anchor, classes.anchorLeft)}>
        <IconButton>
          <NavigateBeforeIcon />
        </IconButton>
      </div>
      <div className={clsx(classes.anchor, classes.anchorRight)}>
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </div>
      <div className={clsx(classes.anchor, classes.anchorBottom)}>
        <SliderPagination dots={slideCount} index={index} />
      </div>
      <AutoPlaySwipeableViews onChangeIndex={handleChangeIndex}>
        {children}
      </AutoPlaySwipeableViews>
    </Paper>
  );
};

export default Slider;
