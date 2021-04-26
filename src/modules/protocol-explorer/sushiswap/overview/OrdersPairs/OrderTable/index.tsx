import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TableCell, TableRow} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {grey} from '@material-ui/core/colors';
import { OrderByPairs } from 'types/app';

interface Props {
  data: OrderByPairs[];
}

const OrderTable: React.FC<Props> = ({data}) => {
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
      <Table className='table'>
        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>
        <TableBody className={classes.borderBottomClass}>
          {
            data.length > 0 ? (
              data.map((row, index) => (
                <TableItem row={row} key={index} />
              ))
            ) : (
              <TableRow className={classes.borderBottomClass}>
                <TableCell component='th' scope='row' colSpan={9} className={classes.borderBottomClass}>
                  Loading...
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </Box>
  );
};

export default OrderTable;
