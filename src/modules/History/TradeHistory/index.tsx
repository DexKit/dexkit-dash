import React, { useEffect, useState } from 'react';
import {Grid, Box, Card, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';
import {useStyles} from './index.style';
import PageTitle from 'shared/components/PageTitle';
import ErrorView from 'modules/Common/ErrorView';
import {useNetwork} from 'hooks/useNetwork';
import useFetch from 'use-http';
import {ZRX_API_URL} from 'shared/constants/AppConst';
import {useChainId} from 'hooks/useChainId';
import {RouteComponentProps} from 'react-router';
import TradeTable from './TradeTable';
import usePagination from 'hooks/usePagination';
import LoadingTable from '../../Common/LoadingTable';
import { toTokenUnitAmount } from '@0x/utils';
import { useTokenList } from 'hooks/useTokenList';

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const TradeHistory: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const networkName = useNetwork();

  const {currentChainId} = useChainId();

  const tokenList = useTokenList();

  const {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState([]);

  // sell
  const {loading, error, data: dataFn} = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${currentPage+1}&perPage=${rowsPerPage}?makerToken=${address}`,
    [address, currentPage, rowsPerPage],
  );

  // BUY JUNTAR COM O DE CIMA e colocar um novo campo  SIDE ou TYPE "badge" com valores BUY e SELL
  // DEIXAR A LÒGICA AQUI OU COLOCAR EM UM HOOK
  // const {loading, error, data: dataBuy} = useFetch(
  //   `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${currentPage+1}&perPage=${rowsPerPage}?takerToken=${address}`,
  //   [address, currentPage, rowsPerPage],
  // );

  useEffect(() => {
    if (dataFn && dataFn?.records) {
      const newData = dataFn.records.map((e: any) => {
        console.log(e);
        e.order['makerAmountFn'] = toTokenUnitAmount(e.order.makerAmount, tokenList.find(t => t.address == e.order.makerToken)?.decimals||18).toString();
        e.order['takerAmountFn'] = toTokenUnitAmount(e.order.takerAmount, tokenList.find(t => t.address == e.order.takerToken)?.decimals||18).toString();
        e.metaData['remainingFillableTakerAmountFn'] = toTokenUnitAmount(e.metaData.remainingFillableTakerAmount, tokenList.find(t => t.address == e.order.takerToken)?.decimals||18).toString();
        return e;
      });

      setData(newData);
    } else {
      setData([])
    }
  }, [dataFn]);

  const classes = useStyles();

  return (
    <Box pt={{xl: 4}}>
      {/* <PageTitle
        history={[
          {url:'/', name: 'Dashboard'},
          {url:'/dashboard/token', name: 'Token'}
        ]}
        active={'Trade History'}
        title={'Trade History'}
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
                  <Typography variant='h5'>Trade History</Typography>
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
            {/* {loading ? (
              <LoadingTable rowCount={10} />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              <TradeTable
                networkName={networkName}
                data={data.records}
                totalRows={data.total}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onChangePage={(newPage) => onChangePage(newPage)}
                onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
              />
            )} */}
          </Paper>
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default TradeHistory;
