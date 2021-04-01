import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '../../../../../@crema/core/AppTableContainer';
import { MyBalance } from 'types/bitquery/myBalance.interface';

interface RecentPatientsProps {
  recentPatients: MyBalance[];
}

const PatientsTable: React.FC<RecentPatientsProps> = ({recentPatients}) => {
  return (
    <AppTableContainer>
      <Table style={{overflowX: "hidden"}} className='table'>
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {recentPatients.map((data: MyBalance) => (
            <TableItem data={data} key={data.currency.address} />
          ))}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
};

export default PatientsTable;
