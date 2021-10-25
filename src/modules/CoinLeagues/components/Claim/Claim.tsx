import React from 'react';

import {useIntl} from 'react-intl';

import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';

interface Props {
  address?: string;
}

export const ClaimGame = (props: Props) => {
  const {address} = props;
  const {account} = useWeb3();
  const {messages} = useIntl();

  const {onClaimCallback, winner} = useCoinLeagues(address);
  return (
    <>
      <h1>{messages['app.claimGame']}</h1>
      {account && account.toLowerCase() === winner?.address.toLowerCase() ? (
        <>
          {!winner.claimed && (
            <button onClick={() => onClaimCallback}>
              {messages['app.claim']}
            </button>
          )}
          <p>
            {messages['app.place']}: {winner.place}
          </p>
          <p>
            {messages['app.score']}: {winner.score.toString()}
          </p>
        </>
      ) : (
        <>
          {' '}
          <h3>{messages['app.notWinner']}</h3>
        </>
      )}
    </>
  );
};
