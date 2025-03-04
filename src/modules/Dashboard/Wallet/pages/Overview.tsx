import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  Grid,
  Box,
  IconButton,
  Tooltip,
  Card,
  Breadcrumbs,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from '@material-ui/core';

import {RouteComponentProps, useHistory} from 'react-router-dom';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {Token} from 'types/app';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useTokenInfo} from 'hooks/useTokenInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {ShareButton} from 'shared/components/ShareButton';

import {ReactComponent as GraphicsIcon} from '../../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../../assets/images/icons/arrow-down.svg';
import {ReactComponent as ArrowLeftIcon} from '../../../../assets/images/icons/arrow-left.svg';
import {useStyles} from './Overview.style';
import BuySell from 'modules/Dashboard/Token/BuySell';
import Charts from 'modules/Dashboard/Token/Charts';
import HistoryTables from 'modules/Dashboard/Token/HistoryTables';
import TokenCard from 'shared/components/TokenCard';
import CoinTools from 'shared/components/CoinTools';
import {TokenAnalytics} from 'modules/Dashboard/Token/Analytics';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {InfoTab} from 'modules/Dashboard/Token/Tabs/InfoTab';
import {useTokenList} from 'hooks/useTokenList';
import {useTokenLists} from 'hooks/useTokenLists';
import SelectTokenDialog from 'modules/Dashboard/Token/BuySell/Modal/SelectTokenDialog';
import TokenLogo from 'shared/components/TokenLogo';
import {watchAsset} from 'utils/wallet';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const WalletOverviewPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
  const {getProvider} = useWeb3();

  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );
  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account: string | undefined = defaultAccount || web3Account || '';
  const {data: balances} = useAllBalance(account);
  const {tokenInfo} = useTokenInfo(address);
  const [token, setToken] = useState<Token>();
  const priceUSD = useTokenPriceUSD(
    address,
    networkName,
    undefined,
    1,
    token?.decimals,
  );
  const {data, loading, error} = useCoingeckoTokenInfo(address, networkName);
  const classes = useStyles();
  const history = useHistory();
  const onToggleFavorite = () => {
    if (token && data) {
      dispatch(toggleFavoriteCoin({...token, ...data}));
    }
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const isFavorite = useMemo(() => {
    if (token) {
      return (
        favoriteCoins.findIndex(
          (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
        ) > -1
      );
    } else {
      return false;
    }
  }, [favoriteCoins, token]);

  useEffect(() => {
    if (tokenInfo && tokenInfo.symbol) {
      setToken({
        address: address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol.toUpperCase(),
        decimals: tokenInfo.decimals,
        chainId: tokenInfo.chainId,
        coingecko_id: tokenInfo.coingecko_id,
      });
    }
  }, [tokenInfo, address]);

  const infoMyTakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`,
  );
  const infoMyMakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`,
  );

  useEffect(() => {
    if (account) {
      infoMyTakerOrders.get(`?trader=${account}&takerToken=${address}`);
      infoMyMakerOrders.get(`?trader=${account}&makerToken=${address}`);
    }
  }, [account, address]);

  const handleBack = useCallback(() => history.push(`/wallet/`), []);

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
      history.push(`/wallet/overview/${token.networkName}/eth`);
    } else if (isPolygon) {
      history.push(`/wallet/overview/${token.networkName}/matic`);
    } else if (isBsc) {
      history.push(`/wallet/overview/${token.networkName}/bnb`);
    } else {
      history.push(`/wallet/overview/${token.networkName}/${token.address}`);
    }
  }, []);

  const handleEthereum = useCallback(() => {
    history.push(
      `/wallet/overview/${EthereumNetwork.ethereum}/${data?.platforms?.ethereum}`,
    );
  }, [history, data]);

  const handleBsc = useCallback(() => {
    history.push(
      `/wallet/overview/${EthereumNetwork.bsc}/${data?.platforms?.['binance-smart-chain']}`,
    );
  }, [history, data]);

  const handlePolygon = useCallback(() => {
    history.push(
      `/wallet/overview/${EthereumNetwork.matic}/${data?.platforms?.['polygon-pos']}`,
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

      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid
              container
              justify='space-between'
              alignItems='center'
              spacing={2}>
              <Grid item xs={12}>
                <Breadcrumbs aria-label='breadcrumb'>
                  <Typography variant='body2' color='textSecondary'>
                    Wallet
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Overview
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {tokenInfo?.symbol}
                  </Typography>
                </Breadcrumbs>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item>
                    <IconButton onClick={handleBack} size='small'>
                      <ArrowLeftIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <Typography variant='h6'>Overview</Typography>
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
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container justify='space-between' alignItems='center'>
                  <Grid item xs={12} sm={4}>
                    {tokenInfo && (
                      <TokenCard
                        icon={
                          <TokenLogo
                            token0={tokenInfo?.address || ''}
                            networkName={networkName}
                          />
                        }
                        pair={tokenInfo?.symbol}
                        amount={priceUSD?.priceQuote?.price || 0}
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
                    <CoinTools
                      onMakeFavorite={onToggleFavorite}
                      isFavorite={isFavorite}
                      balances={balances}
                      token={tokenInfo}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {token && (
              <TokenAnalytics
                account={account}
                token={token.address}
                networkName={networkName}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {isMobile ? (
                <>
                  <Grid item xs={12}>
                    <Card>
                      <BuySell
                        tokenAddress={address}
                        balances={balances}
                        networkName={networkName}
                        tokenInfo={tokenInfo}
                        disableReceive
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ArrowDownIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'>
                        <Typography>
                          <GraphicsIcon /> Charts
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {tokenInfo && (
                          <Charts
                            chainId={chainId}
                            tokenInfo={tokenInfo}
                            networkName={networkName}
                          />
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <HistoryTables
                      account={account}
                      networkName={networkName}
                      address={address}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={8}>
                    {tokenInfo && (
                      <Charts
                        chainId={chainId}
                        tokenInfo={tokenInfo}
                        networkName={networkName}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <BuySell
                        tokenAddress={address}
                        balances={balances}
                        networkName={networkName}
                        tokenInfo={tokenInfo}
                        // Flag to disable receive
                        disableReceive={true}
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <InfoTab error={error} loading={loading} data={data} />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <HistoryTables
                      account={account}
                      networkName={networkName}
                      address={address}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WalletOverviewPage;
