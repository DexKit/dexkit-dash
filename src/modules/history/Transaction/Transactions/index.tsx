import React, {useEffect, useState} from 'react';
import {makeStyles, Box, Card, Select} from '@material-ui/core';
import {useIntl} from 'react-intl';

import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';
import TransactionTable from './TransactionTable';
import { useWeb3 } from 'hooks/useWeb3';
import { TransferByAddress } from 'types/app';
import { getMyTransfers } from 'services/graphql/bitquery';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';

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

const Transactions: React.FC<Props> = (props) => {
  const {chainId} = useWeb3();
  const {messages} = useIntl();

  const classes = useStyles();

  const [filterValue, setFilterValue] = useState('all');
  const [data, setData] = useState<TransferByAddress[]>([]);
  const [tableData, setTableData] = useState<TransferByAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);


  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setFilterValue(event.target.value as string);
    
    if (event.target.value === 'all') {
      setTableData(data);
    }
    else if (event.target.value === 'send') {
      setTableData(data.filter((data: TransferByAddress) => data.type === 'Send'));
    }
    else {
      setTableData(data.filter((data: TransferByAddress) => data.type === 'Receive'));
    }
  };
 
  useEffect(() => {
    if (props.type == 'account') {
      setIsLoading(true)
      getMyTransfers(GET_NETWORK_NAME(chainId), props.address, rowsPerPage, page*rowsPerPage, null, null)
        .then(data => {
          setTotal(data.total)
          setData(data.transfers);
          setTableData(data.transfers);
          setIsLoading(false)
        })
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
              <option value='send' className={classes.selectOption}>
                {messages['app.send']}
              </option>
              <option value='receive' className={classes.selectOption}>
                {messages['app.receive']}
              </option>
            </Select>
          </Box>
        </Box>
        <TransactionTable 
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

export default Transactions;
