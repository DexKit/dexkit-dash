import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import useStyles from './TableItem.style';
import {RecentPatientData} from '../../../../../../types/models/HealthCare';

interface TableItemProps {
  data: RecentPatientData;
}

const TableItem: React.FC<TableItemProps> = ({data}) => {
  const classes = useStyles();

  return (
    <TableRow key={data.name} className='item-hover'>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        {data.id}
      </TableCell>
      <TableCell align='center' className={classes.tableCell}>
        {data.balance}
      </TableCell>
      <TableCell align='center'>
       {data.name}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
