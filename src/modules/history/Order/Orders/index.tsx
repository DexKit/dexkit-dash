import React, {useCallback, useEffect, useState} from 'react';
import {Card, makeStyles} from '@material-ui/core';
import { useWeb3 } from 'hooks/useWeb3';
import OrderTable from './OrderTable';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import Box from '@material-ui/core/Box';
import {grey} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../types/AppContextPropsType';
import { getContractOrders, getMyOrders, getTokenOrders } from 'services/graphql/bitquery';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { OrderData } from 'types/app';

interface Props {
  address: string,
  type: 'account'|'token'|'contract',
}

const Orders: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();

  // const [dealValue, setDealValue] = useState('allDeals');
  const [tableData, setTableData] = useState<OrderData[]>([]);
 
  useEffect(() => {
    if (props.type == 'account') {
      getMyOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, 30, 0, null, null)
        .then(orders => setTableData(orders))
        .catch(e => console.log(e))
    }
    else if (props.type == 'token') {
      getTokenOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, 30, 0, null, null)
        .then(orders => setTableData(orders))
        .catch(e => console.log(e))
    }
    else if (props.type == 'contract') {
      getContractOrders(GET_NETWORK_NAME(chainId), EXCHANGE.ALL, props.address, 30, 0, null, null)
        .then(orders => setTableData(orders))
        .catch(e => console.log(e))
    }
  }, [props, chainId]);


  // const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
  //   setDealValue(event.target.value as string);
  //   if (event.target.value === 'allDeals') {
  //     setTableData(dealsTableData);
  //   } else if (event.target.value === 'completed') {
  //     setTableData(
  //       dealsTableData.filter((data) => data.progress === 'Approved'),
  //     );
  //   } else {
  //     setTableData(
  //       dealsTableData.filter((data) => data.progress === 'Pending'),
  //     );
  //   }
  // };

  const {messages} = useIntl();

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
  const classes = useStyles();

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      <Card>
        <Box mb={4} display='flex' alignItems='center'>
          {/* <Box mt={{xl: 1}}>
            <Select
              className={classes.selectBox}
              value={dealValue}
              onChange={handleChange}
              disableUnderline={true}>
              <option value='allDeals' className={classes.selectOption}>
                {messages['dashboard.allDeals']}
              </option>
              <option value='completed' className={classes.selectOption}>
                {messages['todo.completed']}
              </option>
              <option value='pending' className={classes.selectOption}>
                {messages['common.pending']}
              </option>
            </Select>
          </Box> */}
          {/* <Box component='span' ml='auto'>
            <Link
              color='secondary'
              component='button'
              underline='none'
              className={classes.link}>
              <IntlMessages id='common.viewAll' />
            </Link>
          </Box> */}
        </Box>
        <OrderTable data={tableData} />
      </Card>
    </Box>
  );
};

export default Orders;
