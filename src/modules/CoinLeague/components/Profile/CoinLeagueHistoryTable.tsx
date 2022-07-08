import React, {useEffect, useState} from 'react';

import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from '@material-ui/core';

import {useMobile} from 'hooks/useMobile';
import {useGamesFilters} from 'modules/CoinLeague/hooks/useGamesFilter';
import CoinLeagueHistoryTableItem from './CoinLeagueHistoryTableItem';
import {GameGraph} from 'modules/CoinLeague/utils/types';
import {useMyGames} from 'modules/CoinLeague/hooks/useMyGames';
import {CoinLeagueGameStatus} from 'modules/CoinLeague/constants/enums';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

export const CoinLeagueHistoryTable: React.FC = () => {
  const isMobile = useMobile();
  const account = useDefaultAccount();

  const [status, setStatus] = useState<CoinLeagueGameStatus>(
    CoinLeagueGameStatus.All,
  );

  const filtersState = useGamesFilters();

  const {
    query: {data, loading, error},
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useMyGames({
    accounts: account ? [account] : undefined,
    filters: filtersState,
    status,
    player: account,
  });

  useEffect(() => {
    filtersState.setIsMyGames(true);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th'>
              <strong>Game</strong>
            </TableCell>
            <TableCell component='th'>
              <strong>Status</strong>
            </TableCell>
            <TableCell component='th' colSpan={isMobile ? 2 : 1}>
              <strong>Result</strong>
            </TableCell>
            {!isMobile && (
              <>
                <TableCell component='th'>
                  <strong>Reward</strong>
                </TableCell>
                <TableCell component='th'>
                  <strong>Date</strong>
                </TableCell>
                <TableCell component='th'>
                  <strong>Coins</strong>
                </TableCell>
                <TableCell></TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.games.map((game: GameGraph, index: number) => (
            <CoinLeagueHistoryTableItem
              key={index}
              game='Coin League'
              data={game}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoinLeagueHistoryTable;
