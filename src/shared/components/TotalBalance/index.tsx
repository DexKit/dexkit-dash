import React, {useEffect, useState} from 'react';
import {Box, Button, Card, Fade} from '@material-ui/core';
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
import { MyBalances } from 'types/blockchain';
import { useNetwork } from 'hooks/useNetwork';
import Transak from 'shared/components/Transak';
// import {tokenSymbolToDisplayString} from 'utils';

interface Props {
  balances: MyBalances[];
  only?: Token;
  loading?: boolean;
}

const TotalBalance: React.FC<Props> = ({balances, only, loading}) => {
  const [senderModal, setSenderModal] = useState(false);
  const [receiverModal, setReceiverModal] = useState(false);
  const [tokens, setTokens] = useState<
    MyBalances[]
  >([]);
  const [usdAvailable, setUsdAvailable] = useState<number>(0);

  const networkName = useNetwork();

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
              symbol:  dataFn.currency?.symbol || '',
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

  return (
    <Box>
    {/*  <Fade in={true} timeout={1000}>*/}
        <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} clone>
          <Card>
            <Box
              display='flex'
              // flexDirection={{xs: 'column', xl: 'row'}}
              alignItems={{xl: 'center'}}
              flexDirection={'row'}
              flexWrap={'wrap'}
              justifyContent={'space-between'}>
              {loading ? (
                <>
                  <Skeleton variant='rect' width='40%' height={20} />
                  <Box display='flex' alignItems='end'>
                    <Skeleton
                        variant='rect'
                        width={106}
                        height={40}
                        style={{marginRight: 10}}
                      />
                    <Skeleton
                      variant='rect'
                      width={106}
                      height={40}
                      style={{marginRight: 10}}
                    />
                    <Skeleton variant='rect' width={106} height={40} />
                  </Box>
                </>
              ) : (
                <>
                  <Box display='flex' alignItems='baseline' mr={2}>
                    <Box
                      component='h3'
                      color='text.primary'
                      fontFamily={Fonts.BOLD}
                      fontSize={{xs: 20, sm: 22, xl: 24}}>
                      ${onlyTokenValueInUsd || usdAvailable.toFixed(2)}
                    </Box>
                    <Box
                      component='span'
                      ml={3}
                      color={indigo[100]}
                      fontSize={{xs: 16, xl: 18}}
                      whiteSpace='nowrap'>
                      {onlyTokenValue || 'Avl. Balance'}
                    </Box>
                  </Box>

                  <Box
                    display='flex'
                    alignItems='center'
                    ml={{xs: 0, xl: 'auto'}}
                    mt={{xs: 2, lg: 0}}>
                    <Box>
                      <Transak />
                    </Box>
                    <Box ml={3}>
                      <Button
                        variant='outlined'
                        onClick={() => setSenderModal(true)}
                        className={classes.btnPrimary}>
                        <IntlMessages id='common.send' />
                        <CallMadeIcon style={{marginLeft: 5}} />
                      </Button>
                    </Box>
                    <Box ml={3}>
                      <Button
                        variant='outlined'
                        onClick={() => setReceiverModal(true)}
                        className={classes.btnSecondary}>
                        <IntlMessages id='common.receive' />
                        <CallReceivedIcon style={{marginLeft: 5}} />
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
            {/* <Box
            component='p'
            mb={{xs: 3.5, md: 4, xl: 6}}
            fontSize={{xs: 16, xl: 18}}
            color={indigo[100]}>
            <IntlMessages id='dashboard.buyCurrency' />
          </Box> */}
            {!only && loading ? (
              <Skeleton
                style={{marginTop: 10}}
                variant='rect'
                width='100%'
                height={40}
              />
            ) : (
              !only &&
              tokens.length > 0 && (
                <Box pt={{lg: 5}}>
                  <CoinsInfo coins={tokens} />
                </Box>
              )
            )}
          </Card>
        </Box>
  {/*    </Fade>*/}

      <Sender
        open={senderModal}
        onClose={() => setSenderModal(false)}
        balances={tokens.filter(t => t.network === networkName)}
      />

      <Receiver open={receiverModal} onClose={() => setReceiverModal(false)} />
    </Box>
  );
};

export default TotalBalance;
