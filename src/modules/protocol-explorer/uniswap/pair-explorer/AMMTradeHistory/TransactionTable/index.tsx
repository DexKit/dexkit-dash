import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { Box, makeStyles, TablePagination } from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import { grey } from '@material-ui/core/colors';
import { OrderData } from 'types/app';
import Loader from '@crema/core/Loader';

interface Props {
  transactionData: OrderData[];
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;

}

const TransactionTable: React.FC<Props> = ({ transactionData, isLoading, total, page, perPage, onChangePage, onChangePerPage }) => {
  const useStyles = makeStyles(() => ({
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
          {transactionData.length &&
            transactionData.map((data) => (
              <TableItem data={data} key={data.hash} />
            ))}

          {isLoading && <Loader />}
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

export default TransactionTable;
