import React, {useEffect, useState} from 'react';
import {useMyOrdersHistory} from 'hooks/history/useMyOrdersHistory';
import {Grid, Box, Card, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import useFetch from 'use-http';
import {ZRX_API_URL} from 'shared/constants/AppConst';
import {useChainId} from 'hooks/useChainId';
import {useNetwork} from 'hooks/useNetwork';
import {RouteComponentProps} from 'react-router';
import MyOrdersTable from './MyOrdersTable';
import usePagination from 'hooks/usePagination';
import {useStyles} from './index.style';
import LoadingTable from '../../Common/LoadingTable';
import {SignedOrder} from '@0x/types';
import {useBlokchain} from 'hooks/useBlokchain';
import {toTokenUnitAmount} from '@0x/utils';
import {useTokenList} from 'hooks/useTokenList';
import PageTitle from 'shared/components/PageTitle';

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const MyOrdersHistory: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;

  const {address} = params;

  const networkName = useNetwork();

  const tokenList = useTokenList();

  const {currentChainId} = useChainId();

  const {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState();
  const [totalRows, setTotalRows] = useState(0);

  const {loading, error, data: dataFn} = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage}&trader=${address.toLowerCase()}`,
    [address, currentPage, rowsPerPage],
  );

  useEffect(() => {
    if (dataFn && dataFn?.records && tokenList.length > 0) {
      const newData = dataFn.records.map((e: any) => {
        const makerToken = tokenList.find(
          (t) => t.address.toLowerCase() === e.order.makerToken.toLowerCase(),
        );
        const takerToken = tokenList.find(
          (t) => t.address.toLowerCase() === e.order.takerToken.toLowerCase(),
        );

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

      console.log(newData);

      setData(newData);
      setTotalRows(dataFn.total);
    } else {
      setData(undefined);
      setTotalRows(0);
    }
  }, [dataFn, tokenList]);

  const classes = useStyles();

  return (
    <Box pt={{xl: 4}}>
      <PageTitle
        breadcrumbs={{
          history: [
            {url: '/', name: 'Dashboard'},
            {url: '/ethereum/dashboard/token', name: 'Token'},
          ],
          active: {name: 'My Active Orders'},
        }}
        title={{name: 'My Active Orders'}}
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
                  <Typography variant='h5'>My Orders</Typography>
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
              <LoadingTable columns={6} rows={10} />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              data && (
                <MyOrdersTable
                  networkName={networkName}
                  data={data}
                  totalRows={totalRows}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onChangePage={(newPage) => onChangePage(newPage)}
                  onChangeRowsPerPage={(perPage) =>
                    onChangeRowsPerPage(perPage)
                  }
                />
              )
            )}
          </Paper>
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default MyOrdersHistory;
