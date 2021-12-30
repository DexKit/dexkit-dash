import IntlMessages from '@crema/utility/IntlMessages';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import {Alert} from '@material-ui/lab';
import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import {useIntl} from 'react-intl';
import {OpenSeaToken} from '../../types';
import TokenSelect from './TokenSelect';
import TimedeltaSelect from './TimedeltaSelect';
import {useWeb3} from 'hooks/useWeb3';
import {toTokenUnitAmount} from '@0x/utils';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {getFirstOrder, getUnixDays} from 'modules/NFTWallet/utils';
import {getOpenSeaPort} from 'utils/opensea';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';

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
  onCloseError: () => void;
}

export default (props: Props) => {
  const {open, asset, onResult, onClose, error, onCloseError} = props;
  const theme = useTheme();
  const classes = useStyles();

  const {messages} = useIntl();
  const userAddress = useDefaultAccount();
  const {getProvider} = useWeb3();

  const [amount, setAmount] = useState('');
  /* eslint-disable */
  const [quantity, setQuantity] = useState('');

  const [selectedToken, setSelectedToken] = useState<OpenSeaToken>();
  const [expiration, setExpiration] = useState<number>(getUnixDays(7));
  /* eslint-disable */
  const [customExpiration, setCustomExpiration] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const tokens: OpenSeaToken[] = asset?.collection?.payment_tokens?.filter(
      (t: any) => t.symbol !== 'ETH',
    );

    if (tokens) {
      setSelectedToken(tokens[0]);
    }
  }, [asset]);

  const handleSelectToken = useCallback((token: OpenSeaToken) => {
    setSelectedToken(token);
  }, []);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) {
      setAmount('0');
    } else {
      setAmount(e.target.value);
    }
  }, []);

  /* eslint-disable */
  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuantity(e.target.value);
    },
    [],
  );

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
  }, [onResult, amount, selectedToken, expiration]);

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
  }, [onClose]);
  
  return (
    <Dialog fullScreen={isMobile} fullWidth open={open} onClose={handleClose}>
      <CustomDialogTitle title={messages['nfts.wallet.makeOfferDialog']} />
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
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item>
                <Card>
                  <CardContent
                    style={{
                      backgroundColor: asset?.background_color
                        ? `#${asset?.background_color}`
                        : '#fff',
                    }}>
                    <img
                      src={asset?.image_thumbnail_url}
                      className={classes.nftImage}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Typography variant='caption' color='textSecondary'>
                  {asset?.collection?.name}
                </Typography>
                <Typography variant='h5'>{asset?.name}</Typography>
                {getFirstOrder(asset) ? (
                  <Typography gutterBottom variant='h5'>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'>
                      <img
                        src={
                          getFirstOrder(asset).payment_token_contract?.image_url
                        }
                        className={classes.tokenImage}
                      />
                      <span>
                        {toTokenUnitAmount(
                          getFirstOrder(asset)?.current_price,
                          getFirstOrder(asset)?.payment_token_contract
                            ?.decimals,
                        ).toNumber()}
                      </span>
                    </Box>
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
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
                  tokens={asset?.collection?.payment_tokens.filter(
                    (t: any) => t.symbol != 'ETH',
                  )}
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
          {error ? (
            <Grid item xs={12}>
              <Alert onClose={onCloseError} severity='error'>
                {error}
              </Alert>
            </Grid>
          ) : null}
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
