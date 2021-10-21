import React from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TablePagination} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';

import Loader from '@crema/core/Loader';
import {grey} from '@material-ui/core/colors';
import {GetAffiliateTrades} from 'services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades';

interface Props {
  transactionData: GetAffiliateTrades | undefined;
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({
  transactionData,
  isLoading,
  total,
  page,
  perPage,
  onChangePage,
  onChangePerPage,
}) => {
  const useStyles = makeStyles((theme) => ({
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',
      overflowY: 'hidden',
      '@media (max-width: 767px)': {
        borderTop: `1px solid ${grey[300]}`,
        width: '100%',
        marginBottom: 15,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td':
            {
              whiteSpace: 'nowrap',
            },
        },
      },
    },
    paginationDesktop: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    paginationMobile: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
  }));
  const data = transactionData?.ethereum?.transfers
    ? transactionData?.ethereum?.transfers
    : [];
  const classes = useStyles();

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {data.length > 1 &&
              data.map((item, i) => <TableItem key={i} data={item} />)}
          </TableBody>
        </Table>
        {isLoading && <Loader />}
      </Box>
      <TablePagination
        component='div'
        className={classes.paginationDesktop}
        rowsPerPageOptions={[10, 25, 50]}
        count={total}
        rowsPerPage={perPage}
        page={page}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangePerPage(parseInt(event.target.value, 10))
        }
      />
      <TablePagination
        className={classes.paginationMobile}
        rowsPerPageOptions={[]}
        component='div'
        count={total}
        rowsPerPage={25}
        page={page}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default TransactionTable;
