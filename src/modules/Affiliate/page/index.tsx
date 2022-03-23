import React, {useCallback, useMemo, useState} from 'react';

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

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LinkIcon from '@material-ui/icons/CallMadeOutlined';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import AffiliateTotalCard from '../components/AffiliateTotalCard';
import {useWeb3} from '../../../hooks/useWeb3';
import {useDefaultAccount} from '../../../hooks/useDefaultAccount';
import {useAffiliateTrades} from '../../../hooks/affiliate/useAffiliateTrades';
import {useTokenBalancesAffiliate} from '../../../hooks/affiliate/useTokenBalances';
import {Skeleton} from '@material-ui/lab';
import AffiliateHistory from '../history';
import ButtonCopy from 'shared/components/ButtonCopy';
import AffiliateProgressCard from '../components/LinearProgressWithLabel';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {ChainId} from 'types/blockchain';

import {useChainInfo} from 'hooks/useChainInfo';
import {useMobile} from 'hooks/useMobile';
import {WALLET_ROUTE} from 'shared/constants/routes';
import IconButton from '@material-ui/core/IconButton';
import AffiliateAddressCard from '../components/AffiliateAddressCard';
import {InputAdornment, InputLabel, Paper, TextField} from '@material-ui/core';

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
  const isMobile = useMobile();
  const history = useHistory();
  const classes = useStyles();
  const {messages} = useIntl();

  const {account: web3Account} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const {chainName} = useChainInfo();

  const [chain, setChain] = useState(chainName);

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

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(WALLET_ROUTE);
    }
  }, [history]);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container alignItems='center' alignContent='center' spacing={2}>
            {!isMobile && (
              <Grid item xs={12}>
                <Breadcrumbs>
                  <Link color='inherit' component={RouterLink} to='/wallet'>
                    <IntlMessages id='app.affiliate.page.dashboard' />
                  </Link>
                </Breadcrumbs>
              </Grid>
            )}
            <Grid item>
              <IconButton size='small' onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant='h5'>
                <IntlMessages id='app.affiliate.page.title' />
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <AffiliateTotalCard total={valueTotalUSD || 0} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AffiliateAddressCard address={account} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box p={4} component={Paper}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1'>
                      <IntlMessages id='app.affiliate.affiliate' />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' color='textSecondary'>
                      You need to have 200 KIT in your wallet on {chain} network
                      to earn money from referrals on {chain} network
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AffiliateProgressCard to={200} from={kitValue} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box p={4} component={Paper}>
                <Grid container spacing={4}>
                  <Grid item xs={3}>
                    <FormControl fullWidth variant='outlined'>
                      <InputLabel>
                        <IntlMessages id='app.affiliate.page.swap.chain' />
                      </InputLabel>
                      <Select
                        variant='outlined'
                        value={chain}
                        label={
                          <IntlMessages id='app.affiliate.page.swap.chain' />
                        }
                        onChange={(e) => setChain(e.target.value as string)}
                        renderValue={(value) => <> {value}</>}>
                        <MenuItem value='BSC'>BSC</MenuItem>
                        <MenuItem value='ETH'>ETH</MenuItem>
                        <MenuItem value='MATIC'>MATIC</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label={
                        <IntlMessages
                          id='app.affiliate.affiliateLink'
                          defaultMessage='Affiliate URL'
                        />
                      }
                      fullWidth
                      value={affiliateLink}
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <ButtonCopy
                              copyText={affiliateLink}
                              titleText={
                                messages['shared.copiedClipboard'] as string
                              }
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<LinkIcon />}
                      fullWidth
                      href={affiliateLink}
                      target='_blank'>
                      <IntlMessages id='app.affiliate.page.swap.openBtn' />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>

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
    </Box>
  );
};

export default AffiliatePage;
