import React from 'react';
import {makeStyles, Button, withStyles} from '@material-ui/core';
import {Token} from 'types/app';

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

interface SelectCoinv2Props {
  onClick: () => void;
  token?: Token;
}

export const SelectCoinv2 = (props: SelectCoinv2Props) => {
  const {onClick, token} = props;
  const classes = useStyles();

  return (
    <StyledButton
      fullWidth
      variant='outlined'
      onClick={onClick}
      startIcon={<img src={token?.logoURI} className={classes.img} />}
      endIcon={<ExpandMoreIcon fontSize='inherit' />}>
      {token?.symbol}
    </StyledButton>
  );
};

export default SelectCoinv2;
