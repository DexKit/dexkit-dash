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
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';

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

const TradeTable: React.FC<Props> = ({
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

  const paginatedRows: any = [];
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

export default TradeTable;
