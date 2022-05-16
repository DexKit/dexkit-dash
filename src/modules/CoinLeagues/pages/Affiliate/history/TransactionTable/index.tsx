import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TablePagination} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';

import Loader from '@crema/core/Loader';
import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';
import {Empty} from 'shared/components/Empty';

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
        '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td':
          {
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

interface Props {
  data: any;
  isLoading: boolean;
  isNFT: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({
  data,
  isLoading,
  total,
  page,
  perPage,
  isNFT,
  onChangePage,
  onChangePerPage,
}) => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {data &&
              data.length > 1 &&
              data.map((item: any, i: any) => {
                return <TableItem key={i} data={item} isNFT={isNFT} />;
              })}
          </TableBody>
        </Table>
        {isLoading && <Loader />}
      </Box>
      <Box display='flex' justifyContent='center'>
        {(!data || (data && data.length === 0)) && (
          <Empty
            title={'No affiliates entries'}
            message={'Share the link for users to join'}
          />
        )}
      </Box>
      <TablePagination
        component='div'
        className={classes.paginationDesktop}
        rowsPerPageOptions={[10, 25, 50]}
        count={total}
        rowsPerPage={perPage}
        page={page}
        onPageChange={(event: unknown, newPage: number) =>
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
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default TransactionTable;
