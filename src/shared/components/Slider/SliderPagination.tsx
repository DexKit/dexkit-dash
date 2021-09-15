import {Box, makeStyles} from '@material-ui/core';
import React from 'react';
import SliderPaginationDot from './SliderPaginationDot';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  item: {
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  },
}));

interface SliderPaginationProps {
  index: number;
  dots: number;
}

export const SliderPagination = (props: SliderPaginationProps) => {
  const {dots, index} = props;

  const classes = useStyles();
  return (
    <Box className={classes.container}>
      {new Array(dots).fill(null).map((item, itemIndex) => (
        <div className={classes.item}>
          <SliderPaginationDot active={itemIndex == index} />
        </div>
      ))}
    </Box>
  );
};

export default SliderPagination;
