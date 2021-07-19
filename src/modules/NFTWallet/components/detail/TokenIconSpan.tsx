import React from 'react';

import {makeStyles, Tooltip} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  img: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: '50%',
  },
}));

interface Props {
  imageUrl: string;
  symbol: string;
}

export default (props: Props) => {
  const {imageUrl, symbol} = props;

  const classes = useStyles();

  return (
    <span>
      <Tooltip title={symbol}>
        <img src={imageUrl} className={classes.img} />
      </Tooltip>
    </span>
  );
};
