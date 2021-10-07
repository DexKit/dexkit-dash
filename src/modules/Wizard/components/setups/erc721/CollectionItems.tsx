import React, {useCallback, useState, useEffect} from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
  CardActionArea,
} from '@material-ui/core';

import {useCollectionItems} from 'modules/Wizard/hooks';
import CollectionItemsSkeleton from './CollectionItemsSkeleton';
import {useWeb3} from 'hooks/useWeb3';
import {Web3State} from 'types/blockchain';

const useStyles = makeStyles((theme) => ({
  media: {
    minHeight: theme.spacing(40),
    maxHeight: theme.spacing(40),
  },
}));

interface CollectionItemsProps {
  contractAddress: string;
  update: boolean;
}

export const CollectionItems = (props: CollectionItemsProps) => {
  const {contractAddress, update} = props;
  const {data, error, loading, get} = useCollectionItems();

  const classes = useStyles();

  const {web3State} = useWeb3();

  useEffect(() => {
    if (web3State === Web3State.Done) {
      get(contractAddress);
    }
  }, [get, contractAddress, update, web3State]);

  if (loading) {
    return <CollectionItemsSkeleton />;
  }

  return (
    <Grid container spacing={4}>
      {data?.map((token: any, index: number) => (
        <Grid item xs={12} sm={3} key={index}>
          <Card>
            <CardActionArea>
              <CardMedia image={token.imageUrl} className={classes.media} />
              <CardContent>
                <Typography variant='body1'>{token.name}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
