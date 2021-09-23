import React, {useEffect, useState, useCallback} from 'react';
import {
  Grid,
  Box,
  IconButton,
  Card,
  Breadcrumbs,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';

import {useHistory} from 'react-router-dom';

import {useWeb3} from 'hooks/useWeb3';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import BuySell from './BuySell';

import {Token} from 'types/app';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

import HistoryTables from './HistoryTables';
import Charts from './Charts';
import {useTokenInfo} from 'hooks/useTokenInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {AboutDialog} from './AboutDialog';
import InfoIcon from '@material-ui/icons/Info';
import {ReactComponent as GraphicsIcon} from '../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../assets/images/icons/arrow-down.svg';
import {useStyles} from './index.style';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {Share} from '@material-ui/icons';
import ShareDialog from 'shared/components/ShareDialog';
import {getWindowUrl} from 'utils/browser';
import {useNetwork} from 'hooks/useNetwork';
import {GET_NATIVE_COIN_FROM_NETWORK_NAME} from 'shared/constants/Bitquery';

const TokenPage = () => {
  const history = useHistory();
  const network = useNetwork();
  const searchParams = new URLSearchParams(history.location.search);
  const networkName = useMemo(() => {
    return (searchParams.get('network') as EthereumNetwork) || network;
  }, [searchParams, network]);

  const address = useMemo(() => {
    return (
      searchParams.get('to') ||
      GET_NATIVE_COIN_FROM_NETWORK_NAME(networkName).toUpperCase()
    );
  }, [searchParams]);

  const tokenFromAddress = useMemo(() => {
    return searchParams.get('from') || '';
  }, [searchParams]);

  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );
  const {account: web3Account, chainId} = useWeb3();

  const defaultAccount = useDefaultAccount();
  const account: string | undefined = defaultAccount || web3Account || '';
  const {data: balances} = useAllBalance(account);
  const {tokenInfo} = useTokenInfo(address);
  const {tokenInfo: tokenFromInfo} = useTokenInfo(tokenFromAddress);
  const [token, setToken] = useState<Token>();
  const {data} = useCoingeckoTokenInfo(address, networkName);
  const classes = useStyles();

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

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

  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const handleCloseAboutDialog = useCallback(() => {
    setShowAboutDialog(false);
  }, []);

  const handleOpenAboutDialog = useCallback(() => {
    setShowAboutDialog(true);
  }, []);

  const [showShareDialog, setShowShareDialog] = useState(false);

  const toggleShare = useCallback(() => {
    setShowShareDialog((value) => !value);
  }, []);

  const onChangeTokens = useCallback(
    (from?: Token, to?: Token) => {
      const searchParams = new URLSearchParams(history.location.search);
      if (from && from.networkName && from.address) {
        searchParams.set('network', from.networkName);
        searchParams.set('from', from.address);
      }
      if (to) {
        if (from && from.networkName && from?.networkName !== to?.networkName) {
          if (from?.networkName) {
            searchParams.set(
              'to',
              GET_NATIVE_COIN_FROM_NETWORK_NAME(
                from?.networkName,
              ).toUpperCase(),
            );
          }
        } else {
          if(to.address){
            searchParams.set('to', to.address);
          }else{
            if(to?.networkName){
              searchParams.set(
                'to',
                GET_NATIVE_COIN_FROM_NETWORK_NAME(
                  to?.networkName ,
                ).toUpperCase(),
              );
            }
          }
         
        }
      }
      history.push({search: searchParams.toString()});
    },
    [history.location.search],
  );

  const shareUrl = useMemo(() => {
    const searchParams = new URLSearchParams(history.location.search);
    return `${getWindowUrl()}/trade?${searchParams.toString()}`;
  }, [history.location.search]);

  return (
    <>
      <AboutDialog open={showAboutDialog} onClose={handleCloseAboutDialog} />
      <ShareDialog
        open={showShareDialog}
        shareText='Sharing token'
        shareUrl={shareUrl}
        onClose={toggleShare}
      />
      <Box py={0} className={isMobile ? classes.mobileContainer : ''}>
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
              <Grid container spacing={4}>
                <Grid item>
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'>
                    <RoundedIconButton onClick={toggleShare}>
                      <Share className={classes.icon} />
                    </RoundedIconButton>
                    <Typography variant='caption'>Share</Typography>
                  </Box>
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
                    tokenFromInfo={tokenFromInfo}
                    onChangeTokens={onChangeTokens}
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
                      tokenFromInfo={tokenFromInfo}
                      onChangeTokens={onChangeTokens}
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

export default TokenPage;
