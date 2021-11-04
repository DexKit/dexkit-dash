import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';

interface Props {
  address?: string;
}

export const ClaimGame = (props: Props) => {
  const {address} = props;
  const {account} = useWeb3();

  const {onClaimCallback, winner} = useCoinLeagues(address);
  return (
    <>
      <h1>
        <IntlMessages key='app.coinLeagues.claimGame' />
      </h1>
      {account && account.toLowerCase() === winner?.address.toLowerCase() ? (
        <>
          {!winner.claimed && (
            <button onClick={() => onClaimCallback}>
              <IntlMessages key='app.coinLeagues.claim' />
            </button>
          )}
          <p>
            <IntlMessages key='app.coinLeagues.place' />: {winner.place}
          </p>
          <p>
            <IntlMessages key='app.coinLeagues.score' />:{' '}
            {winner.score.toString()}
          </p>
        </>
      ) : (
        <>
          {' '}
          <h3>
            <IntlMessages key='app.coinLeagues.notWinner' />
          </h3>
        </>
      )}
    </>
  );
};
