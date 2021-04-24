import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TableCell, TableRow} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {grey} from '@material-ui/core/colors/index';
import { OrderData } from 'types/app';

interface Props {
  data: OrderData[];
  isLoading: boolean;
}

const OrderTable: React.FC<Props> = ({data, isLoading}) => {
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
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {
            !isLoading ? 
            (data.length > 0 ?
              data.map((row, index) => (
                <TableItem row={row} key={index} />
              )) : 
              <TableRow className={classes.borderBottomClass}>
              <TableCell component='th' scope='row' colSpan={10} className={classes.borderBottomClass}>
                  No Trades
              </TableCell>
            </TableRow>)
             : (
              <TableRow className={classes.borderBottomClass}>
                <TableCell component='th' scope='row' colSpan={10} className={classes.borderBottomClass}>
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
