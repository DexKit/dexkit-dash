import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from 'shared/constants/AppEnums';
import {BuySellDataProps, BuySellProps} from 'types/models/Crypto';
import {CremaTheme} from 'types/AppContextPropsType';
// import { AppState } from 'redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
import { MyBalance } from 'types/bitquery/myBalance.interface';

interface TabFormProps {
  data: BuySellDataProps;
  balances: MyBalance[];
  onSend: ($e: React.MouseEvent<HTMLButtonElement, MouseEvent>,  buySell: BuySellProps) => Promise<void> | void;
}

// const myBalanceSelector = createSelector<AppState, AppState['dashboard'], AppState['dashboard']['myBalances']>(
//   (root) => root.dashboard,
//   (dashboar) => dashboar.myBalances
// );

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

const TabForm: React.FC<TabFormProps> = ({data, balances , onSend}) => {

  const classes = useStyles();
  const [inputPrice, setPrice] = useState(data.price);
  const [inputAmount, setAmount] = useState(data.amount);
  const [kit, setKit] = useState({} as MyBalance);
  // const [balances, setBalances] = useState<MyBalance[]>([]);
  // const dispatch = useDispatch();

  // const myBalances = useSelector<AppState, AppState['dashboard']['myBalances']>(
  //   myBalanceSelector
  // );

  useEffect(useCallback(() => {
    console.log('setKit')
    if(balances.length > 0){
      setKit(balances[0]);
    } else {
      setKit({} as  MyBalance);
    }
  }, [balances]), [balances]);

  // useEffect(useCallback(() => {
  //   setBalances( 
  //     myBalances != null ? myBalances
  //   .reduce(
  //     (arr: MyBalance[], e) => {
  //       arr.push(...e.balances as MyBalance[]);
  //       return arr;
  //     }, []
  //   ): []);
  // }, [myBalances]), [dispatch, myBalances]);

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box mb={5}>
          {/* <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            <IntlMessages id='dashboard.btc' />
          </Box> */}
          <Select
          fullWidth
          native
          variant='outlined'
          onChange={(e) => setKit(balances[Number(e.target.value)])}
          inputProps={
            {
              name: 'kit',
              id:'kit',
            }
          }
         >
           {
             balances?.map( (balance, i) => {
              return (
                <option defaultValue={balance.currency.name} value={i} key={i}>
                  {balance.currency.name.toUpperCase()}
                </option>)  
             })
           }
             
        </Select>
        </Box>
        <Box mb={5}>
          {/* <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            { kit?.value && <IntlMessages id={`KIT ${kit.value} (${kit.currency.symbol})`} /> }
          </Box> */}
          <TextField
            fullWidth
            variant='outlined'
            label={<IntlMessages id='Amount' />}
            value={inputPrice}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box mb={5}>
        
        <TextField
            fullWidth
            variant='outlined'
            label={<IntlMessages id='To' />}
            value={inputAmount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
        <Box textAlign="center" mb={5}>
          <Button 
          fullWidth 
          style={{maxWidth: '60%'}} 
          variant="contained" 
          onClick={($e) => onSend($e, {
            buyData: {
              amount: inputAmount,
              price: inputPrice,
              value: kit.value.toString()
            },
            sellData: {
              amount: '0',
              price: '0',
              value: '0'
            },
            address: kit.currency.address
          })} 
          color="primary"
          >
            Send
          </Button>
        </Box>
       
      </form>

     
    </Box>
  );
};

export default TabForm;
