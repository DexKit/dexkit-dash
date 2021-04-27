import React from 'react';
import {makeStyles, Box, Table, TableHead, TableBody} from '@material-ui/core';
import {grey} from '@material-ui/core/colors/index';
import {TransferByAddress} from 'types/app';
import TableHeading from './TableHeading';
import TableItem from './TableItem';

interface Props {
  data: TransferByAddress[];
}

const TransactionTable: React.FC<Props> = ({data}) => {
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
          {data.map((row, index) => (<TableItem row={row} key={index} />))}
        </TableBody>
        
      </Table>

    </Box>
  );
};

export default TransactionTable;
