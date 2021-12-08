import React, {useState, useMemo} from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import FormControl from '@material-ui/core/FormControl';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';

import LinkIcon from '@material-ui/icons/CallMadeOutlined';

import {useIntl} from 'react-intl';

import {Link as RouterLink} from 'react-router-dom';
import AffiliateTotalCard from './components/AffiliateTotalCard';
import AffiliateTotalCardSkeleton from './components/AffiliateTotalCard/index.skeleton';
import {Skeleton} from '@material-ui/lab';
import AffiliateHistory from './history';
import {GridContainer} from '@crema';
import ButtonCopy from 'shared/components/ButtonCopy';
import {useWeb3} from 'hooks/useWeb3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useAffiliateEntries, useAffiliatePlayer} from 'modules/CoinLeagues/hooks/useAffiliate';
import {
  COINLEAGUENFT_ROUTE,
  COINSLEAGUE_ROUTE,
  BASE_PATH_ROUTE,
} from 'shared/constants/routes';
import {AFFILIATE_FIELD} from 'modules/CoinLeagues/constants';
import { RoomType } from 'modules/CoinLeagues/constants/enums';
import { ethers } from 'ethers';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    backgroundColor: '#1F1D2B',
  },
  affiliateCard: {
    borderRadius: 6,
    margin: theme.spacing(0),
    padding: theme.spacing(1),
    backgroundColor: '#252836',
  },
  field: {
    padding: theme.spacing(2),
    border: '1px solid #525C75',
    borderRadius: 5,
    height: theme.spacing(16),
  },
  settingsBtn: {
    color: '#fff',
  },
  affiliateLink: {
    height: theme.spacing(5),
  },
}));

const AffiliatePage: React.FC = () => {
  const classes = useStyles();
  const {messages} = useIntl();

  const {account: web3Account} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = web3Account || defaultAccount;

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const onChangePage = (p: number) => setPage(p);
  const onChangeRowsPerPage = (p: number) => setRowsPerPage(p);

  const [room, setRoom] = useState(RoomType.Main);
  const isNFT = room === RoomType.Main ? false : true;
  const {loading, data} = useAffiliateEntries(
    {address: account?.toLowerCase() ?? '', first: rowsPerPage, skip: page * rowsPerPage},
    isNFT,
  );

  const queryPlayer = useAffiliatePlayer(
   account?.toLowerCase() ?? '',
    isNFT,
  );

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
    if (room === RoomType.Main) {
      return `${COINSLEAGUE_ROUTE}?${AFFILIATE_FIELD}=${account}`;
    }
    if (room === RoomType.NFT) {
      return `${COINLEAGUENFT_ROUTE}?${AFFILIATE_FIELD}=${account}`;
    }
    return '';
  }, [room, account]);

  const affiliateLink = `${BASE_PATH_ROUTE}${selectedRoom}`;

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container spacing={6} alignItems={'center'}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <Link to={COINSLEAGUE_ROUTE} component={RouterLink}>
              <Typography variant='body2' color='textSecondary'>
                CoinLeague
              </Typography>
            </Link>
            <Typography variant='body2'>
              {messages['affiliate.page.title']}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Typography variant='h5' style={{margin: 5, marginBottom: 20}}>
            {messages['coinleague.affiliate.page.title']}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent='space-between' spacing={4}>
            <Grid item xs={12} md={4}>
              {queryPlayer.loading ? <AffiliateTotalCardSkeleton/> :
              <AffiliateTotalCard total={ethers.utils.formatEther(queryPlayer.data?.player?.estimatedAffiliateEarnings || '0')} />}
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography style={{color: '#B3B7C0'}}>
                    Account Receive Rewards:
                  </Typography>
                </Grid>
                <Grid item md={11} xs={10}>
                  <Typography variant='body2' noWrap>
                    {account}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4} className={classes.affiliateCard}>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography variant='h5'>Affiliate</Typography>
              </Grid>
            </Grid>

            <Divider
              variant='middle'
              style={{
                background: '#525C75',
                width: '100%',
                padding: 1,
                margin: '10px auto',
              }}
            />

            <Grid item md={12} xs={12}>
              <GridContainer spacing={2} justifyContent='space-between'>
                <Grid item md={5} xs={12} style={{marginBottom: 10}}>
                  <FormControl fullWidth>
                    <Typography style={{marginBottom: 10}}>Room</Typography>
                    <Select
                      variant='outlined'
                      value={room}
                      onChange={(e) => setRoom(e.target.value as RoomType)}
                      renderValue={(value) => <> {value}</>}>
                      <MenuItem value={RoomType.Main}>Main</MenuItem>
                      <MenuItem value={RoomType.NFT}>NFT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={7} xs={12}>
                  <Typography style={{marginBottom: 10}}>
                    Affiliate link
                  </Typography>
                  <Box
                    className={classes.field}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography
                      noWrap
                      variant={'body1'}
                      className={classes.affiliateLink}>
                      {affiliateLink}
                    </Typography>
                    <ButtonCopy
                      copyText={affiliateLink}
                      titleText='Copied to clipbord!'
                    />
                  </Box>
                </Grid>
              </GridContainer>
            </Grid>

            <GridContainer justifyContent='flex-end'>
              <Grid item md={5} xs={12}>
                <Button
                  fullWidth
                  href={affiliateLink}
                  target='_blank'
                  style={{
                    backgroundColor: '#FFA552',
                    marginBottom: 15,
                    color: 'black',
                    maxWidth: '200px',
                  }}>
                  <LinkIcon />
                  OPEN Room
                </Button>
              </Grid>
            </GridContainer>
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
    </Container>
  );
};

export default AffiliatePage;
