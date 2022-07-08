import React, {useState, useMemo, useCallback} from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import FormControl from '@material-ui/core/FormControl';

import LinkIcon from '@material-ui/icons/CallMadeOutlined';

import {useIntl} from 'react-intl';

import {useHistory} from 'react-router-dom';
import AffiliateTotalCard from './components/AffiliateTotalCard';
import {Skeleton} from '@material-ui/lab';
import AffiliateHistory from './history';
import ButtonCopy from 'shared/components/ButtonCopy';
import {useWeb3} from 'hooks/useWeb3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {
  useAffiliateEntries,
  useAffiliatePlayer,
} from 'modules/CoinLeague/hooks/useAffiliate';
import {
  COINLEAGUENFT_ROUTE,
  COINSLEAGUE_ROUTE,
  BASE_PATH_ROUTE,
} from 'shared/constants/routes';
import {AFFILIATE_FIELD} from 'modules/CoinLeague/constants';
import {RoomType} from 'modules/CoinLeague/constants/enums';
import {ethers} from 'ethers';
import {ChainSelect} from 'modules/CoinLeague/components/ChainSelect';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import IntlMessages from '@crema/utility/IntlMessages';
import {InputAdornment, InputLabel, Paper, TextField} from '@material-ui/core';
import {isAddress} from 'utils/ethers';
import {truncateAddress} from 'utils';

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {useCoinToPlayStable} from 'modules/CoinLeague/hooks/useCoinToPlay';

const AffiliatePage: React.FC = () => {
  const history = useHistory();
  const {messages} = useIntl();

  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = web3Account || defaultAccount;
  const coinToPlay = useCoinToPlayStable(chainId);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const onChangePage = (p: number) => setPage(p);
  const onChangeRowsPerPage = (p: number) => setRowsPerPage(p);

  const [room, setRoom] = useState(RoomType.Stable);
  const isNFT = room === RoomType.Stable ? false : true;
  const {loading, data} = useAffiliateEntries(
    {
      address: account?.toLowerCase() ?? '',
      first: rowsPerPage,
      skip: page * rowsPerPage,
    },
    isNFT,
  );
  const {listGamesRoute} = useCoinLeaguesFactoryRoutes(isNFT);
  const queryPlayer = useAffiliatePlayer(account?.toLowerCase() ?? '', isNFT);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(listGamesRoute);
    }
    //history.push(listGamesRoute);
  }, [listGamesRoute, history]);

  const AffiliateSkeleton = (props: any) => (
    <React.Fragment {...props}>
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
    </React.Fragment>
  );
  const selectedRoom = useMemo(() => {
    if (room === RoomType.Stable) {
      return `${COINSLEAGUE_ROUTE}?${AFFILIATE_FIELD}=${account}`;
    }
    if (room === RoomType.NFT) {
      return `${COINLEAGUENFT_ROUTE}?${AFFILIATE_FIELD}=${account}`;
    }
    return '';
  }, [room, account]);

  const affiliateLink = `${BASE_PATH_ROUTE}${selectedRoom}`;

  return (
    <Box py={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={10}>
          <Box display='flex' alignItems={'center'}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h5'>
              {messages['coinleague.affiliate.page.title']}
            </Typography>
            <Box p={2}>
              <ChainSelect />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <AffiliateTotalCard
                    loading={queryPlayer.loading}
                    total={ethers.utils.formatUnits(
                      queryPlayer.data?.player?.estimatedAffiliateEarnings ||
                        '0',
                      coinToPlay?.decimals,
                    )}
                    coinSymbol={coinToPlay?.symbol.toUpperCase() || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box p={4} component={Paper}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Box
                          display='flex'
                          alignItems='center'
                          alignContent='center'>
                          <AccountBalanceWalletIcon style={{fontSize: 50}} />
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <Typography variant='caption' color='textSecondary'>
                          <IntlMessages
                            id='coinLeague.affiliateAddress'
                            defaultMessage='Affiliate Address'
                          />
                        </Typography>
                        <Typography variant='h5' noWrap>
                          {isAddress(account) ? (
                            truncateAddress(account)
                          ) : (
                            <Skeleton />
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box p={4} component={Paper}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant='outlined'>
                      <InputLabel>
                        <IntlMessages
                          id='coinLeague.room'
                          defaultMessage='Room'
                        />
                      </InputLabel>
                      <Select
                        variant='outlined'
                        value={room}
                        label={
                          <IntlMessages
                            id='coinLeague.room'
                            defaultMessage='Room'
                          />
                        }
                        onChange={(e) => setRoom(e.target.value as RoomType)}
                        renderValue={(value) => <> {value}</>}>
                        <MenuItem value={RoomType.Stable}>Main</MenuItem>
                        {/*<MenuItem value={RoomType.NFT}>NFT</MenuItem>*/}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      variant='outlined'
                      label='Afilliate link'
                      fullWidth
                      value={affiliateLink}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <ButtonCopy
                              copyText={affiliateLink}
                              titleText='Copied to clipbord!'
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      fullWidth
                      size='large'
                      href={affiliateLink}
                      target='_blank'
                      startIcon={<LinkIcon />}>
                      <IntlMessages
                        id='coinLeague.open'
                        defaultMessage='Open'
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} style={{marginTop: 15}}>
            {/* FIXME: Change to the pagination component */}
            <Grid item xs={12}>
              {loading ? (
                <AffiliateSkeleton />
              ) : (
                <AffiliateHistory
                  data={data?.affiliates}
                  isLoading={loading}
                  total={data?.affiliates.length}
                  page={page}
                  isNFT={isNFT}
                  perPage={rowsPerPage}
                  onChangePage={onChangePage}
                  onChangePerPage={onChangeRowsPerPage}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AffiliatePage;
