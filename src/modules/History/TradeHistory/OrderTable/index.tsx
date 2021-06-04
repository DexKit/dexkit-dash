import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  Typography,
  TableRow,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableCell from '@material-ui/core/TableCell';
import TableItem from './TableItem';
import {IOrderList} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';

interface Props {
  networkName: EthereumNetwork;
  data: IOrderList[] | undefined;
  totalRows: number | undefined;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({
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
  console.log(data);
  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead className={classes.borderBottomClass}>
            <TableHeading />
          </TableHead>

          <TableBody className={classes.borderBottomClass}>
            {data &&
              data.map((row, index) => (
                <TableItem row={row} networkName={networkName} key={index} />
              ))}
          </TableBody>
        </Table>
        {(data && data.length === 0) &&
          <Typography variant='h5' display={'block'}  align={'center'} color={'primary'}>
                        You don't have trades yet
          </Typography>}
      </Box>

      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={totalRows || 0}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onChangePage={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangeRowsPerPage(parseInt(event.target.value, 10))
        }
      />
      <TablePagination
        className={classes.paginationMobile}
        component='div'
        count={totalRows || 0}
        page={currentPage}
        rowsPerPage={25}
        rowsPerPageOptions={[]}
        onChangePage={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default TransactionTable;
