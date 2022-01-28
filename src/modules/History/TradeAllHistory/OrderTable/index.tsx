import React from 'react';
import {
  Grid,
  Box,
  Table,
  TableHead,
  TableBody,
  Paper,
  TablePagination,
  Typography,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';
import {GetAllTradeHistoryList_ethereum_dexTrades} from 'services/graphql/bitquery/history/__generated__/GetAllTradeHistoryList';
import {WalletEmptyImage} from 'shared/components/Icons';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  networkName: EthereumNetwork;
  data: GetAllTradeHistoryList_ethereum_dexTrades[] | undefined;
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

  if (data && data.length === 0) {
    return (
      <Box py={4}>
        <Paper>
          <Box py={4}>
            <Grid
              container
              spacing={4}
              alignItems='center'
              alignContent='center'
              justifyContent='center'
              direction='column'>
              <Grid item>
                <WalletEmptyImage />
              </Grid>
              <Grid item>
                <Typography variant='h5' align='center'>
                  <IntlMessages id='app.wallet.youDontHaveTradesYet' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Box mb={4}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading />
          </TableHead>

          <TableBody>
            {data?.map((row, index) => (
              <TableItem row={row} networkName={networkName} key={index} />
            ))}
          </TableBody>
        </Table>
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
