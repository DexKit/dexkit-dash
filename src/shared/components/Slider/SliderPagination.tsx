import {Box, makeStyles} from '@material-ui/core';
import {useMobile} from 'hooks/useMobile';
import React from 'react';
import SliderPaginationDot from './SliderPaginationDot';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  item: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  },
}));

interface SliderPaginationProps {
  index: number;
  dots: number;
  onSelectIndex(index: number): void;
}

export const SliderPagination = (props: SliderPaginationProps) => {
  const {dots, index, onSelectIndex} = props;

  const classes = useStyles();

  const isMobile = useMobile();

  return (
    <Box
      className={classes.container}
      justifyContent={isMobile ? 'center' : undefined}>
      {new Array(dots).fill(null).map((item, itemIndex) => (
        <div
          onClick={() => {
            onSelectIndex(itemIndex);
          }}
          className={classes.item}>
          <SliderPaginationDot active={itemIndex === index} />
        </div>
      ))}
    </Box>
  );
};

export default SliderPagination;
