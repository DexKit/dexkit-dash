import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';


import {GameView} from '../GamesView';

const GamesList = () => {
  const {games, totalGames} = useCoinsLeagueFactory();

  return (
    <div>
      <p>Total Games: {totalGames}</p>
      {games?.map((g, index) => {
        <div key={index}>
          <h3>Game: {index + 1}</h3>
          <GameView game={g} />
        </div>;
      })}
    </div>
  );
};

export default GamesList;
