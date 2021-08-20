import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';

interface Props {
  address?: string;
}

export const ClaimGame = (props: Props) => {
  const {address} = props;
  const {account} = useWeb3();

  const {onClaimCallback, winner} = useCoinsLeague(address);
  return (
    <>
      <h1>Claim Game</h1>
      {account && account.toLowerCase() === winner?.address.toLowerCase() ? (
        <>
          {!winner.claimed && <button onClick={onClaimCallback}>Claim</button>}
          <p>Place: {winner.place}</p>
          <p>Score: {winner.score.toString()}</p>
        </>
      ) : (
        <>
          {' '}
          <h3>Not Winner</h3>{' '}
        </>
      )}
    </>
  );
};
