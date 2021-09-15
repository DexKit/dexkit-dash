import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dot: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: '50%',
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  activeDot: {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface SliderPaginationDotProps {
  active?: boolean;
}

export const SliderPaginationDot = (props: SliderPaginationDotProps) => {
  const {active} = props;

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.dot, active ? classes.activeDot : undefined)}
    />
  );
};

export default SliderPaginationDot;
