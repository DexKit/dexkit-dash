import {useEffect, useState} from 'react';

import {useCoinLeagueGames, CoinLeagueGamesParams} from './useGames';

interface MyGamesParams extends CoinLeagueGamesParams {
  player?: string;
}

export const useMyGames = (params: MyGamesParams) => {
  const {status, filters, accounts, player} = params;

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [rowsPerPageOptions, _setRowsPerPageOptions] = useState([30, 50, 100]);
  const [skipRows, setSkipRows] = useState(0);

  const onChangePage = (page: number) => {
    const current = Math.max(page, 0);
    setCurrentPage(current);
    setSkipRows(current * rowsPerPage);
  };

  const onChangeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setSkipRows(currentPage * rows);
  };

  const query = useCoinLeagueGames({
    player: player,
    status,
    accounts,
    filters,
    first: rowsPerPage,
    skip: skipRows,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return {
    query,
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  };
};
