import React from 'react';
import {useChainId} from 'hooks/useChainId';
import {BalanceCoins} from 'types/models/Crypto';
import {ETHERSCAN_API_URL} from 'shared/constants/AppConst';
import {Fonts} from 'shared/constants/AppEnums';
import {Box, Avatar, Tooltip} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import TokenLogo from 'shared/components/TokenLogo';
import {useStyles} from './index.style';
import CoinsInfo from './CoinsInfo';

interface Props {
  data: any;
}

const coinInfoFactory = (propsData: any): BalanceCoins[] => {
  return [
    {
      id: 1,
      name: 'Daily Volume',
      // value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`,
      value: `$${propsData?.tradeAmountInUsd?.toFixed(0)}` ?? `$0`,
    },
    {
      id: 2,
      name: 'Total Trades (24 hrs)',
      // value: `${propsData?.totalTrades.toFixed(0)}` ?? `0`,
      value: `${propsData?.trades?.toFixed(0)}` ?? `0`,
    },
    {
      id: 3,
      name: `Amount ${propsData?.baseCurrency?.symbol ?? '?'} (24 hrs)`,
      value: propsData?.baseAmount?.toFixed(2) ?? 0,
    },
    {
      id: 4,
      name: `Amount ${propsData?.quoteCurrency?.symbol ?? '?'} (24 hrs)`,
      value: propsData?.quoteAmount?.toFixed(2) ?? 0,
    },
  ];
};

const Info: React.FC<Props> = (props) => {
  const {data} = props;
  const {currentChainId} = useChainId();
  const classes = useStyles();

  // const color = 'rgb(78, 228, 78)';
  const color = data.priceChange > 0 ? 'rgb(78, 228, 78)' : 'rgb(248, 78, 78)';

  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        className={classes.textUppercase}
        fontWeight={Fonts.BOLD}></Box>

      <AppCard>
        {data && (
          <Box display='flex' flexDirection='column'>
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
                  {data.baseCurrency?.symbol}/{data.quoteCurrency?.symbol}
                </Box>
              </Box>
              <Box display='flex'>
                <Box mr={3}>
                  <Tooltip title={'View on Explorer'} placement='top'>
                  <a href={`${ETHERSCAN_API_URL(currentChainId)}/address/${data.address}`} target='_blank'>
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
                <Box mr={3}>
                  <a href={`/dashboard/token/${data.baseCurrency?.address}`}>
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
                component='h3'
                fontWeight={Fonts.BOLD}
                style={{color: color, marginTop: 13}}
                fontSize={20}>
                ${/* {props.data.priceUsd.toFixed(4)} */}
                {data.priceUsd?.toFixed(4)}
              </Box>
            </Box>
            <Box display='flex'>
              <Box
                component='h3'
                fontWeight={Fonts.LIGHT}
                style={{color: color}}
                fontSize={13}>
                (24h {data.priceChange.toFixed(2)}%)
              </Box>
              <Box
                component='h3'
                fontWeight={Fonts.LIGHT}
                style={{color: 'text.primary', marginLeft: 10}}
                fontSize={13}>
                {data.quotePrice?.toFixed(8)} {data.quoteCurrency?.symbol}
              </Box>
            </Box>

            <Box pt={{md: 2, lg: 3, xl: 6}}>
              {data && <CoinsInfo coins={coinInfoFactory(data)} />}
            </Box>
          </Box>
        )}
      </AppCard>
    </Box>
  );
};

export default Info;
