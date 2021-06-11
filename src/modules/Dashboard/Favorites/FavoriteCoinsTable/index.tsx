import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {makeStyles, Typography, Link} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import { FavoriteCoin } from 'redux/_ui/reducers';
import AppTableContainer from '@crema/core/AppTableContainer';

import {Link as RouterLink} from 'react-router-dom';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { CoinItemCoinGecko } from 'types/coingecko';

const useStyles = makeStyles(() => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
}));

interface FavoriteCoinsTableProps {
  favoriteCoins: FavoriteCoin[];
  marketData?: CoinItemCoinGecko[];
}

const FavoriteCoinsTable: React.FC<FavoriteCoinsTableProps> = ({
  favoriteCoins,
  marketData,
}) => {
  const classes = useStyles();
  const coinsWithMarketData = favoriteCoins.map(f => { 

    const market = marketData && marketData.find(m=> m.id === f.id);
    return {f, market: market }
  });


  return (
    <AppTableContainer>
      <Table>
        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>
        <TableBody>
          {coinsWithMarketData.
              map(row => (
                <TableItem key={row.f.name} row={row.f} marketData={row.market} />
              ))}
        </TableBody>
      </Table>
      {(favoriteCoins && favoriteCoins.length === 0) &&
      <>
          <Typography variant='h5' display={'block'}  align={'center'} color={'primary'}>
                        You don't have favorite coins yet, explore coins on         
          </Typography>
          <Typography variant='h5' display={'block'}  align={'center'} color={'primary'}>
                  
                        <Link
                            to={`/${EthereumNetwork.ethereum}/dashboard/token/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`}
                            component={RouterLink}>
                             Trade page.
                          </Link>              
          </Typography>
          
          
          </>}
    </AppTableContainer>
  );
};

export default FavoriteCoinsTable;
