import React from 'react';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Skeleton from '@material-ui/lab/Skeleton';

interface Props {
  players?: number;
}

function PlayersTableSkeleton(props: Props): JSX.Element {
  const {players} = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {new Array(players).fill(null).map((key) => (
          <TableRow key={key}>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PlayersTableSkeleton;
