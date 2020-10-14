

import React from 'react';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {PopularCoinsData} from '../../../../../types/models/Crypto';
import { makeStyles, Box, Table, TableHead, TableBody } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

interface PopularCoinsTableProps {
  popularCoins: PopularCoinsData[];
}

const CoinsTable: React.FC<PopularCoinsTableProps> = ({
  popularCoins,
}) => {
  const useStyles = makeStyles(() => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',

      '@media (max-width: 767px)': {
        width: '100%',
        marginBottom: 15,
        overflowY: 'hidden',
        border: `1px solid ${grey[300]}`,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
  }));
  const classes = useStyles();
  return (
    <Box className={classes.tableResponsiveMaterial}>
      <Table>
        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>
        <TableBody>
          {popularCoins.map((row) => (
            <TableItem key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CoinsTable;
