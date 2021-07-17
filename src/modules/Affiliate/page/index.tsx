import React, {useState} from 'react';

import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';

import AffiliateHistory from 'modules/Affiliate/history';

import {Skeleton} from '@material-ui/lab';
import {useAffiliateTrades} from 'hooks/affiliate/useAffiliateTrades';
import {useWeb3} from 'hooks/useWeb3';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';
import {
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AffiliateRevenue from '../revenue';
import ButtonCopy from 'shared/components/ButtonCopy';
import {useTokenBalancesAffiliate} from 'hooks/affiliate/useTokenBalances';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import {CremaTheme} from 'types/AppContextPropsType';
import {AboutDialog} from '../AboutDialog';
import CheckIcon from '@material-ui/icons/Check';
import {green, red} from '@material-ui/core/colors';
import {Link} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Fonts} from 'shared/constants/AppEnums';

const useStyles = makeStyles((theme: CremaTheme) => ({
  affiliateIcon: {
    marginRight: '2px',
  },
}));

const AffiliatePage = () => {
  
  const {account: web3Account} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

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

  const skeleton = (
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

  const kitValue = (kitBalance && kitBalance.value?.toFixed(3)) ?? 0;

  return (
    <>
      <Box pt={{xl: 4}}>
        <Box mb={2} display={'flex'} alignItems={'center'}>
          <GroupIcon color={'primary'} fontSize='large' />
          <Box
            component='h3'
            color='text.primary'
            fontWeight={Fonts.BOLD}
            ml={2}>
            Affiliate Program
          </Box>
          <AboutDialog />
        </Box>
        <GridContainer>
          <Grid item xs={12} md={8} xl={8}>
            <AppCard height={1} action={null}>
              <Typography variant='h4'>
                Configure Affiliate <SettingsIcon color={'primary'} />{' '}
              </Typography>
              <Box
                mb={2}
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={'center'}>
                {kitValue >= 200 && (
                  <Tooltip title='Account eligible to receive rewards. Congrats!'>
                    <CheckIcon
                      style={{color: green[500], marginRight: '2px'}}
                    />
                  </Tooltip>
                )}
                {kitValue < 200 && (
                  <Tooltip title='Account not eligible to receive rewards, BUY KIT till eligible'>
                    <CloseIcon style={{color: red[500], marginRight: '2px'}} />
                  </Tooltip>
                )}
                <Typography variant='h6'>{kitValue} of 200 KIT</Typography>
              </Box>

              <Typography>
                <Tooltip title='Account that will receive rewards'>
                  <span style={{fontWeight: 'bold'}}>
                    Account Receive Rewards:
                  </span>
                </Tooltip>{' '}
                {account}
              </Typography>

              <Typography>
                {' '}
                <span style={{fontWeight: 'bold', marginRight: '10px'}}>
                  Chain:
                </span>
                <Select
                  labelId='chainSelect'
                  id='chainSelectId'
                  value={chain}
                  onChange={(e) => setChain(e.target.value as string)}
                  renderValue={(value) => <> {value}</>}>
                  <MenuItem value={'BSC'}>BSC</MenuItem>
                  <MenuItem value={'ETH'}>ETH</MenuItem>
                </Select>
              </Typography>

              <Typography>
                <span style={{fontWeight: 'bold'}}>Affiliate Link:</span>{' '}
                <Link href={affiliateLink} target={'_blank'}>
                  {affiliateLink} <OpenInNewIcon />
                </Link>{' '}
                <ButtonCopy
                  copyText={affiliateLink}
                  titleText='Copied to clipbord !'></ButtonCopy>
              </Typography>
            </AppCard>
          </Grid>
          <Grid item xs={12} md={4} xl={4}>
            <AffiliateRevenue value={valueTotalUSD} />
          </Grid>

          <Grid style={{marginTop: 20}} item xs={12} md={12}>
            <AffiliateHistory
              transactionData={data}
              isLoading={loading}
              total={total ?? 0}
              page={page}
              perPage={rowsPerPage}
              onChangePage={onChangePage}
              onChangePerPage={onChangeRowsPerPage}
            />
          </Grid>
        </GridContainer>
      </Box>
    </>
  );
};

export default AffiliatePage;
