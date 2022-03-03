import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Hidden,
  TableBody,
  Avatar,
  IconButton,
  Collapse,
  Grid,
} from '@material-ui/core';
import {GameGraph} from '../utils/types';
import NFTLeagueGamesTableRow from './NFTLeagueGamesTableRow';
import {Skeleton} from '@material-ui/lab';

interface Props {
  games?: GameGraph[];
}

export const NFTLeagueGamesTable: React.FC<Props> = ({games}) => {
  const renderRows = useCallback(() => {
    if (games !== undefined) {
      return games?.map((game: GameGraph) => (
        <NFTLeagueGamesTableRow game={game} />
      ));
    }

    return new Array(6).fill(null).map((_, index: number) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <Hidden smDown>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </Hidden>
        <Hidden smUp>
          <TableCell>
            <Skeleton />
          </TableCell>
        </Hidden>
      </TableRow>
    ));
  }, [games]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component='th'>
              <IntlMessages id='nftLeague.id' />
            </TableCell>
            <TableCell component='th'>
              <IntlMessages id='nftLeague.entry' />
            </TableCell>

            <Hidden smDown>
              <TableCell component='th'>
                <IntlMessages id='nftLeague.startsAt' />
              </TableCell>
              <TableCell component='th'>
                <IntlMessages id='nftLeague.endsIn' />
              </TableCell>
            </Hidden>
            <TableCell component='th'>
              <IntlMessages id='nftLeague.players' />
            </TableCell>
            <Hidden smUp>
              <TableCell></TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default NFTLeagueGamesTable;
