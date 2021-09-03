import React from 'react';
import {MumbaiPriceFeeds} from 'modules/CoinsLeague/constants';
import {useState} from 'react';
import {CoinFeed} from 'types/coinsleague';

interface Props {
  address: string;
  gameAddress: string;
}

const getFeedFromAddress = (address?: string) => {
  if (address) {
    return MumbaiPriceFeeds.find(
      (a) => a.address.toLowerCase() === address.toLowerCase(),
    )?.base;
  } else {
    return 'No feed name';
  }
};

export const CoinFeedView = (props: Props) => {
  const [coin, setCoin] = useState<CoinFeed>();
  const {address, gameAddress} = props;

  return (
    <>
      <ul>
        <li>Address: {coin?.address}</li>
        <li>Feed: {getFeedFromAddress(coin?.address)}</li>
        <li>Start Price: {coin?.start_price?.toString()}</li>
        <li>End Price: {coin?.end_price?.toString()}</li>
        <li>Score: {coin?.score?.toString()}</li>
      </ul>
    </>
  );
};
