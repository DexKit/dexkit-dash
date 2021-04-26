import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TableCell, TableRow, TablePagination} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {grey} from '@material-ui/core/colors/index';
import { OrderData } from 'types/app';
import { EXCHANGE } from 'shared/constants/Bitquery';

interface Props {
  data: OrderData[];
  isLoading: boolean;
  type: 'pair'| 'token';
  exchange: EXCHANGE;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const OrderTable: React.FC<Props> = ({data, isLoading, total, page, perPage, onChangePage, onChangePerPage, type, exchange}) => {
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
          <TableHeading type={type} />
        </TableHead>
        <TableBody>
          {(data.length > 1) &&  
              data.map((row, index) => (
                <TableItem row={row} key={index} exchange={exchange} type={type} />
              ))}
           
            {isLoading &&  <TableRow className={classes.borderBottomClass}>
                <TableCell component='th' scope='row' colSpan={10} className={classes.borderBottomClass}>
                  Loading...
                </TableCell>
              </TableRow>}
        
          
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(event: unknown, newPage: number) => onChangePage(newPage)}
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => onChangePerPage(parseInt(event.target.value, 10))}
      />
    </Box>
  );
};

export default OrderTable;
