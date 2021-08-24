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
} from '@material-ui/core';

import {RouteComponentProps} from 'react-router-dom';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import BuySell from './BuySell';

import {Token} from 'types/app';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

import HistoryTables from './HistoryTables';
import Charts from './Charts';
import {useTokenInfo} from 'hooks/useTokenInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {AboutDialog} from './AboutDialog';
import {ShareButton} from 'shared/components/ShareButton';
import InfoIcon from '@material-ui/icons/Info';
import {ReactComponent as GraphicsIcon} from '../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../assets/images/icons/arrow-down.svg';
import {useStyles} from './index.style'

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const TokenTabsPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
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
  const {data} = useCoingeckoTokenInfo(address, networkName);
  const classes = useStyles();

  const onToggleFavorite = () => {
    if (token && data) {
      dispatch(toggleFavoriteCoin({...token, ...data}));
    }
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const isFavorite = useMemo(() => {
    if (token) {
      return favoriteCoins.find(
        (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
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

  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const handleCloseAboutDialog = useCallback(() => {
    setShowAboutDialog(false);
  }, []);

  const handleOpenAboutDialog = useCallback(() => {
    setShowAboutDialog(true);
  }, []);

  return (
    <>
      <AboutDialog open={showAboutDialog} onClose={handleCloseAboutDialog} />
      <Box py={4} className={isMobile ? classes.mobileContainer : ''}>
        <Box>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Breadcrumbs aria-label='breadcrumb'>
                    <Typography variant='body2' color='textSecondary'>
                      Home
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Trade
                    </Typography>
                  </Breadcrumbs>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <Typography variant='h5'>Trade</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleOpenAboutDialog} size='small'>
                        <InfoIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <ShareButton />
                </Grid>
                <Grid item>
                  <Tooltip title='Add to Favorites'>
                    <IconButton
                      aria-label='add favorite coin'
                      color='primary'
                      onClick={onToggleFavorite}>
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box mt={4}>
          <Grid container spacing={3}>
            {isMobile ? (
              <>
                <Card>
                  <BuySell
                    tokenAddress={address}
                    balances={balances}
                    networkName={networkName}
                    tokenInfo={tokenInfo}
                  />
                </Card>
                <Grid item xs={12} className={classes.mobileChartsContainer}>
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
                      <Charts
                        chainId={chainId}
                        tokenInfo={tokenInfo}
                        networkName={networkName}
                      />
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
                  <Charts
                    chainId={chainId}
                    tokenInfo={tokenInfo}
                    networkName={networkName}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <BuySell
                      tokenAddress={address}
                      balances={balances}
                      networkName={networkName}
                      tokenInfo={tokenInfo}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <HistoryTables
                    account={account}
                    networkName={networkName}
                    address={address}
                  />
                </Grid>
                {/*   <Grid item xs={12}>
                  <InfoTab error={error} loading={loading} data={data} />
                </Grid> */}
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TokenTabsPage;
