import React from 'react';
import { Grid, Box, Paper, Toolbar, Typography } from '@material-ui/core';
import { GridContainer } from '@crema';

import { useStyles } from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { useIntl } from 'react-intl';


import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useAllTradeHistory } from 'hooks/history/useAllTradeHistory';

type Props = {
  address: string;
  networkName: EthereumNetwork;
};



const TradeAllHistoryContainer: React.FC<Props> = (props) => {

  const { address,  networkName } = props;
  const { messages } = useIntl();
  const classes = useStyles();

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
  } = useAllTradeHistory({ address,  networkName });


  return (
      <GridContainer>
    
        <Grid item xs={12} md={12}>
          <Paper className={classes.paper}>
            <Toolbar className={classes.toolbar}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                style={{ width: '100%' }}>
                <Box>
                  <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                    <SwapHorizontalCircleIcon color={'primary'} />
                    <Typography variant='h5' display={'block'} align={'center'}>{messages['app.tradeHistory']}</Typography>
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

  );
};

export default TradeAllHistoryContainer;