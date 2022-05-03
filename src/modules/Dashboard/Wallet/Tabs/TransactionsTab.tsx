import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  Typography,
  TableCell,
  FormControl,
  Select,
  Paper,
  MenuItem,
  IconButton,
  Grid,
} from '@material-ui/core';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import moment from 'moment';
import TransactionTableRow from 'modules/Dashboard/components/TransactionTableRow';
import React, {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import IntlMessages from '@crema/utility/IntlMessages';
import {WalletEmptyImage} from 'shared/components/Icons';
import {Transaction} from 'redux/_transactions/types';

const INITIAL_PAGE_SIZE = 5;

const PAGE_SIZES = [
  INITIAL_PAGE_SIZE,
  2 * INITIAL_PAGE_SIZE,
  5 * INITIAL_PAGE_SIZE,
  10 * INITIAL_PAGE_SIZE,
];

export interface Props {}

export const TransactionsTab: React.FC<Props> = () => {
  const {transactions} = useSelector<AppState, AppState['transactions']>(
    ({transactions}) => transactions,
  );

  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(e.target.value);
  }, []);

  useEffect(() => {
    setPage(1);
  }, []);

  const paginate = useCallback(
    <T extends unknown>(
      array: T[],
      page_size: number,
      page_number: number,
    ): T[] => {
      return array.slice(
        (page_number - 1) * page_size,
        page_number * page_size,
      );
    },
    [],
  );

  const handleGoNext = useCallback(() => {
    setPage((value) => value + 1);
  }, []);

  const handleGoPrevious = useCallback(() => {
    setPage((value) => value - 1);
  }, []);

  if (transactions !== undefined && transactions?.length > 0) {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell>
                  <IntlMessages id='app.wallet.title' />
                </TableCell>
                <TableCell>
                  <IntlMessages id='app.wallet.transactionHash' />
                </TableCell>
                <TableCell>
                  <IntlMessages id='app.wallet.date' />
                </TableCell>
                <TableCell>
                  <IntlMessages id='app.wallet.status' />
                </TableCell>
                <TableCell>
                  <IntlMessages id='app.wallet.network' />
                </TableCell>
                <TableCell></TableCell>
              </TableHead>
              <TableBody>
                {paginate<Transaction>(transactions, itemsPerPage, page).map(
                  (transaction, index: number) => (
                    <TransactionTableRow
                      title={transaction.title}
                      chainId={transaction.chainId}
                      date={
                        transaction?.timestamp
                          ? moment(transaction?.timestamp).format(
                              'DD/MM/YYYY HH:mm:ss',
                            )
                          : ''
                      }
                      hash={transaction.hash}
                      status={transaction.status}
                      key={index}
                    />
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Grid justify='flex-end' container alignItems='center' spacing={2}>
            <Grid item>
              <FormControl variant='outlined' size='small'>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  variant='outlined'>
                  {PAGE_SIZES.map((pageSize, i) => (
                    <MenuItem value={pageSize} key={`menu-${i}`}>
                      {pageSize}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <IconButton disabled={page === 1} onClick={handleGoPrevious}>
                <KeyboardArrowLeftIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                disabled={
                  page >= 1 &&
                  paginate(transactions, itemsPerPage, page).length <
                    itemsPerPage
                }
                onClick={handleGoNext}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
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
                  <IntlMessages id='app.wallet.noTransactionsYet' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  }
};

export default TransactionsTab;
