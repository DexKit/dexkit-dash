import React from 'react';
import {BalanceCoins} from 'types/models/Crypto';
import { ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import {Box, Avatar, Tooltip, Fade, Link} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import TokenLogo from 'shared/components/TokenLogo';
import {useStyles} from './index.style';
import CoinsInfo from './CoinsInfo';
import LoadingInfo from './LoadingInfo';
import {Link as RouterLink} from 'react-router-dom';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import { useUSDFormatter } from 'hooks/utils/useUSDFormatter';
import { Token } from 'types/app';
import { FavoriteButton } from 'shared/components/FavoriteButton';
interface Props {
  data?: any;
  token: Token;
  loading: boolean;
  networkName: EthereumNetwork;
}



const coinInfoFactory = (propsData: any, usdFormatter: any, token: Token): BalanceCoins[] => {

  const dailyUSD = usdFormatter.format(propsData?.volume24Usd || 0)

  return [
    {
      id: 1,
      name: 'Daily Volume',
      // value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`,
      value: dailyUSD,
    },
    {
      id: 2,
      name: 'Total Trades (24 hrs)',
      // value: `${propsData?.totalTrades.toFixed(0)}` ?? `0`,
      value: `${propsData?.trades?.toFixed(0)}` ?? `0`,
    },
    {
      id: 3,
      name: `Amount ${token?.symbol.toUpperCase() ?? '?'} (24 hrs)`,
      value: propsData?.volume24Base?.toFixed(2) ?? 0,
    },
  ];
};

const InfoToken: React.FC<Props> = (props) => {
  const {data, loading, networkName, token} = props;
  const {usdFormatter}  = useUSDFormatter()
  const classes = useStyles();
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
            fontWeight={Fonts.BOLD}></Box>

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
                      <TokenLogo
                        token0={token?.address || ''}
                      />
                      <Box
                        component='h3'
                        color='text.primary'
                        fontWeight={Fonts.BOLD}
                        fontSize={20}
                        mr={2}>
                          
                        {token?.symbol?.toUpperCase()}/USD              
                      </Box>
                      <Box>
                        <FavoriteButton token={token}/>
                      </Box>
                    </Box>
                    <Box display='flex'>
                      <Box mr={3}>
                        <Tooltip title={'View on Explorer'} placement='top'>
                          <a
                            href={`${ETHERSCAN_API_URL_FROM_NETWORK(
                              networkName,
                            )}/address/${token.address}`}
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
                      <Box mr={3}>
                        <Link
                          to={`/${networkName}/dashboard/token/${token?.address}`}
                          component={RouterLink} 
                          >
                           <Tooltip title={'Trade Token'} placement='top'>
                            <Avatar
                              style={{
                                color: '#3F51B5',
                                backgroundColor: 'white',
                                width: 34,
                                height: 34,
                              }}>
                              <CompareArrowsIcon/>
                            </Avatar>
                          </Tooltip>
                        </Link>
                      </Box>
                    </Box>
                  </Box>

                  <Box display='flex' alignItems='center'>
                    <Tooltip title={'Real Time Price from all DEX\'s'} placement='top'>
                        <Box
                          component='h3'
                          fontWeight={Fonts.BOLD}
                          style={{ marginTop: 13}}
                          fontSize={20}>
                        
                            {usdFormatter.format(data.priceUsd || 0)}
                    
                        </Box>
                      </Tooltip>
                   </Box>
                   {data.priceChange &&  <Box display='flex'>
                    <Box
                      component='h3'
                      fontWeight={Fonts.LIGHT}
                      style={{color: color}}
                      fontSize={13}>
                      (24h {data.priceChange?.toFixed(2)}%)
                    </Box>
                  </Box>}

                  <Box pt={{md: 2, lg: 3, xl: 6}}>
                    {data && <CoinsInfo coins={coinInfoFactory(data, usdFormatter, token)} />}
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
