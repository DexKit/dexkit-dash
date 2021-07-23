import {
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ChangellyCoin} from 'types/changelly';

export interface Props {
  coin: ChangellyCoin;
  onClick: (coin: ChangellyCoin) => void;
}

const useStyles = makeStyles((theme) => ({
  coinAvatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    filter: 'grayscale(100%)',
  },
}));

export const SelectCoinListItem = (props: Props) => {
  const {coin, onClick} = props;

  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(coin);
  }, [coin, onClick]);

  return (
    <ListItem onClick={handleClick} button>
      <ListItemIcon>
        <Avatar src={coin.image} className={classes.coinAvatar} />
      </ListItemIcon>
      <ListItemText
        primary={coin.ticker?.toUpperCase()}
        secondary={coin.fullName}
      />
    </ListItem>
  );
};

export default SelectCoinListItem;
