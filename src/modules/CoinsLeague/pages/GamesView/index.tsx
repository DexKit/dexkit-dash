import React from 'react';
import {BigNumber} from 'ethers';
import {Game} from 'types/coinsleague';
import {AbortGame} from '../../components/Abort/Abort';
import {ClaimGame} from '../../components/Claim/Claim';
import {EndGame} from '../../components/EndGame/EndGame';
import {JoinGame} from '../../components/JoinGame';
import {PlayerView} from '../../components/PlayerView';
import {StartGame} from '../../components/StartGame/StartGame';

interface Props {
  game: Game;
}

export const GameView = (props: Props) => {
  const {game} = props;

  const nowDate = BigNumber.from(Math.round(new Date().getTime() / 1000));
  const totalPlayers = BigNumber.from(game.players.length);

  return (
    <div className='Game-View-Container'>
      <div className='Game-View-Detail'>
        <h3>Game Details</h3>
        <ul>
          <li>Started: {String(game?.started)}</li>
          <li>Finished: {String(game?.finished)}</li>
          <li>Aborted: {String(game?.aborted)}</li>
          <li>Scores Done: {String(game?.scores_done)}</li>
          <li>Coins: {game?.num_coins}</li>
          <li>Players: {game?.num_players.toString()}</li>
          <li>Duration: {game?.duration.toString()} Seconds</li>
          <li>Amount Play: {game?.amount_to_play} Matic</li>
          <li>Total Collected: {game?.total_amount_collected} Matic</li>
          <li>
            Started AT:{' '}
            {game?.start_timestamp
              ? new Date(
                  game?.start_timestamp.toNumber() * 1000,
                ).toLocaleString()
              : ''}
          </li>
          <li>
            End at:{' '}
            {game?.start_timestamp
              ? new Date(
                  game?.start_timestamp.toNumber() * 1000 +
                    game?.duration.toNumber() * 1000,
                ).toLocaleString()
              : ''}
          </li>
        </ul>
      </div>
      {game && (
        <div>
          {totalPlayers.sub(game.num_players).eq('0') && !game.started && (
            <StartGame address={game.address} />
          )}
          {!totalPlayers.sub(game.num_players).eq('0') && !game.started && (
            <JoinGame address={game.address} />
          )}
          {game.started &&
            !game.finished &&
            nowDate.sub(game.start_timestamp).sub(game.duration).gte('0') && (
              <EndGame
                address={game.address}
                timestamp={game.start_timestamp.add(game.duration)}
              />
            )}
          {game.finished && <ClaimGame address={game.address} />}
          <AbortGame address={game.address} />
          <div>
            {game.players.map((p, ind) => (
              <PlayerView player={p} key={ind} address={game.address} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
