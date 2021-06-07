import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import {Box, makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {MyBalances} from 'types/blockchain';

interface Props {
  balances: MyBalances[];
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableResponsiveMaterial: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    '@media (max-width: 767px)': {
      borderTop: `1px solid ${theme.palette.divider}`,
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

const CTable: React.FC<Props> = ({balances}) => {
  const [perPage, setPerPage] = React.useState(8);
  const [page, setPage] = React.useState(0);

  const classes = useStyles();

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {balances
              .filter((b) => b.value)
              .slice(page * perPage, (page + 1) * perPage)
              .map((data: MyBalances) => (
                <TableItem data={data} key={data.currency?.address} />
              ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        className={classes.paginationDesktop}
        rowsPerPageOptions={[8, 15, 20]}
        component='div'
        count={balances.length}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(_event: unknown, newPage: number) => setPage(newPage)}
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          setPerPage(parseInt(event.target.value, 10))
        }
      />
      <TablePagination
        className={classes.paginationMobile}
        rowsPerPageOptions={[]}
        component='div'
        count={balances.length}
        rowsPerPage={15}
        page={page}
        onChangePage={(_event: unknown, newPage: number) => setPage(newPage)}
      />
    </>
  );
};

export default CTable;
