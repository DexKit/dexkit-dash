import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Box, Card } from '@material-ui/core';
import { GridContainer } from '@crema';
import { useOrderList } from 'hooks/history/useOrderList';
import { useStyles } from './index.style';
import PageTitle from 'shared/components/PageTitle';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import { useNetwork } from 'hooks/useNetwork';

type Params = {
  address: string
};

type Props = RouteComponentProps<Params>

const OrderList: React.FC<Props> = (props) => { 
  const {match: { params }} = props;
  const {address} = params;
  
  const classes = useStyles();

  const networkName = useNetwork();
  const {loading, error, data, totalRows, currentPage, rowsPerPage, rowsPerPageOptions, onChangePage, onChangeRowsPerPage} = useOrderList({address});

  console.log('error', error)
  console.log('data', data)

  return (
    <Box pt={{xl: 4}}>
      
      <PageTitle
        history={[
          {url:'/', name: 'Dashboard'},
          {url:'/dashboard/wallet', name: 'Wallet'}
        ]}
        active={'Order History'}
        title={'Order History'}
      />

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
            <Card>
              <Box mb={4} display='flex' justifyContent='flex-end' alignItems='center'>
                <Box mt={{xl: 1}}>
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
              </Box>
              { loading ? <LoadingView /> : error ? <ErrorView message={error.message} /> : (
                <OrderTable
                  networkName={networkName}
                  data={data} 
                  totalRows={totalRows}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onChangePage={(newPage)=> onChangePage(newPage)}
                  onChangeRowsPerPage={(perPage)=> onChangeRowsPerPage(perPage)} 
                />
              )}
            </Card>
          </Box>
        </Grid>
      </GridContainer>  

    </Box>
  );
};

export default OrderList;
