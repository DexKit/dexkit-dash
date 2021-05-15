import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {
  Box,
  makeStyles,
  TableCell,
  TableRow,
  TablePagination,
  TableContainer,
} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {OrderData} from 'types/app';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  data: OrderData[];
  networkName: NETWORK;
  isLoading: boolean;
  type: 'pair' | 'token';
  exchange: EXCHANGE;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const OrderTable: React.FC<Props> = ({
  data,
  isLoading,
  total,
  page,
  perPage,
  onChangePage,
  onChangePerPage,
  type,
  exchange,
  networkName,
}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
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
  const tableItems = React.useMemo(()=> {
    return data.map((row, index) => (
      <TableItem
        row={row}
        key={index}
        exchange={exchange}
        type={type}
        networkName={networkName}
      />
    ))},[data, exchange, networkName])


  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading type={type} exchange={exchange} />
          </TableHead>
          <TableBody>
            {data.length > 1 && tableItems}

            {isLoading && (
              <TableRow className={classes.borderBottomClass}>
                <TableCell
                  component='th'
                  scope='row'
                  colSpan={10}
                  className={classes.borderBottomClass}>
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

export default OrderTable;
