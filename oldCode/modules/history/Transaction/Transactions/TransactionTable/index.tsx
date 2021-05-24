import React from 'react';
import {makeStyles, Box, Table, TableHead, TableBody, TablePagination} from '@material-ui/core';
import {grey} from '@material-ui/core/colors/index';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import Loader from '@crema/core/Loader';
import { TransferByAddress } from 'types/app';


interface Props {
  data: TransferByAddress[];
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({data, isLoading, total, page, perPage, onChangePage, onChangePerPage}) => {
  const useStyles = makeStyles(() => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',

      '@media (max-width: 767px)': {
        width: '100%',
        marginBottom: 15,
        overflowY: 'hidden',
        border: `1px solid ${grey[300]}`,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
  }));

  const classes = useStyles();
  
  return (
    <Box className={classes.tableResponsiveMaterial}>

      <Table className='table'>

        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>

        <TableBody className={classes.borderBottomClass}>
          {isLoading  && <Loader/>}  
           { data.length> 1 && data.map((row, index) => (
            <TableItem row={row} key={index} />
          ))}
        </TableBody>
        
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(event: unknown, newPage: number) => onChangePage(newPage)}
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => onChangePerPage(parseInt(event.target.value, 10))}
      />

    </Box>
  );
};

export default TransactionTable;
