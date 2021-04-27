import { makeStyles, Select } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import React, { useEffect, useState } from 'react';
import {useIntl} from 'react-intl';
import {MintBurn} from 'types/app';
import { CremaTheme } from 'types/AppContextPropsType';
import AppCard from '../../../../../@crema/core/AppCard';
import TransactionTable from './TransactionTable';

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
  transactionData: MintBurn[];
}

const OrderNTransaction: React.FC<Props> = ({transactionData}) => {
  const classes = useStyles();
  const {messages} = useIntl();
  
  const [filterValue, setFilterValue] = useState('all');
  const [tableData, setTableData] = useState<MintBurn[]>([]);

  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setFilterValue(event.target.value as string);
    filter(event.target.value as string);
  };

  const filter = (value: string) => {
    if (value === 'add') {
      setTableData(transactionData.filter((data: MintBurn) => data.type === 'Add'));
    }
    else if (value === 'remove') {
      setTableData(transactionData.filter((data: MintBurn) => data.type === 'Remove'));
    }
    else {
      setTableData(transactionData);
    }
  }

  useEffect(() => {
    filter(filterValue);
  }, [transactionData])

  return (
    <AppCard height={1} title={messages["app.pool"]} action={
      (
        <Select
              className={classes.selectBox}
              value={filterValue}
              onChange={handleChange}
              disableUnderline={true}>
              <option value='all' className={classes.selectOption}>
                {messages['app.all']}
              </option>
              <option value='add' className={classes.selectOption}>
                {messages['app.add']}
              </option>
              <option value='remove' className={classes.selectOption}>
                {messages['app.remove']}
              </option>
            </Select>
      )
    }>
      <TransactionTable transactionData={tableData} />
    </AppCard>
  );
};

export default OrderNTransaction;
