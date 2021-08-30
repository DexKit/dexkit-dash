import React, {useCallback} from 'react';
import {FavoriteCoin} from 'redux/_ui/reducers';
import {CoinItemCoinGecko} from 'types/coingecko';
import TokenListItem from 'shared/components/TokenListItem';


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
