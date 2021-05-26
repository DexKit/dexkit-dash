import React from 'react';
import {makeStyles, Box, Table, TableHead, TableBody, TablePagination} from '@material-ui/core';
import {grey} from '@material-ui/core/colors/index';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import { IOrderList } from "types/app";
import { EthereumNetwork } from 'shared/constants/AppEnums';


interface Props {
  networkName: EthereumNetwork,
  data: IOrderList[] | undefined;
  totalRows: number | undefined;
  currentPage: number
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TransactionTable: React.FC<Props> = ({networkName, data, totalRows, currentPage, rowsPerPage, rowsPerPageOptions, onChangePage, onChangeRowsPerPage}) => {
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

  console.log(data);

  const classes = useStyles();
  
  return (
    <Box className={classes.tableResponsiveMaterial}>

      <Table className='table'>

        <TableHead className={classes.borderBottomClass}>
          <TableHeading />
        </TableHead>

        <TableBody className={classes.borderBottomClass}>
          {
            data && data.map((row, index) => (<TableItem row={row} networkName={networkName} key={index} />))
          }
        </TableBody>
        
      </Table>
      
      <TablePagination
        component="div"
        count={totalRows||0}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onChangePage={(event: unknown, newPage: number) => onChangePage(newPage)}
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => onChangeRowsPerPage(parseInt(event.target.value, 10))}
      />

    </Box>
  );
};

export default TransactionTable;
