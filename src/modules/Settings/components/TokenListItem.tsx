import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

import {Skeleton} from '@material-ui/lab';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {useTokenBalance} from 'hooks/tokens';

const useStyles = makeStyles((theme) => ({
  img: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  iconSkeleton: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  icon: {
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(8),
    width: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
  },
}));

interface Props {
  contractAddress: string;
  account?: string;
  tokenSymbol: any;
  imageUrl?: string;
}

export const TokenListItem: React.FC<Props> = ({
  tokenSymbol,
  imageUrl,
  account,
  contractAddress,
}) => {
  const classes = useStyles();

  const {data, isLoading} = useTokenBalance(contractAddress, account);

  return (
    <ListItem button>
      <ListItemIcon>
        {!isLoading ? (
          <Box className={classes.icon}>
            {imageUrl ? (
              <img className={classes.img} alt='Token' src={imageUrl} />
            ) : null}
          </Box>
        ) : (
          <Skeleton className={classes.iconSkeleton} variant='circle' />
        )}
      </ListItemIcon>
      <ListItemText
        primary={!isLoading ? `${data || 0} ${tokenSymbol}` : <Skeleton />}
      />
      <ListItemSecondaryAction>
        {!isLoading ? <ChevronRightIcon /> : <Skeleton />}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
