import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

interface Props {
  rowCount: number;
}

const LoadingTable: React.FC<Props> = (props) => {
  const {rowCount} = props;
  let tableBodyRow = [];
  const cellCount = 5;

  for (let i = 0; i < cellCount; i++) {
    tableBodyRow.push(
      <TableCell style={{paddingTop: 12, paddingBottom: 12}}>
        <Skeleton variant='text' />
      </TableCell>,
    );
  }

  let tableBodyRows = [];

  for (let i = 0; i < rowCount; i++) {
    tableBodyRows.push(<TableRow>{tableBodyRow}</TableRow>);
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='15%'>
              <Skeleton variant='text' />
            </TableCell>
            <TableCell width='22%'>
              <Skeleton variant='text' />
            </TableCell>
            <TableCell width='15%'>
              <Skeleton variant='text' />
            </TableCell>
            <TableCell width='20%'>
              <Skeleton variant='text' />
            </TableCell>
            <TableCell>
              <Skeleton variant='text' />
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </>
  );
};

export default LoadingTable;
