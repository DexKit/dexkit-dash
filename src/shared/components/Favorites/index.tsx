import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@material-ui/core';
import { useFavoriteCoinsData } from 'hooks/useFavoriteCoinsData';
import LoadingTable from 'modules/Common/LoadingTable';

import {useIntl} from 'react-intl';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import FavoriteCoinsTable from './FavoriteCoinsTable';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
type Props = {
  type: 'pair' | 'token'
}

const key = 'dexkit.favorite.expanded';

const FavoritesAccordion = (props: Props) => {
  const {messages} = useIntl();

  const {data, loading} = useFavoriteCoinsData()
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(state => state.ui.favoriteCoins);
  const onChangeFavorite = (event: object, expanded: boolean) => {
    const currentState = localStorage.getItem(key) === 'false' ? false : true;
    localStorage.setItem(key, String(!currentState))

  }

  
  return (
    <Accordion defaultExpanded={localStorage.getItem(key) === 'true' ? true : false} onChange={onChangeFavorite}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
      <FavoriteIcon color={'primary'} />{' '}
      <Typography>
      {messages['dashboard.favoriteCoins']}
      </Typography>
    </AccordionSummary>
    <AccordionDetails style={{display: 'block'}}>
      <Box p={2}>
        {(favoriteCoins.length > 0 && loading) &&  <LoadingTable columns={5} rows={10} /> }
        {!loading && <FavoriteCoinsTable favoriteCoins={favoriteCoins} marketData={data} {...props} />} 
      </Box>
    </AccordionDetails>
  </Accordion>
  );
};

export default FavoritesAccordion;

