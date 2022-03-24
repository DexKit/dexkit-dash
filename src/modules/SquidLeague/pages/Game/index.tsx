
import React from 'react';

import {useParams} from 'react-router';

//import GameLayout from './index.layout';
import GameLayout from './index.layout';

interface Params {
  id: string;
}

export const Game = () => {
  const {id} = useParams<Params>();



  return <><GameLayout id={id} /></>;
};

export default Game;
