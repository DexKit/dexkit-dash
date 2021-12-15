import React, {useCallback} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core';
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

      {coin.protocol ? (
        <ListItemSecondaryAction>
          <Chip label={coin.protocol?.toUpperCase()} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default SelectCoinListItem;
