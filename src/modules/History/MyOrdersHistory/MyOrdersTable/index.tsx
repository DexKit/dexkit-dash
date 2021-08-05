import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  Typography,
  Grid,
  TableContainer,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useStyles} from './index.style';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';

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
      {data && data?.length > 0 ? (
        <>
          <TableContainer>
            <Table stickyHeader>
              <TableHead className={classes.borderBottomClass}>
                <TableHeading />
              </TableHead>
              <TableBody className={classes.borderBottomClass}>
                {paginatedRows}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.paginationDesktop}
            component='div'
            count={totalRows}
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
        </>
      ) : null}
      {data && data?.length === 0 ? (
        <Box py={4}>
          <Grid
            container
            alignItems='center'
            alignContent='center'
            justify='center'
            direction='column'
            spacing={2}>
            <Grid item xs={12}>
              <ConnectivityImage />
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{textTransform: 'uppercase'}}
                gutterBottom
                align='center'
                variant='h5'>
                Ops, no data
              </Typography>
              <Typography align='center'>
                We have not found any orders linked to your wallet.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </>
  );
};

export default MyOrdersTable;
