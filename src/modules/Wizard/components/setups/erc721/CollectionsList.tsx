import React, {useCallback} from 'react';

import {List, Box, Grid, Typography} from '@material-ui/core';

import {useCollectionList} from 'modules/Wizard/hooks';
import {Collection} from 'redux/_wizard/reducers';
import CollectionsListItem from './CollectionsListItem';
import {useHistory} from 'react-router';
import {chainIdToSlug} from 'utils/nft';
import IntlMessages from '@crema/utility/IntlMessages';
import {NFTEmptyStateImage} from 'shared/components/Icons';
import {useWeb3} from 'hooks/useWeb3';

export const CollectionsList = () => {
  const {data} = useCollectionList();

  const history = useHistory();

  const {chainId} = useWeb3();

  const handleClick = useCallback(
    (collection: Collection) => {
      if (collection.chainId) {
        history.push(
          `/wizard/collection/${chainIdToSlug(collection.chainId)}/${
            collection.address
          }`,
        );
      }
    },
    [history],
  );

  if (data.length > 0) {
    return (
      <List disablePadding>
        {data
          .filter((c) => c.chainId === chainId)
          .map((collection: any, index: number) => (
            <CollectionsListItem
              collection={collection}
              key={index}
              onClick={handleClick}
            />
          ))}
      </List>
    );
  } else {
    return (
      <Box p={4}>
        <Grid
          container
          spacing={4}
          alignItems='center'
          alignContent='center'
          justifyContent='center'
          direction='column'>
          <Grid item xs={12}>
            <Box
              display='flex'
              justifyContent='center'
              alignContent='center'
              alignItems='center'>
              <NFTEmptyStateImage />
            </Box>
          </Grid>
          <Typography variant='h5'>
            <IntlMessages id='app.wizard.noCollectionsYet' />
          </Typography>
        </Grid>
      </Box>
    );
  }
};

export default CollectionsList;
