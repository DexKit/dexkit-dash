import React, {useState, useCallback} from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import FormControl from '@material-ui/core/FormControl';
import LinearProgress from '@material-ui/core/LinearProgress';

import {makeStyles} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LinkIcon from '@material-ui/icons/CallMadeOutlined';

import {useIntl} from 'react-intl';
import {Link, BrowserRouter as Router} from 'react-router-dom';

import AffiliateTotalCard from '../components/AffiliateTotalCard';
import {useUSDFormatter} from '../../../hooks/utils/useUSDFormatter';
import {useWeb3} from '../../../hooks/useWeb3';
import {useDefaultAccount} from '../../../hooks/useDefaultAccount';
import {useAffiliateTrades} from '../../../hooks/affiliate/useAffiliateTrades';
import {useTokenBalancesAffiliate} from '../../../hooks/affiliate/useTokenBalances';
import {Skeleton} from '@material-ui/lab';
import AffiliateHistory from '../history';
import {GridContainer} from '@crema';
import ButtonCopy from 'shared/components/ButtonCopy';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import MyCoinsTable from '../components/MyCoinsTable';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(3),
    backgroundColor: '#1F1D2B',
  },
  affiliateCard: {
    borderRadius: 8,
    padding: theme.spacing(1.5),
    backgroundColor: '#252836',
  },
  field: {
    padding: theme.spacing(1),
    border: '1px solid #525C75',
    borderRadius: 5,
    height: theme.spacing(14),
  },
  settingsBtn: {
    color: '#fff',
  },
}));

function LinearProgressWithLabel(props: {to: number; from: number}) {
  const {to, from} = props;
  const {usdFormatter} = useUSDFormatter();

  return (
    <GridContainer
      md={6}
      xs={12}
      spacing={2}
      style={{
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#2E3243',
      }}>
      <Grid item xs={12}>
        <LinearProgress
          style={{borderRadius: 10}}
          variant='determinate'
          value={(from / (to || 1)) * 100}
        />
      </Grid>

      <Grid container justifyContent='space-between'>
        <Grid item xs={2}>
          <Typography variant='body2' color='inherit'>
            {usdFormatter.format(from)}
          </Typography>
        </Grid>

        <Grid item xs={8} />

        <Grid item xs={2} alignContent='flex-end'>
          <Typography variant='body2' color='inherit'>
            {usdFormatter.format(to)}
          </Typography>
        </Grid>
      </Grid>
    </GridContainer>
  );
}

enum Tabs {
  MyCoins = 'My Coins',
  History = 'History',
}

