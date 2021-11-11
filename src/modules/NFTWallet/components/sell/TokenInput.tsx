import {
  InputAdornment,
  MenuItem,
  Typography,
  Select,
  TextField,
  makeStyles,
  Avatar,
  useTheme,
  Box,
  Grid,
} from '@material-ui/core';
import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: theme.spacing(35),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  input: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
  img: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
  },
  avatar: {
    backgroundColor: theme.palette.common.white,
    width: theme.spacing(5),
    height: theme.spacing(5),
    minWidth: theme.spacing(5),
    minHeight: theme.spacing(5),
  },
}));

export interface PaymentToken {
  symbol: string;
  imageUrl: string;
  address: string;
  usdPrice: number;
  decimals: number;
}

interface Props {
  tokenIndex: number;
  tokens: PaymentToken[];
  amount: number;
  error?: string;
  onChangeToken: (value: number) => void;
  onChangeAmount: (value: number) => void;
}

export default (props: Props) => {
  const {tokens, tokenIndex, amount, error, onChangeToken, onChangeAmount} =
    props;
  const [amountValue, setAmountValue] = useState('');

  const theme = useTheme();
  const classes = useStyles();

  const handleChangeAmount = useCallback(
    (e: ChangeEvent<any>) => {
      setAmountValue(e.target.value);
      if (e.target.value) {
        onChangeAmount(parseFloat(e.target.value));
      } else {
        onChangeAmount(0);
      }
    },
    [onChangeAmount],
  );

  /* eslint-disable */
  const handleChangeToken = useCallback(
    (e: ChangeEvent<any>) => {
      const index = parseInt(e.target.value);

      onChangeToken(index);
    },
    [tokens],
  );

  useEffect(() => {
    setAmountValue(amount.toString());
  }, []);

  return (
    <Box>
      <Box mb={1} display='flex' alignItems='center'>
        <Select
          error={error != undefined}
          value={tokenIndex.toString()}
          onChange={handleChangeToken}
          className={classes.select}
          variant='outlined'>
          {tokens.map((token, index) => (
            <MenuItem key={index} value={index}>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                spacing={2}>
                <Grid item>
                  <Avatar className={classes.avatar}>
                    <img src={token.imageUrl} className={classes.img} />
                  </Avatar>
                </Grid>
                <Grid item>{token.symbol}</Grid>
              </Grid>
            </MenuItem>
          ))}
        </Select>
        <TextField
          size='medium'
          variant='outlined'
          placeholder='Amount'
          type='number'
          value={amountValue}
          onChange={handleChangeAmount}
          className={classes.input}
          error={error != undefined}
          InputProps={{
            className: classes.input,
            endAdornment: (
              <InputAdornment position='end'>
                $
                {tokens.length > 0
                  ? (amount * (tokens[tokenIndex].usdPrice || 0)).toFixed(2)
                  : null}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {error != undefined ? (
        <Typography style={{color: theme.palette.error.main}} variant='caption'>
          {error}
        </Typography>
      ) : null}
    </Box>
  );
};
