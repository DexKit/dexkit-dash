import React from 'react';
import {useChainId} from 'hooks/useChainId';
import {BalanceCoins} from 'types/models/Crypto';
import {EXCHANGE, Fonts} from 'shared/constants/AppEnums';
import {ETHERSCAN_API_URL} from 'shared/constants/AppConst';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import AppCard from '@crema/core/AppCard';
import {GET_DEXTOOLS_URL, GET_AMM_ANALYTICS} from 'utils/protocol';
import TokenLogo from 'shared/components/TokenLogo';
import {useStyles} from './index.style';
import CoinsInfo from './CoinsInfo';
import {Fade, Tooltip} from '@material-ui/core';
import LoadingInfoAMM from './LoadingInfoAMM';

export interface Props {
  data?: any;
  exchange: EXCHANGE;
  address: string;
  loading: boolean;
}

const coinInfoFactory = (propsData: any): BalanceCoins[] => {
  return [
    {
      id: 1,
      name: 'Total Liquidy',
      value: `$${propsData?.liquidity.toFixed(0)}` ?? `$0`,
    },
    {
      id: 2,
      name: 'Daily Volume',
      value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`,
    },
    {
      id: 3,
      name: `Pooled ${propsData?.baseCurrency?.symbol ?? '?'}`,
      value: propsData?.basePooled.toFixed(2) ?? 0,
    },
    {
      id: 4,
      name: `Pooled ${propsData?.quoteCurrency?.symbol ?? '?'}`,
      value: propsData?.quotePooled.toFixed(2) ?? 0,
    },
  ];
};

const InfoAMM: React.FC<Props> = (props) => {
  const {data, exchange, address, loading} = props;
  const {currentChainId} = useChainId();
  const classes = useStyles();

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
            fontWeight={Fonts.BOLD}></Box>

          <AppCard>
            <Box display='flex' flexDirection='column'>
              {loading ? (
                <LoadingInfoAMM />
              ) : (
                data && (
                  <Box>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-between'>
                      <Box display='flex' alignItems='center'>
                        <TokenLogo
                          token0={data.baseCurrency?.address || ''}
                          token1={data.quoteCurrency?.address || ''}
                        />
                        <Box
                          component='h3'
                          color='text.primary'
                          fontWeight={Fonts.BOLD}
                          fontSize={20}
                          mr={2}>
                          {data.baseCurrency?.symbol}/
                          {data.quoteCurrency?.symbol}
                        </Box>
                      </Box>
                      <Box display='flex'>
                        <Box mr={3}>
                          <Tooltip
                            title={'View Pair on Explorer'}
                            placement='top'>
                            <a
                              href={`${ETHERSCAN_API_URL(
                                currentChainId,
                              )}/address/${props.data.address}`}
                              target='_blank'
                              rel='noreferrer'>
                              <Avatar
                                style={{
                                  color: '#3F51B5',
                                  backgroundColor: 'white',
                                  width: 34,
                                  height: 34,
                                }}
                                src='/images/etherescan.png'></Avatar>
                            </a>
                          </Tooltip>
                        </Box>
                        {analytics && (
                          <Box mr={3}>
                            <a
                              href={analytics.url}
                              target='_blank'
                              rel='noreferrer'>
                              <Avatar
                                style={{
                                  color: '#3F51B5',
                                  backgroundColor: 'white',
                                  width: 34,
                                  height: 34,
                                }}
                                src={analytics.icon}></Avatar>
                            </a>
                          </Box>
                        )}
                        {dextoolsURL && (
                          <Box mr={3}>
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
                                src='/images/dextools.png'></Avatar>
                            </a>
                          </Box>
                        )}
                        <Box mr={3}>
                          <a
                            href={`/dashboard/token/${data.baseCurrency?.address}`}>
                            <Avatar
                              style={{
                                color: '#3F51B5',
                                backgroundColor: 'white',
                                width: 34,
                                height: 34,
                              }}>
                              T
                            </Avatar>
                          </a>
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
                )
              )}
            </Box>
          </AppCard>
        </>
      </Fade>
    </Box>
  );
};

export default InfoAMM;
