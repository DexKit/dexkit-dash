import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import CoinsInfo from './CoinsInfo';
import Receiver from './Receiver';
import Sender from './Sender';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import {Token} from 'types/app';
import {Skeleton} from '@material-ui/lab';
import {MyBalances} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
import Transak from 'shared/components/Transak';
// import {tokenSymbolToDisplayString} from 'utils';

import {ReactComponent as CopyIcon} from '../../../assets/images/icons/note.svg';
import {ReactComponent as ExportIcon} from '../../../assets/images/icons/export.svg';
import {ReactComponent as ImportIcon} from '../../../assets/images/icons/import.svg';

import CopyButton from '../CopyButton';
import TokenLogo from '../TokenLogo';
import {truncateAddress} from 'utils';

interface Props {
  balances: MyBalances[];
  only?: Token;
  loading?: boolean;
  address?: string;
  tokenName?: string;
}

const TotalBalance = (props: Props) => {
  const {balances, only, loading, address, tokenName} = props;
  const [senderModal, setSenderModal] = useState(false);
  const [receiverModal, setReceiverModal] = useState(false);
  const [tokens, setTokens] = useState<MyBalances[]>([]);
  const [usdAvailable, setUsdAvailable] = useState<number>(0);

  const networkName = useNetwork();

  const theme = useTheme();

  useEffect(() => {
    if (only) {
      const dataFn = balances?.find(
        (e) =>
          e.currency?.address?.toLowerCase() === only.address.toLowerCase(),
      );

      if (!dataFn) {
        setTokens([
          {
            __typename: 'EthereumBalance',
            currency: {
              __typename: 'Currency',
              address: only.address,
              decimals: only.decimals,
              name: only.name || '',
              symbol: only.symbol || '',
            },
            network: networkName,
            value: 0,
            valueInUsd: 0,
          },
        ]);
      } else {
        setTokens([
          {
            __typename: 'EthereumBalance',
            currency: {
              __typename: 'Currency',
              address: dataFn.currency?.address ?? '',
              decimals: dataFn.currency?.decimals ?? 18,
              name: dataFn.currency?.name || '',
              symbol: dataFn.currency?.symbol || '',
            },
            network: dataFn.network,
            value: dataFn.value ?? 0,
            valueInUsd: dataFn.valueInUsd ?? 0,
          },
        ]);
      }
    } else {
      setTokens(balances);
    }
  }, [only, balances]);

  useEffect(() => {
    setUsdAvailable(
      tokens?.reduce((acc, current) => {
        return (acc += current.valueInUsd || 0);
      }, 0) || 0,
    );
  }, [tokens]);

  const useStyles = makeStyles((theme: CremaTheme) => ({
    btnPrimary: {
      color: 'white',
      borderColor: 'white',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 106,
      fontSize: 16,
      '&:hover, &:focus': {
        // backgroundColor: theme.palette.primary.dark,
        color: '#F15A2B',
        borderColor: '#F15A2B',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
    btnSecondary: {
      color: '#F15A2B',
      borderColor: '#F15A2B',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 106,
      fontSize: 16,
      '&:hover, &:focus': {
        // backgroundColor: theme.palette.secondary.dark,
        color: 'white',
        borderColor: 'white',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
  }));

  const classes = useStyles();

  let onlyTokenValue = null;
  let onlyTokenValueInUsd = null;

  if (only) {
    if (tokens.length > 0) {
      onlyTokenValue =
        tokens[0].value?.toFixed(4) + ' ' + tokens[0].currency?.symbol;
      onlyTokenValueInUsd = tokens[0].valueInUsd?.toFixed(2);
    }
  }

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Box>
        <Card>
          <Box p={4}>
            {loading ? (
              <Skeleton height={theme.spacing(4)} />
            ) : (
              <Grid
                container
                spacing={2}
                alignItems='center'
                justify='space-between'>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item xs={isMobile ? 12 : undefined}>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <TextField
                          disabled
                          size='small'
                          fullWidth
                          variant='outlined'
                          value={truncateAddress(address)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                {address ? (
                                  <TokenLogo token0={address} />
                                ) : null}{' '}
                                <Typography
                                  style={{fontWeight: 800}}
                                  variant='overline'>
                                  {tokenName}
                                </Typography>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment
                                style={{paddingRight: theme.spacing(2)}}
                                position='end'>
                                <CopyButton
                                  copyText={address || ''}
                                  tooltip='Address copied!'
                                  size='small'>
                                  <CopyIcon />
                                </CopyButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={isMobile ? 6 : undefined}>
                      <Grid container spacing={2} alignItems='baseline'>
                        <Grid item>
                          <Typography variant='h5'>
                            {loading ? (
                              <Skeleton width='25%' />
                            ) : (
                              <>
                                $
                                {onlyTokenValueInUsd || usdAvailable.toFixed(2)}{' '}
                              </>
                            )}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='body2'>
                            {loading ? (
                              <Skeleton width='20%' />
                            ) : (
                              <>
                                {tokens?.length > 0
                                  ? tokens[0].value?.toFixed(4)
                                  : 0}{' '}
                                <span
                                  style={{color: theme.palette.primary.main}}>
                                  {tokens?.length > 0
                                    ? tokens[0].currency?.symbol
                                    : '' || 'Avl. Balance'}
                                </span>
                              </>
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Grid
                    container
                    spacing={2}
                    alignItems='center'
                    alignContent='center'>
                    <Grid item xs={isMobile ? 12 : undefined}>
                      <Transak fullWidth={isMobile} />
                    </Grid>
                    <Grid item xs={isMobile ? 6 : undefined}>
                      <Button
                        fullWidth={isMobile}
                        variant='contained'
                        onClick={() => setSenderModal(true)}
                        endIcon={<ImportIcon />}>
                        <IntlMessages id='common.send' />
                      </Button>
                    </Grid>
                    <Grid item xs={isMobile ? 6 : undefined}>
                      <Button
                        fullWidth={isMobile}
                        variant='contained'
                        onClick={() => setReceiverModal(true)}
                        endIcon={<ExportIcon />}>
                        <IntlMessages id='common.receive' />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>
        </Card>
      </Box>
      <Sender
        open={senderModal}
        onClose={() => setSenderModal(false)}
        balances={tokens.filter((t) => t.network === networkName)}
      />
      <Receiver open={receiverModal} onClose={() => setReceiverModal(false)} />
    </Box>
  );
};

export default TotalBalance;
