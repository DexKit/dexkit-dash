import React from 'react';

import {useIntl} from 'react-intl';

import {BalanceCoins} from 'types/models/Crypto';
import {EthereumNetwork, EXCHANGE, Fonts} from 'shared/constants/AppEnums';
import {ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import AppCard from '@crema/core/AppCard';
import {GET_AMM_ANALYTICS, GET_DEXTOOLS_URL} from 'utils/protocol';
import {useStyles} from './index.style';
import CoinsInfo from './CoinsInfo';
import {Fade, Link, Tooltip, Typography} from '@material-ui/core';
import LoadingInfoAMM from './LoadingInfoAMM';
import {Link as RouterLink} from 'react-router-dom';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';

export interface Props {
  data?: any;
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
  loading: boolean;
}

const coinInfoFactory = (propsData: any): BalanceCoins[] => {
  const {messages} = useIntl();

  return [
    {
      id: 1,
      name: messages['app.totalLiquidity'] as string,
      value: `$${propsData?.liquidity.toFixed(0)}` ?? `$0`,
    },
    {
      id: 2,
      name: messages['app.dailyVolume'] as string,
      value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`,
    },
    {
      id: 3,
      name: `${messages['app.pooled']} ${
        propsData?.baseCurrency?.symbol ?? '?'
      }`,
      value: propsData?.basePooled.toFixed(2) ?? 0,
    },
    {
      id: 4,
      name: `${messages['app.pooled']} ${
        propsData?.quoteCurrency?.symbol ?? '?'
      }`,
      value: propsData?.quotePooled.toFixed(2) ?? 0,
    },
  ];
};

const InfoAMM: React.FC<Props> = (props) => {
  const {data, exchange, address, loading, networkName} = props;
  const classes = useStyles();
  const {messages} = useIntl();

  const color = data?.priceChange > 0 ? 'rgb(78, 228, 78)' : 'rgb(248, 78, 78)';
  const dextoolsURL = GET_DEXTOOLS_URL(exchange, address);
  const analytics = GET_AMM_ANALYTICS(exchange, address);

  return (
    <Box className='card-hover'>
      <Fade in={true} timeout={1000}>
        <>
          <Box
            component='h2'
            color='text.primary'
            fontSize={16}
            className={classes.textUppercase}
            fontWeight={Fonts.BOLD}
          />

          <AppCard>
            <Box display='flex' flexDirection='column'>
              {loading ? (
                <LoadingInfoAMM />
              ) : data ? (
                <Box>
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'>
                    <Box display='flex' alignItems='center'>
                      <Box
                        component='h3'
                        color='text.primary'
                        fontWeight={Fonts.BOLD}
                        fontSize={20}
                        mr={2}>
                        {data.baseCurrency?.symbol}/{data.quoteCurrency?.symbol}
                      </Box>
                    </Box>
                    <Box display='flex'>
                      <Box mr={3}>
                        <Tooltip
                          title={messages['app.viewPairOnExplorer'] as string}
                          placement='top'>
                          <a
                            href={`${ETHERSCAN_API_URL_FROM_NETWORK(
                              networkName,
                            )}/address/${props.data.address}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            <Avatar
                              style={{
                                color: '#3F51B5',
                                backgroundColor: 'white',
                                width: 34,
                                height: 34,
                              }}
                              src='/images/etherescan.png'
                            />
                          </a>
                        </Tooltip>
                      </Box>
                      {analytics && (
                        <Box mr={3}>
                          <Tooltip
                            title={`${
                              messages['app.viewAnalyticsOn']
                            } ${GET_EXCHANGE_NAME(exchange)}`}
                            placement='top'>
                            <a
                              href={analytics.url}
                              target='_blank'
                              rel='noopener noreferrer'>
                              <Avatar
                                style={{
                                  color: '#3F51B5',
                                  backgroundColor: 'white',
                                  width: 34,
                                  height: 34,
                                }}
                                src={analytics.icon}
                              />
                            </a>
                          </Tooltip>
                        </Box>
                      )}
                      {dextoolsURL && (
                        <Box mr={3}>
                          <Tooltip
                            title={messages['app.viewOnDexTools'] as string}
                            placement='top'>
                            <a
                              href={dextoolsURL}
                              target='_blank'
                              rel='noopener nofollow noreferrer'>
                              <Avatar
                                style={{
                                  color: '#3F51B5',
                                  backgroundColor: 'white',
                                  width: 34,
                                  height: 34,
                                }}
                                src='/images/dextools.png'
                              />
                            </a>
                          </Tooltip>
                        </Box>
                      )}
                      <Box mr={3}>
                        <Link
                          to={`/${networkName}/token/${data.baseCurrency?.address}`}
                          component={RouterLink}>
                          <Tooltip
                            title={messages['app.tradeToken'] as string}
                            placement='top'>
                            <Avatar
                              style={{
                                color: '#3F51B5',
                                backgroundColor: 'white',
                                width: 34,
                                height: 34,
                              }}>
                              <CompareArrowsIcon />
                            </Avatar>
                          </Tooltip>
                        </Link>
                      </Box>
                    </Box>
                  </Box>

                  <Box display='flex' alignItems='center'>
                    <Box
                      component='h2'
                      fontWeight={Fonts.BOLD}
                      style={{color: color, marginTop: 13}}
                      fontSize={24}>
                      ${props.data.priceUsd.toFixed(4)}
                    </Box>
                  </Box>
                  <Box display='flex'>
                    <Box
                      component='h3'
                      fontWeight={Fonts.LIGHT}
                      style={{color: color}}
                      fontSize={13}>
                      (24h {props.data.priceChange.toFixed(2)}%)
                    </Box>
                    <Box
                      component='h3'
                      fontWeight={Fonts.LIGHT}
                      style={{color: 'text.primary', marginLeft: 10}}
                      fontSize={13}>
                      {props.data.price.toFixed(8)}{' '}
                      {props.data.quoteCurrency?.symbol}
                    </Box>
                  </Box>

                  <Box pt={{md: 2, lg: 3, xl: 6}}>
                    {data && <CoinsInfo coins={coinInfoFactory(data)} />}
                  </Box>
                </Box>
              ) : (
                <Typography component='h1' color={'primary'}>
                  {messages['app.noDataAvailableForPairOn']}{' '}
                  {GET_EXCHANGE_NAME(exchange)}{' '}
                </Typography>
              )}
            </Box>
          </AppCard>
        </>
      </Fade>
    </Box>
  );
};

export default InfoAMM;
