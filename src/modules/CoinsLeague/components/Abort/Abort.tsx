import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';

interface Props {
  address?: string;
}

export const AbortGame = (props: Props) => {
  const {address} = props;

  const {onAbortGameCallback, onWithdrawCallback} = useCoinsLeague(address);

  return (
    <div>
      <h1> Abort Game</h1>
      <button onClick={onAbortGameCallback}>Abort</button>
      <button onClick={onWithdrawCallback}>Withdraw</button>
    </div>
  );
};
