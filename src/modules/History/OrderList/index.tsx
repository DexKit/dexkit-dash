import React, {useEffect, useState} from 'react';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
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
import {toTokenUnitAmount} from '@0x/utils';
import {useTokenList} from 'hooks/useTokenList';
import {truncateAddress} from 'utils';

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const TradeHistory: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const {currentChainId} = useChainId();

  const networkName = useNetwork();

  const tokenList = useTokenList(networkName);

  const {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const {
    loading: loadingMaker,
    error: errorMaker,
    data: dataMaker,
  } = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage / 2}&makerToken=${address}`,
    [address, currentPage, rowsPerPage],
  );

  const {
    loading: loadingTaker,
    error: errorTaker,
    data: dataTaker,
  } = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage / 2}&takerToken=${address}`,
    [address, currentPage, rowsPerPage],
  );

  useEffect(() => {
    if (dataMaker && dataTaker && tokenList.length > 0) {
      const newDataMaker = dataMaker.records.map((e: any) => {
        const makerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.makerToken.toLowerCase(),
        );
        const takerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.takerToken.toLowerCase(),
        );

        e.order['side'] = 'SELL';
        e.order['makerTokenFn'] = makerToken;
        e.order['takerTokenFn'] = takerToken;
        e.order['makerAmountFn'] = toTokenUnitAmount(
          e.order.makerAmount,
          makerToken?.decimals || 18,
        ).toString();
        e.order['takerAmountFn'] = toTokenUnitAmount(
          e.order.takerAmount,
          takerToken?.decimals || 18,
        ).toString();
        e.metaData['remainingFillableTakerAmountFn'] = toTokenUnitAmount(
          e.metaData.remainingFillableTakerAmount,
          takerToken?.decimals || 18,
        ).toString();

        return e;
      });

      const newDataTaker = dataTaker.records.map((e: any) => {
        const makerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.makerToken.toLowerCase(),
        );
        const takerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.takerToken.toLowerCase(),
        );

        e.order['side'] = 'BUY';
        e.order['makerTokenFn'] = makerToken;
        e.order['takerTokenFn'] = takerToken;
        e.order['makerAmountFn'] = toTokenUnitAmount(
          e.order.makerAmount,
          makerToken?.decimals || 18,
        ).toString();
        e.order['takerAmountFn'] = toTokenUnitAmount(
          e.order.takerAmount,
          takerToken?.decimals || 18,
        ).toString();
        e.metaData['remainingFillableTakerAmountFn'] = toTokenUnitAmount(
          e.metaData.remainingFillableTakerAmount,
          takerToken?.decimals || 18,
        ).toString();

        return e;
      });

      setData(newDataMaker.concat(newDataTaker));
      setTotalRows(dataMaker.total + dataTaker.total);
    } else {
      setData([]);
    }
  }, [dataMaker, dataTaker, tokenList]);

  const classes = useStyles();

  return (
    <Box pt={{xl: 4}}>
      <PageTitle
        breadcrumbs={{
          history: [
            {url: '/', name: 'Dashboard'},
            {url: `/${networkName}/token/${address}`, name: 'Token'},
          ],
          active: {name: 'Order List'},
        }}
        title={{name: 'Order List'}}
        subtitle={{name: truncateAddress(address), hasCopy: address}}
      />

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
                  <Typography variant='h5'>Order List</Typography>
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
            {loadingMaker || loadingTaker ? (
              <LoadingTable columns={5} rows={10} />
            ) : errorMaker || errorTaker ? (
              <ErrorView
                message={errorMaker ? errorMaker.message : errorTaker.message}
              />
            ) : (
              <TradeTable
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

export default TradeHistory;
