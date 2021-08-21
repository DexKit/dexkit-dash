import {
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {Token} from '../../../types/app';

export interface Props {
  token: Token;
  onClick: (token: Token) => void;
}

const useStyles = makeStyles((theme) => ({
  coinAvatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

export const SelectTokenListItem = (props: Props) => {
  const {token, onClick} = props;

  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(token);
  }, [token, onClick]);

  return (
    <ListItem onClick={handleClick} button>
      <ListItemIcon>
        <Avatar src={token.icon} className={classes.coinAvatar} />
      </ListItemIcon>
      <ListItemText primary={token.symbol} secondary={token.name} />
    </ListItem>
  );
};

export default SelectTokenListItem;
