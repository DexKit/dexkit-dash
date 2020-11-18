
import React, { useState } from 'react';

import { BuySellDataProps } from 'types/models/Crypto';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import IntlMessages from '@crema/utility/IntlMessages';
import { makeStyles, Box, TextField, Button } from '@material-ui/core';



interface TabFormProps {
  data: BuySellDataProps;
}

const TabFormLimit: React.FC<TabFormProps> = ({data}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    root: {
      color: theme.palette.secondary.main,
      fontSize: 18,
      marginTop: 6,
      [theme.breakpoints.up('xl')]: {
        fontSize: 20,
        marginTop: 16,
      },
    },
    textRes: {
      fontSize: 16,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
    },
    inputText: {
      fontFamily: Fonts.MEDIUM,
      width: '100%',
    },
  }));
  const classes = useStyles();
  const [inputAmountIn, setAmountIn] = useState(data.value);
  const [inputPrice, setPrice] = useState(data.price);
  const [inputAmountOut, setAmountOut] = useState(data.amount);

  const onChangeAmountIn = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const amount = e.target.value;
    setAmountIn(amount);
    setAmountOut(String(Number(amount)*Number(inputPrice)));
  }

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box mb={5}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            Token
          </Box>
          <TextField
            fullWidth
            variant='outlined'
            label={'You Have'}
            value={inputAmountIn}
            onChange={onChangeAmountIn}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box mb={5}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            Token/BTC
          </Box>
          <TextField
            fullWidth
            variant='outlined'
            label={<IntlMessages id='common.price' />}
            value={inputPrice}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box mb={5}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            <IntlMessages id='dashboard.btc' />
          </Box>
          <TextField
            fullWidth
            variant='outlined'
            label={'You Get'}
            value={inputAmountOut}
            onChange={(e) => setAmountOut(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
      </form>

      <Button variant="contained" color="primary" size="large">
        Place Offer
        </Button>
    </Box>
  );
};

export default TabFormLimit;
