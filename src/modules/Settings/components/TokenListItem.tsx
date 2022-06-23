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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import {useTokenBalance} from 'hooks/tokens';
import {ChainId} from 'types/blockchain';

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
  chainId: ChainId;
  tokenSymbol: any;
  imageUrl?: string;
  onRemove: ({
    address,
    chainId,
    symbol,
  }: {
    address: string;
    chainId: ChainId;
    symbol: string;
  }) => void;
}

export const TokenListItem: React.FC<Props> = ({
  tokenSymbol,
  imageUrl,
  account,
  chainId,
  contractAddress,
  onRemove,
}) => {
  const classes = useStyles();

  const {data, isLoading} = useTokenBalance(contractAddress, account);

  return (
    <ListItem>
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
        <IconButton
          size='small'
          onClick={() =>
            onRemove({
              address: contractAddress,
              chainId: chainId,
              symbol: tokenSymbol,
            })
          }>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>

      {/* <ListItemSecondaryAction>
        {!isLoading ? <ChevronRightIcon /> : <Skeleton />}
        </ListItemSecondaryAction>*/}
    </ListItem>
  );
};
