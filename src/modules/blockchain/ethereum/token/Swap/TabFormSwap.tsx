
import React, { useState } from 'react';

import { BuySellDataProps } from 'types/models/Crypto';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import IntlMessages from '@crema/utility/IntlMessages';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import  {makeStyles} from '@material-ui/core';
import  SwapVert  from '@material-ui/icons/SwapVert';



interface TabFormProps {
  data: BuySellDataProps;
}

const TabFormSwap: React.FC<TabFormProps> = ({data}) => {
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
  const [inputValue, setValue] = useState(data.value);
  const [inputPrice, setPrice] = useState(data.price);


  return (
    <Box>
      <form noValidate autoComplete='off'>
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
            label={'You Have'}
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box mb={5}>
            <SwapVert/>
        </Box>
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
            label={'You Get'}
            value={inputPrice}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
      </form>
        <Button variant="contained" color="primary" size="large">
         Swap 
        </Button>
  
    </Box>
  );
};

export default TabFormSwap;
