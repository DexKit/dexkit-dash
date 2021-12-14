import React from 'react';
import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

interface Props {
  columns: number;
  rows: number;
}

const LoadingTable: React.FC<Props> = (props) => {
  const {columns, rows} = props;
  const tableBodyRow = [];

  for (let i = 0; i < columns; i++) {
    tableBodyRow.push(
      <TableCell
        style={{paddingTop: 12, paddingBottom: 12}}
        key={`loading-cell-key-${i}`}>
        <Skeleton variant='text' />
      </TableCell>,
    );
  }

  const tableBodyRows = [];

  for (let i = 0; i < rows; i++) {
    tableBodyRows.push(
      <TableRow key={`loading-row-key-${i}`}>{tableBodyRow}</TableRow>,
    );
  }

  return (
    <>
      <Table>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </>
  );
};

export default LoadingTable;
