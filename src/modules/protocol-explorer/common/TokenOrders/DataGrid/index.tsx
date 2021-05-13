import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { OrderData } from 'types/app';
import { NETWORK, EXCHANGE } from 'shared/constants/AppEnums';

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: 'Timestamp', width: 70 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'price', headerName: 'Price', width: 130 },
  {
    field: 'baseAmount',
    headerName: 'Base Amount',
    type: 'number',
    width: 90,
  },
  {
    field: 'quoteAmount',
    headerName: 'QuoteAmount',
    description: 'Quote Amount.',
    sortable: false,
    width: 160,
  },
  {
    field: 'total',
    headerName: 'Total',
    description: 'Total Trade.',
    sortable: false,
  },
];

interface Props {
    data: OrderData[];
    networkName: NETWORK;
    isLoading: boolean;
    type: 'pair' | 'token';
    exchange: EXCHANGE;
    total: number;
    page: number;
    perPage: number;
    onChangePage: (newPage: number) => void;
    onChangePerPage: (newPerPage: number) => void;
  }
  
//@NOTE: Data Grid in evaluation, not use this component 
export default function TokenOrdersGrid(props: Props) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={props.data} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}