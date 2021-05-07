import React, {useState, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {MintBurn} from 'types/app';
import TransactionTable from './TransactionTable';
import AppCard from '@crema/core/AppCard';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import {
  Box,
  makeStyles,
  Paper,
  Select,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {grey} from '@material-ui/core/colors';

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
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
  exchange: EXCHANGE;
  networkName: NETWORK;
  isLoading: boolean;
  total: number;
  page: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const AMMPoolHistory: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const transactionData = props.transactionData;
  const [filterValue, setFilterValue] = useState('all');
  const [tableData, setTableData] = useState<MintBurn[]>([]);

  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setFilterValue(event.target.value as string);
    filter(event.target.value as string);
  };

  const filter = (value: string) => {
    if (value === 'add') {
      setTableData(
        transactionData.filter((data: MintBurn) => data.type === 'Add'),
      );
    } else if (value === 'remove') {
      setTableData(
        transactionData.filter((data: MintBurn) => data.type === 'Remove'),
      );
    } else {
      setTableData(transactionData);
    }
  };

  useEffect(() => {
    filter(filterValue);
  }, [transactionData]);

  return (
    // <AppCard height={1} title={messages["app.pool"]}
    // action={
    //   (
    //     <Select
    //           className={classes.selectBox}
    //           value={filterValue}
    //           onChange={handleChange}
    //           disableUnderline={true}>
    //           <option value='all' className={classes.selectOption}>
    //             {messages['app.all']}
    //           </option>
    //           <option value='add' className={classes.selectOption}>
    //             {messages['app.add']}
    //           </option>
    //           <option value='remove' className={classes.selectOption}>
    //             {messages['app.remove']}
    //           </option>
    //         </Select>
    //   )
    // }>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          style={{width: '100%'}}>
          <Box>
            <Typography variant='h5'>{messages['app.pool']}</Typography>
          </Box>
          <Box>
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
          </Box>
        </Box>
      </Toolbar>
      <TransactionTable {...props} transactionData={tableData} />
    </Paper>
    // </AppCard>
  );
};

export default AMMPoolHistory;
