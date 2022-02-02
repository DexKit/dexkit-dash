import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  TableContainer,
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {Transfers} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';

import {WalletEmptyImage} from 'shared/components/Icons';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  networkName: EthereumNetwork;
  data: Transfers[] | undefined;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TransferTable: React.FC<Props> = ({
  networkName,
  data,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = useStyles();

  return data && data.length > 0 ? (
    <>
      <Box mb={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableHeading />
            </TableHead>
            <TableBody>
              {data &&
                data.map((row, index) => (
                  <TableItem row={row} networkName={networkName} key={index} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {data && data.length === 0 && (
          <Typography
            variant='h5'
            display={'block'}
            align={'center'}
            color={'primary'}>
            You don't have made transfers with this wallet yet
          </Typography>
        )}
      </Box>

      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={-1}
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
        count={-1}
        page={currentPage}
        rowsPerPage={25}
        rowsPerPageOptions={[]}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  ) : (
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
                <IntlMessages id='app.wallet.youDontHaveTransfersYet' />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default TransferTable;
