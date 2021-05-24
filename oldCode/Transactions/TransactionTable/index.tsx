import React from 'react';
import {Box, Table, TableHead, TableBody, TablePagination} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import { useTransactionList } from 'hooks/history/useTransactionList';
import { useStyles } from './index.style';


interface Props {
  // data: TransferByAddress[];
  // isLoading: boolean;
  // total: number;
  // page: number;
  // perPage: number;
  // onChangePage: (newPage: number) => void;
  // onChangePerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = () => {
  const classes = useStyles();
  
  return (
    <Box className={classes.tableResponsiveMaterial}>

      {/* <Table className='table'>

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
      /> */}

    </Box>
  );
};

export default TransactionTable;
