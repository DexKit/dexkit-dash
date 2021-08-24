import React, {useCallback} from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Box, IconButton, makeStyles, Chip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PageviewIcon from '@material-ui/icons/Pageview';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {green, red} from '@material-ui/core/colors';
import {FavoriteCoin} from 'redux/_ui/reducers';
import DeleteIcon from '@material-ui/icons/Delete';
import {CremaTheme} from 'types/AppContextPropsType';
import {removeFavoriteCoin} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {CoinItemCoinGecko} from 'types/coingecko';
import Tooltip from '@material-ui/core/Tooltip';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useHistory} from 'react-router-dom';
import TokenListItem from 'shared/components/TokenListItem';

const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    borderBottom: '0 none',
    fontSize: 13,
    padding: 8,
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
  },
  tableCellColor: {
    color: (props: {value: number}) =>
      props.value > 0 ? green[600] : red[600],
  },
  fontLIGHT: {},
  whitespaceNowrap: {
    whiteSpace: 'nowrap',
  },
  avatar: {
    width: 40,
    height: 40,
    padding: 12,
    backgroundColor: 'transparent',
    [theme.breakpoints.up('xl')]: {
      width: 50,
      height: 50,
    },
  },
}));

interface FavoriteItemProps {
  row: FavoriteCoin;
  marketData?: CoinItemCoinGecko;
  onRemoveCoin?: (coin: FavoriteCoin) => void;
  onClick?: (network: string, address: string) => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  row,
  marketData,
  onRemoveCoin,
  onClick,
}) => {
  const handleRemoveCoin = useCallback(() => {
    if (onRemoveCoin) {
      onRemoveCoin(row);
    }
  }, [row, onRemoveCoin]);

  return (
    <TokenListItem
      dayChange={marketData?.price_change_percentage_24h ?? 0}
      amount={marketData?.current_price || 0}
      name={row.name}
      network={row?.networkName || ''}
      symbol={row.symbol}
      address={row.address}
      onRemove={handleRemoveCoin}
      onClick={onClick}
    />
  );
};

export default FavoriteItem;
