import {
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  makeStyles,
  Chip,
  ListItemSecondaryAction,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_CHAIN_ID_NAME,
} from 'shared/constants/Blockchain';
import {Token} from '../../../types/app';

export interface Props {
  token: Token;
  onClick: (token: Token) => void;
  showNetwork?: boolean;
}

const useStyles = makeStyles((theme) => ({
  coinAvatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
}));

export const SelectTokenListItem = (props: Props) => {
  const {token, onClick, showNetwork} = props;

  const classes = useStyles();

  const handleClick = useCallback(() => {
    onClick(token);
  }, [token, onClick]);

  return (
    <ListItem onClick={handleClick} button>
      <ListItemIcon>
        <img src={token.icon} className={classes.coinAvatar} />
      </ListItemIcon>
      <ListItemText primary={token.symbol} secondary={token.name} />
      {showNetwork ? (
        <ListItemSecondaryAction>
          <Chip
            size='small'
            label={
              token.networkName
                ? GET_CHAIN_ID_NAME(GET_CHAIN_FROM_NETWORK(token.networkName))
                : ''
            }
          />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default SelectTokenListItem;
