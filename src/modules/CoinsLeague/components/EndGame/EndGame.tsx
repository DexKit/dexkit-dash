import {BigNumber} from 'ethers';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';

interface Props {
  address?: string;
  timestamp: BigNumber;
}

export const EndGame = (props: Props) => {
  const {address, timestamp} = props;
  const {onEndGameCallback} = useCoinsLeague(address);

  return (
    <section>
      <h1> End Game</h1>
      <button onClick={onEndGameCallback}>End Game</button>
      <p>
        Game will end at {new Date(timestamp.mul(1000).toNumber()).toString()}{' '}
      </p>
    </section>
  );
};
