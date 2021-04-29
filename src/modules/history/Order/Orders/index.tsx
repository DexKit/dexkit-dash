import React, {useEffect, useState} from 'react';
import {makeStyles, Box, Card, Select} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {useIntl} from 'react-intl';
import OrderTable from './OrderTable';
import { CremaTheme } from 'types/AppContextPropsType';
import { useWeb3 } from 'hooks/useWeb3';
import { OrderData } from 'types/app';
import { getMyOrders, getTokenTrades, getContractOrders } from 'services/graphql/bitquery';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { EXCHANGE } from 'shared/constants/AppEnums';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';

const useStyles = makeStyles((theme: CremaTheme) => ({
  selectBox: {
    cursor: 'pointer',
    color: grey[500],
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    '& .MuiSelect-select': {
      paddingLeft: 10,
    },
  },
  selectOption: {
    cursor: 'pointer',
    padding: 8,
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
  link: {
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
}));

interface Props {
  address: string,
  type: 'account'|'token'|'contract',
}

const Orders: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const classes = useStyles();

  const [filterValue, setFilterValue] = useState('all');
  const [data, setData] = useState<OrderData[]>([]);
  const [tableData, setTableData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  
  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setFilterValue(event.target.value as string);
    
    if (event.target.value === 'all') {
      setTableData(data);
    }
    else if (event.target.value === 'buy') {
      setTableData(data.filter((data: OrderData) => data.side === 'BUY'));
    }
    else {
      setTableData(data.filter((data: OrderData) => data.side === 'SELL'));
    }
  };

  useEffect(() => {
    const setOrders = (orders: OrderData[]) => {
      setTableData(orders);
      setData(orders);
      setIsLoading(false)
    }

    if (props.type == 'account') {
      setIsLoading(true);
      getMyOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, rowsPerPage, page*rowsPerPage, null, null)
        // NOTE: We multiply total by 2, because API is returning both sides of the orders
        .then(data => {setTotal(data.total*2); setOrders(data.orders)})
        .catch(e => setIsLoading(false))
    }
    else if (props.type == 'token') {
      setIsLoading(true);
      getTokenTrades(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, null, 30, 0, null, null)
        .then(setOrders)
        .catch(e => setIsLoading(false))
    }
    else if (props.type == 'contract') {
      setIsLoading(true);
      getContractOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, GET_DEFAULT_QUOTE(chainId), 30, 0, null, null)
        .then(setOrders)
        .catch(e => setIsLoading(false))
    }
  }, [props, chainId, page, rowsPerPage]);

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <Card>
        <Box mb={4} display='flex' justifyContent='flex-end' alignItems='center'>
          <Box mt={{xl: 1}}>
            <Select
              className={classes.selectBox}
              value={filterValue}
              onChange={handleChange}
              disableUnderline={true}>
              <option value='all' className={classes.selectOption}>
                {messages['app.all']}
              </option>
              <option value='buy' className={classes.selectOption}>
                {messages['app.buy']}
              </option>
              <option value='sell' className={classes.selectOption}>
                {messages['app.sell']}
              </option>
            </Select>
          </Box>
        </Box>
        <OrderTable 
          data={tableData} 
          isLoading={isLoading}
          total={total}
          page={page}
          perPage={rowsPerPage}
          onChangePage={(newPage)=> setPage(newPage)}
          onChangePerPage={(newPerPage)=> setRowsPerPage(newPerPage)} 
        />
      </Card>
    </Box>
  );
};

export default Orders;
