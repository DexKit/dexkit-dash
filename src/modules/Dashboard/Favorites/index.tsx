import AppCard from '@crema/core/AppCard';
import { Box } from '@material-ui/core';
import { useFavoriteCoinsData } from 'hooks/useFavoriteCoinsData';
import LoadingTable from 'modules/Common/LoadingTable';
import React from 'react';

import {useIntl} from 'react-intl';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import FavoriteCoinsTable from './FavoriteCoinsTable';


const Favorites = () => {
  const {messages} = useIntl();

  const {data, loading} = useFavoriteCoinsData()
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(state => state.ui.favoriteCoins);
  
  return (
    <Box pt={{xl: 4}}>
      <AppCard
        height='1'
        contentStyle={{paddingLeft: 0, paddingRight: 0}}
        title={messages['dashboard.favoriteCoins']}
        action={null}
      >
        {(favoriteCoins.length > 0 && loading) &&  <LoadingTable columns={5} rows={10} /> }
        {!loading && <FavoriteCoinsTable favoriteCoins={favoriteCoins} marketData={data} />} 
     

      </AppCard>
    </Box>

  );
};

export default Favorites;

