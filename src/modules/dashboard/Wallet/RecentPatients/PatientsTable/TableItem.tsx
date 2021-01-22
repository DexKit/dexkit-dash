import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useStyles from './TableItem.style';
// import AppMenu from '../../../../../@crema/core/AppMenu';
import Avatar from '@material-ui/core/Avatar';
// import {Fonts} from '../../../../../shared/constants/AppEnums';
import {RecentPatientData} from '../../../../../types/models/HealthCare';

interface TableItemProps {
  data: RecentPatientData;
}

const TableItem: React.FC<TableItemProps> = ({data}) => {
  const classes = useStyles();

  return (
    <TableRow key={data.name} className='item-hover'>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
          <Box mr={3} clone>
            <Avatar src={data.profile_pic} />
          </Box>
        </Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {data.balance}
      </TableCell>
      <TableCell align='center'>
      <Button style={{marginRight: 10}} variant="contained" color="primary"  >
        Send
      </Button>
      <Button variant="contained" color="secondary" >
        Trade
      </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
