import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {grey} from '@material-ui/core/colors';
import { OrderData } from 'types/app';
import Loader from '@crema/core/Loader';

interface Props {
  transactionData: OrderData[];
  isLoading: boolean;
}

const TransactionTable: React.FC<Props> = ({transactionData, isLoading}) => {
  const useStyles = makeStyles(() => ({
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
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {isLoading ? 
          <Loader/> :
            transactionData.map((data) => (
              <TableItem data={data} key={data.hash} />
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TransactionTable;
