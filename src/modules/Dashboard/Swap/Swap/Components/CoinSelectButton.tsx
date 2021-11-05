import React from 'react';
import {makeStyles, Button, withStyles} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledButton = withStyles((theme) => ({
  root: {
    minHeight: '100%',
    background: 'rgba(255, 255, 255, 0.09)',
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  img: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    filter: 'grayscale(100%)',
  },
}));

interface Props {
  iconImage: string;
  symbol: string;
  onClick: () => void;
}

export const CoinSelectButton = (props: Props) => {
  const {iconImage, symbol, onClick} = props;
  const classes = useStyles();

  return (
    <StyledButton
      fullWidth
      variant='outlined'
      onClick={onClick}
      startIcon={<img alt='' src={iconImage} className={classes.img} />}
      endIcon={<ExpandMoreIcon fontSize='inherit' />}>
      {symbol}
    </StyledButton>
  );
};
