import React, {useEffect, useState} from 'react';
import {makeStyles, Box, Card, Select} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {useIntl} from 'react-intl';
import {useWeb3} from 'hooks/useWeb3';
import {CremaTheme} from 'types/AppContextPropsType';
import {EXCHANGE} from 'shared/constants/AppEnums';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { getContractOrders, getMyOrders, getTokenOrders } from 'services/graphql/bitquery';
import { OrderData } from 'types/app';
import OrderTable from './OrderTable';

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
    if (props.type == 'account') {
      getMyOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, 15, 0, null, null)
        .then(orders => {
          setData(orders);
          setTableData(orders);
        }).catch(e => console.log(e))
    }
    else if (props.type == 'token') {
      getTokenOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, 15, 0, null, null)
        .then(orders => {
          setData(orders);
          setTableData(orders);
        }).catch(e => console.log(e))
    }
    else if (props.type == 'contract') {
      getContractOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, GET_DEFAULT_QUOTE(chainId), 15, 0, null, null)
        .then(orders => {
          setData(orders);
          setTableData(orders);
        }).catch(e => console.log(e))
    }
  }, [props, chainId]);

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
        <OrderTable data={tableData} />
      </Card>
    </Box>
  );
};

export default Orders;
