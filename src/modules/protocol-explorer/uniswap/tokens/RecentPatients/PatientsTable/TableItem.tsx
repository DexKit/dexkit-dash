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
      <TableCell component='th'align='left' scope='row' className={classes.tableCell}>
        {data.id}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {data.balance}
      </TableCell>
      <TableCell align='left'>
       {data.name}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
