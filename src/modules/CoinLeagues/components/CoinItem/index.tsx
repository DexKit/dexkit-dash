import React, {useCallback} from 'react';

import {ReactComponent as CloseCircle} from 'assets/images/icons/close-circle.svg';
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';

type Props = {
  handleDelete: (index: number) => void;
  coin: CoinFeed;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  coinContainer: {
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  coin: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
}));

export const CoinItem = (props: Props) => {
  const {handleDelete, coin, index} = props;
  const classes = useStyles();

  const onClickDelete = useCallback(
    (ev: any) => {
      handleDelete(index);
    },
    [handleDelete, index],
  );

  return (
    <ListItem button>
      <ListItemIcon>
        <Box className={classes.coinContainer}>
          <img src={coin?.logo} className={classes.coin} alt={'Coin'} />
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={`${coin.base.toUpperCase()} / ${coin.quote.toUpperCase()}`}
        secondary={coin.baseName}
      />

      <ListItemSecondaryAction>
        <IconButton onClick={onClickDelete} size='small'>
          <CloseCircle />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
