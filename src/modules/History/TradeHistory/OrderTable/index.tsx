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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {GetTradeHistoryList_ethereum_dexTrades} from 'services/graphql/bitquery/history/__generated__/GetTradeHistoryList';
import { Empty } from 'shared/components/Empty';

interface Props {
  networkName: EthereumNetwork;
  data: GetTradeHistoryList_ethereum_dexTrades[] | undefined;
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
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead className={classes.borderBottomClass}>
            {!isMobile && <TableHeading />}
          </TableHead>

          <TableBody className={classes.borderBottomClass}>
            {data &&
              data.map((row, index) => (
                <TableItem row={row} networkName={networkName} key={index} />
              ))}
          </TableBody>
        </Table>
        {data && data.length === 0 && (
          <Empty title={'Ops, no trades'} message={'Start trading to have history'}/>
        )}
      </Box>

      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={totalRows || 0}
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
      <TablePagination
        className={classes.paginationMobile}
        component='div'
        count={totalRows || 0}
        page={currentPage}
        rowsPerPage={25}
        rowsPerPageOptions={[]}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default TransactionTable;
