import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  Typography,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';
import {AnyRecordWithTtl} from 'node:dns';

interface Props {
  networkName: EthereumNetwork;
  data: any[] | undefined;
  totalRows: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const MyOrdersTable: React.FC<Props> = ({
  networkName,
  data,
  totalRows,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = useStyles();

  let paginatedRows: any = [];
  const currentRow = currentPage * rowsPerPage;

  for (let i = currentRow; i < currentRow + rowsPerPage; i++) {
    if (data) {
      if (data.length > i) {
        paginatedRows.push(
          <TableItem row={data[i]} networkName={networkName} key={i} />,
        );
      }
    }
  }

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead className={classes.borderBottomClass}>
            <TableHeading />
          </TableHead>

          <TableBody className={classes.borderBottomClass}>
            {/* {data &&
              data.map((row, index) => (
                <TableItem row={row} networkName={networkName} key={index} />
              ))} */}
            {paginatedRows}
          </TableBody>
        </Table>
        {data && data.length === 0 && (
          <Typography
            variant='h5'
            display={'block'}
            align={'center'}
            color={'primary'}>
            You don't have active orders for this token
          </Typography>
        )}
      </Box>

      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={totalRows}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangeRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </>
  );
};

export default MyOrdersTable;