function AffiliatePage() {
  const classes = useStyles();
  const {messages} = useIntl();

  const {account: web3Account} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const [tab, setTab] = useState<Tabs>(Tabs.MyCoins);

  const handleChange = useCallback(() => {
    if (tab === Tabs.MyCoins) return setTab(Tabs.History);

    return setTab(Tabs.MyCoins);
  }, [tab]);

  const {
    loading,
    data,
    total,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    valueTotalUSD,
  } = useAffiliateTrades(account ?? '');

  const {kitBalance} = useTokenBalancesAffiliate(account ?? '');

  const [chain, setChain] = useState('ETH');

  const AffiliateSkeleton = () => (
    <>
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
      <Skeleton style={{marginBottom: 8}} variant='rect' height={50} />
    </>
  );
  const selectedChain = chain === 'ETH' ? '' : 'bsc/';

  const affiliateLink = `https://swap.dexkit.com/#/${selectedChain}swap?account=${account}`;

  const kitValue = Number(kitBalance && kitBalance.value?.toFixed(3)) || 0;

  return (
    <Container maxWidth='xl' className={classes.container}>
      <GridContainer spacing={2}>
        <Grid container>
          <Router>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.8rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link to='/wallet' style={{textDecoration: 'none'}}>
                <Typography variant='subtitle2'>Dashboard</Typography>
              </Link>
              <Typography variant='subtitle2' style={{color: '#2e3243'}}>
                {messages['affiliate.page.title']}
              </Typography>
            </Breadcrumbs>
          </Router>
        </Grid>
        <Grid container xs={12} sm={10} alignContent='center'>
          <Typography
            variant='h5'
            style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
            {messages['affiliate.page.title']}
          </Typography>
        </Grid>
      </GridContainer>

      <GridContainer
        spacing={5}
        style={{marginBottom: 20}}
        justifyContent='space-between'>
        <Grid item md={7} xs={12}>
          <AffiliateTotalCard total={valueTotalUSD || 0} />
        </Grid>
        <Grid item md={5} xs={12}>
          <GridContainer spacing={2}>
            <Grid item xs={11}>
              <Typography style={{color: '#B3B7C0', marginBottom: 5}}>
                Account Receive Rewards:
              </Typography>
              <Typography>{account}</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton className={classes.settingsBtn}>
                <SettingsIcon fontSize='large' />
              </IconButton>
            </Grid>
          </GridContainer>
        </Grid>
      </GridContainer>

      <GridContainer spacing={4} className={classes.affiliateCard}>
        {kitValue < 200 && (
          <Grid item xs={12}>
            <GridContainer spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h5'>Affiliate</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1' style={{color: '#B3B7C0'}}>
                  You need to have 200 KIT in your wallet to earn money from
                  referrals.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel to={200} from={kitValue} />
              </Grid>
            </GridContainer>
          </Grid>
        )}

        {kitValue < 200 && (
          <Divider
            variant='middle'
            style={{
              background: '#525C75',
              width: '100%',
              padding: 1,
              margin: '10px auto',
            }}
          />
        )}

        <Grid item md={12} xs={12}>
          <GridContainer spacing={2} justifyContent='space-between'>
            <Grid item md={5} xs={12} style={{marginBottom: 10}}>
              <FormControl fullWidth>
                <Typography style={{marginBottom: 10}}>Chain</Typography>
                <Select
                  variant='outlined'
                  value={chain}
                  onChange={(e) => setChain(e.target.value as string)}
                  renderValue={(value) => <> {value}</>}>
                  <MenuItem value='BSC'>BSC</MenuItem>
                  <MenuItem value='ETH'>ETH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={7} xs={12}>
              <Typography style={{marginBottom: 10}}>Affiliate link</Typography>
              <Box
                className={classes.field}
                display='flex'
                alignItems='center'
                justifyContent='space-between'>
                <Typography noWrap>{affiliateLink}</Typography>
                <ButtonCopy
                  copyText={affiliateLink}
                  titleText='Copied to clipbord!'
                />
              </Box>
            </Grid>
          </GridContainer>
        </Grid>

        <Grid item md={5} xs={12}>
          <Button
            fullWidth
            href={affiliateLink}
            target='_blank'
            style={{backgroundColor: '#FFA552', marginBottom: 15}}>
            <LinkIcon />
            OPEN SWAP
          </Button>
        </Grid>
      </GridContainer>

      <Divider
        style={{
          backgroundColor: '#525C75',
          width: '95%',
          padding: 1,
          margin: '20px auto',
        }}
      />

      <Grid container spacing={2} style={{marginTop: 15}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant='h5' style={{fontWeight: 600}}>
                Trade History
              </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <CustomTabs
                value={tab}
                onChange={handleChange}
                variant='fullWidth'
                TabIndicatorProps={{style: {display: 'none'}}}>
                <CustomTab value={Tabs.MyCoins} label={Tabs.MyCoins} />
                <CustomTab value={Tabs.History} label={Tabs.History} />
              </CustomTabs>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{marginTop: 15}}>
        {/* FIXME: Change to the pagination component */}
        <Grid item xs={12}>
          {loading ? (
            <AffiliateSkeleton />
          ) : tab === Tabs.History ? (
            <AffiliateHistory
              transactionData={data}
              isLoading={loading}
              total={total ?? 0}
              page={page}
              perPage={rowsPerPage}
              onChangePage={onChangePage}
              onChangePerPage={onChangeRowsPerPage}
            />
          ) : (
            <MyCoinsTable />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AffiliatePage;
