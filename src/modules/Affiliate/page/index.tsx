import React, {useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

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

import {Link as RouterLink} from 'react-router-dom';
import AffiliateTotalCard from '../components/AffiliateTotalCard';
import {useWeb3} from '../../../hooks/useWeb3';
import {useDefaultAccount} from '../../../hooks/useDefaultAccount';
import {useAffiliateTrades} from '../../../hooks/affiliate/useAffiliateTrades';
import {useTokenBalancesAffiliate} from '../../../hooks/affiliate/useTokenBalances';
import {Skeleton} from '@material-ui/lab';
import AffiliateHistory from '../history';
import ButtonCopy from 'shared/components/ButtonCopy';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {ChainId} from 'types/blockchain';
import {GET_CHAIN_ID_NAME} from 'shared/constants/Blockchain';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
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

const AffiliatePage: React.FC = () => {
  const classes = useStyles();
  const {messages} = useIntl();

  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const [chain, setChain] = useState(GET_CHAIN_ID_NAME(chainId));

  const selectedChainId = useMemo(() => {
    if (chain === 'ETH') {
      return ChainId.Mainnet;
    }
    if (chain === 'BSC') {
      return ChainId.Binance;
    }

    if (chain === 'MATIC') {
      return ChainId.Matic;
    }
    return ChainId.Mainnet;
  }, [chain]);

  const {
    loading,
    data,
    total,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    valueTotalUSD,
  } = useAffiliateTrades(account ?? '', selectedChainId);

  const {kitBalance} = useTokenBalancesAffiliate(
    account ?? '',
    selectedChainId,
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
  const selectedChain = useMemo(() => {
    if (chain === 'ETH') {
      return '';
    }
    if (chain === 'BSC') {
      return 'bsc/';
    }

    if (chain === 'MATIC') {
      return 'matic/';
    }
    return '';
  }, [chain]);

  const affiliateLink = `https://swap.dexkit.com/#/${selectedChain}swap?account=${account}`;

  const kitValue = Number(kitBalance && kitBalance.value?.toFixed(3)) || 0;

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Breadcrumbs>
            <Link to='/wallet' component={RouterLink}>
              <Typography variant='body2' color='textSecondary'>
                <IntlMessages id='app.affiliate.page.dashboard' />
              </Typography>
            </Link>
            <Typography variant='body2' style={{color: '#2e3243'}}>
              <IntlMessages id='app.affiliate.page.title' />
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} sm={10} alignContent='center'>
          <Typography variant='h5' style={{margin: 5, marginBottom: 20}}>
            <IntlMessages id='app.affiliate.page.title' />
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={5}
        style={{marginBottom: 20}}
        justifyContent='space-between'>
        <Grid item md={6} xs={12}>
          <AffiliateTotalCard total={valueTotalUSD || 0} />
        </Grid>
        <Grid item md={4} xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography style={{color: '#B3B7C0'}}>
                <IntlMessages id='app.affiliate.page.account' />:
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

      <Grid container spacing={4} className={classes.affiliateCard}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5'>
                <IntlMessages id='app.affiliate.affiliate' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' style={{color: '#B3B7C0'}}>
                You need to have 200 KIT in your wallet on {chain} network to
                earn money from referrals on {chain} network
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LinearProgressWithLabel to={200} from={kitValue} />
            </Grid>
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
          <Grid container spacing={2} justifyContent='space-between'>
            <Grid item md={5} xs={12} style={{marginBottom: 10}}>
              <FormControl fullWidth>
                <Typography style={{marginBottom: 10}}>
                  <IntlMessages id='app.affiliate.page.swap.chain' />
                </Typography>
                <Select
                  variant='outlined'
                  value={chain}
                  onChange={(e) => setChain(e.target.value as string)}
                  renderValue={(value) => <> {value}</>}>
                  <MenuItem value='BSC'>BSC</MenuItem>
                  <MenuItem value='ETH'>ETH</MenuItem>
                  <MenuItem value='MATIC'>MATIC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={7} xs={12}>
              <Typography style={{marginBottom: 10}}>
                <IntlMessages id='app.affiliate.page.swap.link' />
              </Typography>
              <Box
                className={classes.field}
                display='flex'
                alignItems='center'
                justifyContent='space-between'>
                <Typography noWrap>{affiliateLink}</Typography>
                <ButtonCopy
                  copyText={affiliateLink}
                  titleText={messages['shared.copiedClipboard'] as string}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent='flex-end'>
          <Grid item md={5} xs={12}>
            <Button
              fullWidth
              href={affiliateLink}
              target='_blank'
              style={{backgroundColor: '#FFA552', marginBottom: 15}}>
              <LinkIcon />
              <IntlMessages id='app.affiliate.page.swap.openBtn' />
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Divider
        style={{
          backgroundColor: '#525C75',
          width: '95%',
          padding: 1,
          margin: '20px auto',
        }}
      />

      <Grid container spacing={2} style={{marginTop: 15}}>
        {/* FIXME: Change to the pagination component */}
        <Grid item xs={12}>
          {loading ? (
            <AffiliateSkeleton />
          ) : (
            <AffiliateHistory
              transactionData={data}
              isLoading={loading}
              total={total ?? 0}
              page={page}
              perPage={rowsPerPage}
              onChangePage={onChangePage}
              onChangePerPage={onChangeRowsPerPage}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AffiliatePage;
