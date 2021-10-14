import {useQuery} from '@apollo/client';
import { useState } from 'react';
import { FilterPlayerGame} from '../constants/enums';
import {
  GET_GAMES_WITH_PLAYER,
  GET_ALL_GAMES_WITH_PLAYER
} from '../services/gql/games';
import {client} from '../services/graphql';
import { GET_STATUS_FROM_FILTER } from '../utils/time';

import {GameGraph} from '../utils/types';

export const useMyGames = (filter?: FilterPlayerGame, accounts?: string[]) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [rowsPerPageOptions, _setRowsPerPageOptions] = useState([30, 50, 100]);
  const [skipRows, setSkipRows] = useState(0);


  const status = GET_STATUS_FROM_FILTER(filter)
  const variables: any = {
    status: 'Started',
  };
  let queryName = GET_ALL_GAMES_WITH_PLAYER;

  if (accounts) {
    variables.accounts = accounts.map(a=> a.toLowerCase());;
    variables.player = accounts[0].toLowerCase();
  }
  if (accounts && status) {
    variables.status = status;
    queryName = GET_GAMES_WITH_PLAYER;
  }



 

  const onChangePage = (page: number) => {
    const current = Math.max(page, 0);
    setCurrentPage(current);
    setSkipRows(current * rowsPerPage);
  };

  const onChangeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setSkipRows(currentPage * rows);
  };

  const query =  useQuery<{games: GameGraph[]}>(queryName, {
    variables,
    client: client,
  });

  return {
    query,
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  }
};

