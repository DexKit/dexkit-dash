import React, {useEffect, useState} from 'react';

import {Grid, Box, Card, Paper, Toolbar, Typography} from '@material-ui/core';
import {COINGECKO_CONTRACT_URL} from 'shared/constants/AppConst';
import {GridContainer} from '@crema';
import ErrorView from 'modules/Common/ErrorView';
import useFetch from 'use-http';
import {ZRX_API_URL} from 'shared/constants/AppConst';
import {useChainId} from 'hooks/useChainId';
import {useNetwork} from 'hooks/useNetwork';
import {RouteComponentProps, useHistory} from 'react-router';
import MyOrdersTable from './MyOrdersTable';
import usePagination from 'hooks/usePagination';
import {useStyles} from './index.style';
import LoadingTable from '../../Common/LoadingTable';
import {toTokenUnitAmount} from '@0x/utils';
import {useTokenList} from 'hooks/useTokenList';
import PageTitle from 'shared/components/PageTitle';
import {truncateAddress} from 'utils/text';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import {useWeb3} from 'hooks/useWeb3';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const MyOrdersHistory: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;

  const {address, networkName} = params;

  const history = useHistory();
  const account = useDefaultAccount();

  const tokenList = useTokenList(networkName);

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

  const {loading, error, data: dataFn, get} = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders`,
  );

  useEffect(() => {
    if (account) {
      get(
        `?page=${
          currentPage + 1
        }&perPage=${rowsPerPage}&trader=${account?.toLowerCase()}`,
      );
    }
  }, [account, currentPage, rowsPerPage]);

  useEffect(() => {
    if (dataFn && dataFn?.records && tokenList.length > 0) {
      const newData = dataFn.records.map((e: any) => {
        const makerToken = tokenList.find(
          (t: any) => t.address.toLowerCase() === e.order.makerToken.toLowerCase(),
        );
        const takerToken = tokenList.find(
          (t: any) => t.address.toLowerCase() === e.order.takerToken.toLowerCase(),
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

      console.log('netData', newData);

      setData(newData);
      setTotalRows(dataFn.total);
    } else {
      setData(undefined);
      setTotalRows(0);
    }
  }, [dataFn, tokenList]);

  const classes = useStyles();
  const token = useFetch<CoinDetailCoinGecko>(
    `${COINGECKO_CONTRACT_URL}/${address}`,
    {},
    [address],
  );

  return (
    <Box pt={{xl: 4}}>
      <PageTitle
        breadcrumbs={{
          history: [
            {url: '/', name: 'Dashboard'},
            {url: `/${networkName}/token/${address}`, name: 'Token'},
          ],
          active: {name: 'My Active Orders'},
        }}
        title={{
          name: `My Active Orders: ${truncateAddress(account)}`,
          hasCopy: account,
        }}
      />
      {token.data && (
        <PageTitle
          title={{name: token.data.name}}
          subtitle={{name: truncateAddress(address), hasCopy: address}}
          icon={address}
        />
      )}

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
