import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  RouteComponentProps,
  useHistory,
  Link as RouterLink,
} from 'react-router-dom';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';

import BitqueryTVChartContainer from 'shared/components/chart/BitqueryTVChart/tv_chart';
import {EXCHANGE, EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';

import {useTokenInfo} from 'hooks/useTokenInfo';
import {AppContext} from '@crema';
import {Skeleton} from '@material-ui/lab';

import AppContextPropsType from 'types/AppContextPropsType';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoinTools from 'shared/components/CoinTools';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {Analytics} from '../components/analytics';
import {useTokenMarket} from 'hooks/protocolExplorer/useTokenMarket';
import {ReactComponent as GraphicsIcon} from '../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../assets/images/icons/arrow-down.svg';
import {Pairs} from '../components/pairs';

import {useStyles} from './index.style';
import {TokenFilterProvider} from 'providers/protocol/tokenFilterProvider';
import TokenCard from 'shared/components/TokenCard';
import TokenLogo from 'shared/components/TokenLogo';
import {useFavoritesWithMarket} from 'hooks/useFavoritesWithMarket';
import {useDispatch} from 'react-redux';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import SelectTokenDialog from 'modules/Dashboard/Token/BuySell/Modal/SelectTokenDialog';
import {Token} from 'types/app';
import {useTokenLists} from 'hooks/useTokenLists';
import FavoriteListItem from 'shared/components/FavoriteListItem';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';
import {watchAsset} from 'utils/wallet';
import {useWeb3} from 'hooks/useWeb3';

type Params = {
  address: string;
};

type TokenProps = RouteComponentProps<Params> & PropsWithChildren<Params>;

const Explorer: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;
  const {getProvider} = useWeb3();
  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles();

  const {
    isFavorite,
    onToggleFavorite,
    loading: favoritesWithMarketLoading,
    data: favoritesWithMarket,
  } = useFavoritesWithMarket();

  const {address} = params;
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const balances = useAllBalance();
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      EthereumNetwork.ethereum,
  );
  const {tokenInfo, loading: loadingToken} = useTokenInfo(address);
  const {loading: loadingTokenMarket, data: tokenMarket, priceQuote} = useTokenMarket(
    networkName,
    EXCHANGE.ALL,
    tokenInfo,
  );
  

  useEffect(() => {
    if (searchParams.get('network') !== networkName) {
      setNetworkName(
        (searchParams.get('network') as EthereumNetwork) ??
          EthereumNetwork.ethereum,
      );
    }
  }, [history.location.search]);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const {data, loading, error} = useCoingeckoTokenInfo(address, networkName);

  const onMakeFavorite = () => {
    if (tokenInfo && data) {
      dispatch(toggleFavoriteCoin({...tokenInfo, ...data}));
    }
  };

  const {theme: cremaTheme} = useContext<AppContextPropsType>(AppContext);
  const isDark = cremaTheme.palette.type === ThemeMode.DARK;

  const Chart = (
    <Paper className={classes.paperChart}>
      {loadingToken || !tokenInfo ? (
        <Grid item xs={12} md={12} style={{height: 450}}>
          <Skeleton variant='rect' height={450} />
        </Grid>
      ) : (
        tokenInfo && (
          <Grid item xs={12} md={12} style={{height: 450}}>
            <BitqueryTVChartContainer
              symbol={`${networkName}:${tokenInfo.symbol.toUpperCase()}:${
                tokenInfo.address
              }`}
              darkMode={isDark}
            />
          </Grid>
        )
      )}
    </Paper>
  );

  const [showSelectTokens, setShowSelectTokens] = useState(false);

  const {binanceTokens, ethTokens, maticTokens} = useTokenLists();

  const handleToggleSelectToken = useCallback(() => {
    setShowSelectTokens((value) => !value);
  }, []);

  const handleAddToken = useCallback(() => {
    if (tokenInfo) {
      watchAsset(getProvider(), {
        address: tokenInfo?.address,
        decimals: tokenInfo?.decimals,
        image: tokenInfo?.logoURI || '',
        symbol: tokenInfo?.symbol,
      });
    }
  }, [getProvider, tokenInfo]);

  const handleSelectToken = useCallback((token: Token) => {
    setShowSelectTokens(false);

    let isEthereum = token.symbol.toUpperCase() === 'ETH';
    let isPolygon = token.symbol.toUpperCase() === 'MATIC';
    let isBsc = token.symbol.toUpperCase() === 'BNB';

    if (isEthereum) {
      history.push(`/explorer/eth?network=${token?.networkName}`);
    } else if (isPolygon) {
      history.push(`/explorer/matic?network=${token?.networkName}`);
    } else if (isBsc) {
      history.push(`/explorer/bnb?network=${token?.networkName}`);
    } else {
      history.push(`/explorer/${token.address}?network=${token?.networkName}`);
    }
  }, []);

  const handleEthereum = useCallback(() => {
    history.push(
      `/explorer/${data?.platforms?.ethereum}?network=${EthereumNetwork.ethereum}`,
    );
  }, [history, data]);
  const handleBsc = useCallback(() => {
    history.push(
      `/explorer/${data?.platforms?.['binance-smart-chain']}?network=${EthereumNetwork.bsc}`,
    );
  }, [history, data]);
  const handlePolygon = useCallback(() => {
    history.push(
      `/explorer/${data?.platforms?.['polygon-pos']}?network=${EthereumNetwork.matic}`,
    );
  }, [history, data]);

  return (
    <>
      {ethTokens && maticTokens && binanceTokens ? (
        <SelectTokenDialog
          title='Select a token'
          open={showSelectTokens}
          tokens={[...ethTokens, ...maticTokens, ...binanceTokens]}
          onSelectToken={handleSelectToken}
          onClose={handleToggleSelectToken}
        />
      ) : null}
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container justify='space-between' alignItems='center'>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Breadcrumbs aria-label='breadcrumb'>
                      <Typography variant='body2' color='textSecondary'>
                        Home
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Explorer
                      </Typography>
                    </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <Typography variant='h6'>Explorer</Typography>
                      </Grid>
                      {data?.platforms?.ethereum ? (
                        <Grid item>
                          <Chip
                            size='small'
                            label='ETH'
                            variant={
                              networkName === EthereumNetwork.ethereum
                                ? 'default'
                                : 'outlined'
                            }
                            onClick={handleEthereum}
                          />
                        </Grid>
                      ) : null}
                      {data?.platforms?.['binance-smart-chain'] ? (
                        <Grid item>
                          <Chip
                            size='small'
                            label='BSC'
                            variant={
                              networkName === EthereumNetwork.bsc
                                ? 'default'
                                : 'outlined'
                            }
                            onClick={handleBsc}
                          />
                        </Grid>
                      ) : null}
                      {data?.platforms?.['polygon-pos'] ? (
                        <Grid item>
                          <Chip
                            size='small'
                            label='MATIC'
                            variant={
                              networkName === EthereumNetwork.matic
                                ? 'default'
                                : 'outlined'
                            }
                            onClick={handlePolygon}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              justify='space-between'
              alignItems='center'
              spacing={2}>
              <Grid item xs={12} md={6}>
                {loadingToken || !tokenInfo || !tokenMarket ? (
                  <Paper>
                    <Box p={4}>
                      <Grid container spacing={4}>
                        <Grid item>
                          <Skeleton
                            variant='circle'
                            width={theme.spacing(8)}
                            height={theme.spacing(8)}
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant='body1'>
                            <Skeleton width={theme.spacing(24)} />
                          </Typography>
                          <Typography variant='body2'>
                            <Skeleton width={theme.spacing(16)} />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                ) : (
                  <TokenCard
                    icon={
                      <TokenLogo
                        token0={tokenInfo?.address || ''}
                        networkName={networkName}
                      />
                    }
                    pair={tokenInfo?.symbol as string}
                    amount={priceQuote?.price as string}
                    onClick={handleToggleSelectToken}
                    coinInfo={data}
                    networkName={networkName}
                    price24Change={
                      data?.market_data?.price_change_percentage_24h || 0
                    }
                    onAddToken={!isMobile ? handleAddToken : undefined}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : undefined}>
                {balances.data && (
                  <CoinTools
                    isFavorite={isFavorite(tokenInfo)}
                    onMakeFavorite={onMakeFavorite}
                    balances={balances.data}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='body1' style={{fontWeight: 600}}>
                      Favorites
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          {favoritesWithMarketLoading ? (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                              <Grid item xs={12}>
                                <TokenListItemSkeleton />
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              {favoritesWithMarket
                                .slice(0, 5)
                                .map((favorite, index) => (
                                  <Grid item xs={12} key={index}>
                                    <FavoriteListItem
                                      variant='outlined'
                                      coin={favorite.coin}
                                      amount={
                                        favorite.market?.current_price || 0
                                      }
                                      dayChange={
                                        favorite.market
                                          ?.price_change_percentage_24h || 0
                                      }
                                    />
                                  </Grid>
                                ))}
                            </Grid>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            to='/favorite-coins'
                            component={RouterLink}
                            size='small'
                            endIcon={<KeyboardArrowRightIcon />}>
                            View more
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} md={4}>
                <Analytics
                  token={tokenInfo}
                  tokenMarket={tokenMarket}
                  loading={loadingToken || loadingTokenMarket}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                {isMobile ? (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDownIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'>
                      <Typography>
                        <GraphicsIcon /> Chart
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>{Chart}</AccordionDetails>
                  </Accordion>
                ) : (
                  Chart
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <TokenFilterProvider>
              <Pairs
                baseAddress={address}
                networkName={networkName}
                exchange={EXCHANGE.ALL}
              />
            </TokenFilterProvider>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Explorer;
