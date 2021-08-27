import React from 'react';
import {GetContractOrders_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetContractOrders';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';

interface Props {
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  data: GetContractOrders_ethereum_dexTrades[] | undefined;
  totalRows: number | undefined;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const AMMTradeHistoryTable: React.FC<Props> = ({
  exchange,
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
          <TableHead>
          {!isMobile &&  <TableHeading />}
          </TableHead>
          <TableBody>
            {data &&
              data.map((row, index) => (
                <TableItem
                  row={row}
                  key={index}
                  exchange={exchange}
                  networkName={networkName}
                />
              ))}
          </TableBody>
        </Table>
      </Box>
      {!data?.length && (
        <Typography component='h1' color={'primary'}>
          No data available for this protocol
        </Typography>
      )}
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

export default AMMTradeHistoryTable;
