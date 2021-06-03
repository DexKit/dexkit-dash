import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TablePagination,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {ITransactionList} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';

interface Props {
  networkName: EthereumNetwork;
  data: ITransactionList[] | undefined;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({
  networkName,
  data,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = useStyles();

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
      </Box>

      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={-1}
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
        count={-1}
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
