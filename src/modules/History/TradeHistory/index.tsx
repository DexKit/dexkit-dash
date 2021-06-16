import React, { useEffect, useMemo } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Grid, Box, Paper, Toolbar, Typography } from '@material-ui/core';
import { GridContainer } from '@crema';

import { useStyles } from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { useIntl } from 'react-intl';
import PageTitle from 'shared/components/PageTitle';

import { truncateAddress } from 'utils/text';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useCoingeckoTokenInfo } from 'hooks/useCoingeckoTokenInfo';
import { useTradeHistory } from 'hooks/history/useTradeHistory';
import { TokenAnalytics } from 'modules/Dashboard/Token/Analytics';

type Params = {
  address: string;
  token: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const TradeHistory: React.FC<Props> = (props) => {
  const {
    match: { params },
  } = props;
  const { address, token, networkName } = params;
  const { messages } = useIntl();
  const classes = useStyles();
  const account = useDefaultAccount();
  const history = useHistory();

  useEffect(() => {
    if (account && (account !== address)) {
      if (token) {
        history.push(`/${networkName}/history/trade/list/${account}/token/${token}`)
      } else {
        history.push(`/${networkName}/history/trade/list/${account}`)
      }

    }
  }, [account])


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
  } = useTradeHistory({ address, baseCurrency: token, networkName });

  const { data: tokenData } = useCoingeckoTokenInfo(token, networkName);


  const onSwitchNetwork = (n: EthereumNetwork) => {
    history.push(`/${n}/history/trade/list/${account}`)
  }

  return (
    <Box pt={{ xl: 4 }}>
      {!token && <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: `/dashboard/wallet`, name: 'Wallet' },
          ],
          active: { name: 'Trade History' },
        }}
        title={{ name: `Trade History: ${truncateAddress(address)}`, hasCopy: address }}
        networkSwitcher={{ networkName, onClick: onSwitchNetwork }}
      />}

      {token && <PageTitle
        breadcrumbs={{
          history: [
            { url: '/', name: 'Dashboard' },
            { url: `/${networkName}/dashboard/token/${token}`, name: 'Token' },
          ],
          active: { name: 'Trade History' },
        }}
        title={{ name: `Trade History:  ${truncateAddress(address)}`, hasCopy: address }}
      />}

      {(token && tokenData) && (
        <PageTitle
          title={{ name: tokenData.name }}
          subtitle={{ name: truncateAddress(token), hasCopy: token }}
          icon={token}
        />
      )}




      <GridContainer>
        {(token && address) &&  
        <Grid item xs={12} md={12}>
            <Paper className={classes.paper}>
                <TokenAnalytics account={address} token={token} networkName={networkName} />
            </Paper>
          </Grid>}

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
    </Box>
  );
};

export default TradeHistory;