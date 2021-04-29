import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '../../../../../@crema/core/AppTableContainer';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';

interface Props {
  balances: MyBalance[];
}

const CTable: React.FC<Props> = ({balances}) => {

  const [perPage, setPerPage] = React.useState(8);
  const [page, setPage] = React.useState(0);


  return (
    <AppTableContainer>
      <Table style={{overflowX: "hidden"}} className='table'>
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {balances.slice(page*perPage, (page+1)*perPage).map((data: MyBalance) => (
            <TableItem data={data} key={data.currency.address} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[8, 15, 20]}
        component="div"
        count={balances.length}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(_event: unknown, newPage: number) => setPage(newPage)}
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => setPerPage(parseInt(event.target.value, 10))}
      />
    </AppTableContainer>
  );
};

export default CTable;
