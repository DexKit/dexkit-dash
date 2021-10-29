import React from 'react';

import {useIntl} from 'react-intl';

import {BalanceCoins} from 'types/models/Crypto';
import {ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import {Avatar, Box, Fade, Link, Tooltip} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import {useStyles} from './index.style';
import CoinsInfo from './CoinsInfo';
import LoadingInfo from './LoadingInfo';
import {Link as RouterLink} from 'react-router-dom';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {Token} from 'types/app';
import {FavoriteButton} from 'shared/components/FavoriteButton';

interface Props {
  data?: any;
  token: Token;
  loading: boolean;
  networkName: EthereumNetwork;
}

const coinInfoFactory = (
  propsData: any,
  usdFormatter: any,
  token: Token,
): BalanceCoins[] => {
  const dailyUSD = usdFormatter.format(propsData?.volume24Usd || 0);
  const {messages} = useIntl();

  return [
    {
      id: 1,
      name: messages['app.dailyVolume'] as string,
      // value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`,
      value: dailyUSD,
    },
    {
      id: 2,
      name: messages['app.totalDailyTrades'] as string,
      // value: `${propsData?.totalTrades.toFixed(0)}` ?? `0`,
      value: `${propsData?.trades?.toFixed(0)}` ?? `0`,
    },
    {
      id: 3,
      name: `${messages['app.amount']} ${token?.symbol.toUpperCase() ?? '?'} (${
        messages['app.24Hrs']
      })`,
      value: propsData?.volume24Base?.toFixed(2) ?? 0,
    },
  ];
};

const InfoToken: React.FC<Props> = (props) => {
  const {data, loading, networkName, token} = props;
  const {usdFormatter} = useUSDFormatter();
  const classes = useStyles();
  const {messages} = useIntl();

  // const color = 'rgb(78, 228, 78)';
  const color = data?.priceChange > 0 ? 'rgb(78, 228, 78)' : 'rgb(248, 78, 78)';

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
            {loading ? (
              <LoadingInfo />
            ) : (
              data && (
                <Box display='flex' flexDirection='column'>
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
                        {token?.symbol?.toUpperCase()}/USD
                      </Box>
                      <Box>
                        <FavoriteButton token={token} />
                      </Box>
                    </Box>
                    <Box display='flex'>
                      <Box mr={3}>
                        <Tooltip
                          title={messages['app.viewOnExplorer'] as string}
                          placement='top'>
                          <a
                            href={`${ETHERSCAN_API_URL_FROM_NETWORK(
                              networkName,
                            )}/address/${token.address}`}
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
                      <Box mr={3}>
                        <Link
                          to={`/${networkName}/token/${token?.address}`}
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
                    <Tooltip
                      title={messages['app.realTimeFromDEX'] as string}
                      placement='top'>
                      <Box
                        component='h3'
                        fontWeight={Fonts.BOLD}
                        style={{marginTop: 13}}
                        fontSize={20}>
                        {usdFormatter.format(data.priceUsd || 0)}
                      </Box>
                    </Tooltip>
                  </Box>
                  {data.priceChange && (
                    <Box display='flex'>
                      <Box
                        component='h3'
                        fontWeight={Fonts.LIGHT}
                        style={{color: color}}
                        fontSize={13}>
                        (24h {data.priceChange?.toFixed(2)}%)
                      </Box>
                    </Box>
                  )}

                  <Box pt={{md: 2, lg: 3, xl: 6}}>
                    {data && (
                      <CoinsInfo
                        coins={coinInfoFactory(data, usdFormatter, token)}
                      />
                    )}
                  </Box>
                </Box>
              )
            )}
          </AppCard>
        </>
      </Fade>
    </Box>
  );
};

export default InfoToken;
