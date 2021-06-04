import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';
import {useOrderList} from 'hooks/history/useOrderList';
import {useStyles} from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import {useNetwork} from 'hooks/useNetwork';
import LoadingTable from 'modules/Common/LoadingTable';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { useIntl } from 'react-intl';

type Params = {
  address: string;
  token: string;
};

type Props = RouteComponentProps<Params>;

const OrderList: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, token} = params;
  const {messages} = useIntl();
  const classes = useStyles();

  const networkName = useNetwork();
  const {
    loading,
    error,
    data,
    totalRows,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useOrderList({address, baseCurrency: token});

  console.log('error', error);
  console.log('data', data);

  return (
    <Box pt={{xl: 4}}>
      {/* <PageTitle
        history={[
          {url:'/', name: 'Dashboard'},
          {url:'/dashboard/wallet', name: 'Wallet'}
        ]}
        active={'Order History'}
        title={'Order History'}
      /> */}

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Paper className={classes.paper}>
            <Toolbar className={classes.toolbar}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                style={{width: '100%'}}>
                <Box>
                  <Box display={'flex'} justifyContent={'flex-start'}     alignItems={'center'}>
                      <SwapHorizontalCircleIcon color={'primary'}/>
                      <Typography variant='h5' display={'block'}  align={'center'}>{messages['app.tradeHistory']}</Typography>
                  </Box>
                </Box>
                {/* <Select
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
                  </Select> */}
              </Box>
            </Toolbar>
            {loading ? (
              <LoadingTable columns={8} rows={10} />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              <OrderTable
                networkName={networkName}
                data={data}
                totalRows={totalRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onChangePage={(newPage) => onChangePage(newPage)}
                onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
              />
            )}
          </Paper>
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default OrderList;