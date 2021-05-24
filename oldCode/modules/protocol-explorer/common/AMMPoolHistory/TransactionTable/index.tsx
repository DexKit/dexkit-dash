import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TablePagination} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {MintBurn} from 'types/app';
import Loader from '@crema/core/Loader';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  transactionData: MintBurn[];
  exchange: EXCHANGE;
  networkName: NETWORK;
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({
  transactionData,
  isLoading,
  total,
  page,
  perPage,
  onChangePage,
  onChangePerPage,
  exchange,
  networkName,
}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',
      overflowY: 'hidden',
      '@media (max-width: 767px)': {
        borderTop: `1px solid ${grey[300]}`,
        width: '100%',
        marginBottom: 15,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    paginationDesktop: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    paginationMobile: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
  }));
  const classes = useStyles();

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {transactionData.length > 1 &&
              transactionData.map((data) => (
                <TableItem
                  data={data}
                  key={data.hash}
                  exchange={exchange}
                  networkName={networkName}
                />
              ))}
          </TableBody>
        </Table>
        {isLoading && <Loader />}
      </Box>
      <TablePagination
        className={classes.paginationDesktop}
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={total}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangePerPage(parseInt(event.target.value, 10))
        }
      />
      <TablePagination
        className={classes.paginationMobile}
        rowsPerPageOptions={[]}
        component='div'
        count={total}
        rowsPerPage={25}
        page={page}
        onChangePage={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default TransactionTable;
