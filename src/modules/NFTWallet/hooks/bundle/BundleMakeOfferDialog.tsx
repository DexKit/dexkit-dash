import IntlMessages from '@crema/utility/IntlMessages';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@material-ui/core';
import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import {useIntl} from 'react-intl';
import {OpenSeaToken} from '../../types';
import TokenSelect from '../../components/detail/TokenSelect';
import TimedeltaSelect from '../../components/detail/TimedeltaSelect';
import {useWeb3} from 'hooks/useWeb3';
import {toTokenUnitAmount} from '@0x/utils';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {getUnixDays} from 'modules/NFTWallet/utils';
import {getOpenSeaPort} from 'utils/opensea';
import {useTokens} from 'hooks/opensea';

const useStyles = makeStyles((theme) => ({
  nftImage: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    maxHeigth: '100%',
  },
  tokenImage: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

interface TokenBalanceSpanProps {
  accountAddress: string;
  token?: OpenSeaToken;
}

const TokenBalanceSpan = (props: TokenBalanceSpanProps) => {
  const {accountAddress, token} = props;
  const {getProvider} = useWeb3();
  const [balance, setBalance] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (token) {
        const provider = getProvider();

        const seaport = await getOpenSeaPort(provider);

        seaport
          .getTokenBalance({
            accountAddress,
            tokenAddress: token.address,
          })
          .then((result) => {
            setBalance(
              toTokenUnitAmount(result.toNumber(), token.decimals).toNumber(),
            );
          });
      }
    })();
  }, [accountAddress, token, getProvider]);

  return (
    <span>
      <Grid container alignItems='center' spacing={2}>
        <Grid item>
          <Avatar style={{height: theme.spacing(4), width: theme.spacing(4)}}>
            <img src={token?.image_url} alt={token?.name} />
          </Avatar>
        </Grid>
        <Grid item>
          {balance} {token?.symbol}
        </Grid>
      </Grid>
    </span>
  );
};

interface CurrencyAdornmentProps {
  amount: number;
  usdPrice: number;
  onMax: () => void;
}

const CurrencyAdornment = (props: CurrencyAdornmentProps) => {
  const {amount, usdPrice, onMax} = props;

  return (
    <InputAdornment position='end'>
      <Button onClick={onMax} color='primary' variant='text'>
        MAX
      </Button>
      ${(amount > 0 && usdPrice > 0 ? amount * usdPrice || 0 : 0).toFixed(2)}
    </InputAdornment>
  );
};

interface OfferParams {
  expiration: number;
  amount: number;
  tokenAddress: string;
}

interface Props {
  asset?: any;
  open: boolean;
  onClose: () => void;
  onResult: (params: OfferParams) => void;
  error?: string;
}

export default (props: Props) => {
  const {open, asset, onResult, onClose} = props;
  const theme = useTheme();

  const classes = useStyles();

  const {messages} = useIntl();
  const userAddress = useDefaultAccount();
  const {getProvider} = useWeb3();

  const [paymentTokens, setPaymentTokens] = useState<any[]>([]);

  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');

  const [selectedToken, setSelectedToken] = useState<OpenSeaToken>();
  const [expiration, setExpiration] = useState<number>(getUnixDays(7));
  const [customExpiration, setCustomExpiration] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {getTokens} = useTokens();

  useEffect(() => {
    (async () => {
      const tokens = (await getTokens()).tokens;

      setPaymentTokens(tokens);

      if (tokens) {
        const firstToken = tokens[0];
        setSelectedToken({
          address: firstToken.address,
          decimals: firstToken.decimals,
          eth_price: firstToken.ethPrice || '',
          usd_price: firstToken.usdPrice || '',
          symbol: firstToken.symbol,
          image_url: firstToken.imageUrl || '',
          name: firstToken.name,
        });
      }
    })();
  }, []);

  const handleSelectToken = useCallback((token: OpenSeaToken) => {
    setSelectedToken(token);
  }, []);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  // const handleQuantityChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     setQuantity(e.target.value);
  //   },
  //   [],
  // );

  const handleSelectTimedelta = useCallback((option) => {
    if (option.custom) {
      setCustomExpiration(true);
      return;
    }

    if (!option.timedelta) {
      setExpiration(0);
      return;
    }

    setExpiration(option.timedelta);
  }, []);

  const handleMakeOffer = useCallback(() => {
    onResult({
      amount: parseFloat(amount),
      tokenAddress: selectedToken?.address || '',
      expiration,
    });
  }, [amount, selectedToken, expiration]);

  const handleMaxBalance = useCallback(async () => {
    if (selectedToken && userAddress) {
      const provider = getProvider();

      const seaport = await getOpenSeaPort(provider);

      seaport
        .getTokenBalance({
          accountAddress: userAddress,
          tokenAddress: selectedToken.address,
        })
        .then((result) => {
          setAmount(
            toTokenUnitAmount(result.toNumber(), selectedToken?.decimals)
              .toNumber()
              .toString(),
          );
        });
    }
  }, [userAddress, selectedToken, getProvider]);

  const handleClose = useCallback(() => {
    setAmount('');
    onClose();
  }, []);

  return (
    <Dialog fullScreen={isMobile} fullWidth open={open} onClose={handleClose}>
      <DialogTitle>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <IntlMessages id='nfts.wallet.makeOfferDialog' />
          </Grid>
          {selectedToken && userAddress ? (
            <Grid item>
              <Grid container spacing={1} alignItems='center'>
                <Grid item>
                  <Typography color='textSecondary' variant='body2'>
                    <IntlMessages id='nfts.wallet.makeOfferBalance' />:{' '}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body2'>
                    <TokenBalanceSpan
                      token={selectedToken}
                      accountAddress={userAddress}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant='body1' color='textSecondary'>
              <IntlMessages id='nfts.wallet.makeOfferYouAreBuying' />
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label='Quantity'
              size='medium'
              value={quantity}
              onChange={handleQuantityChange}
              variant='outlined'
              type='number'
              placeholder={messages[
                'nfts.wallet.makeOfferDialog.amount'
              ].toString()}
              fullWidth
            />
          </Grid> */}
          <Grid item xs={12}>
            <Grid alignItems='center' container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TokenSelect
                  tokens={paymentTokens.filter((t: any) => t.symbol != 'ETH')}
                  onSelect={handleSelectToken}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  size='medium'
                  value={amount}
                  onChange={handleAmountChange}
                  variant='outlined'
                  type='number'
                  label={messages[
                    'nfts.wallet.makeOfferDialog.amount'
                  ].toString()}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <CurrencyAdornment
                        onMax={handleMaxBalance}
                        amount={parseFloat(amount)}
                        usdPrice={parseInt(selectedToken?.usd_price || '0')}
                      />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TimedeltaSelect onSelect={handleSelectTimedelta} />
          </Grid>
          <Grid item xs={12}>
            <Box mb={2}>
              <Grid alignItems='center' justify='center' container spacing={2}>
                <Grid item>
                  <Button
                    disabled={!selectedToken && amount == ''}
                    onClick={handleMakeOffer}
                    size='large'
                    color='primary'
                    variant='contained'>
                    <IntlMessages id='nfts.wallet.DialogMakeOffer' />
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={onClose} size='large' variant='contained'>
                    <IntlMessages id='nfts.wallet.DialogCancel' />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
