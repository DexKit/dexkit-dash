import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {MyBalance} from 'types/bitquery/myBalance.interface';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddIcon from '@material-ui/icons/Add';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import clsx from 'clsx';
import { useWeb3 } from 'hooks/useWeb3';
import { fromTokenUnitAmount } from '@0x/utils';
import { isAddress } from '@ethersproject/address';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import { sendTransaction } from 'services/transfer-token';
interface Props {
  balances: MyBalance[];
}

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
  }
}));

const SenderForm: React.FC<Props> = (props) => {
  const classes = useStyles();

  const {account, onActionWeb3Transaction} = useWeb3();

  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [selected, setSelected] = useState<MyBalance>(props.balances[0]||undefined);

  const handleCopy = async () => {
    const cpy: any = await navigator.clipboard.readText();
    setAddress(cpy);
  }
  
  const handleMax = async () => {
    setAmount(selected.value.toString());
  }

  const handleToken = (idx: any) => {
    setSelected(props.balances[idx]);
  }

  const handleSend = () => {
    try {
      if (account) {
        if (selected.currency.symbol == 'ETH') {
          sendTransaction(account, address, fromTokenUnitAmount(amount, selected.currency.decimals).toString())
        } else {
          sendTransaction(account, address, fromTokenUnitAmount(amount, selected.currency.decimals).toString(), selected.currency.address);
        }
      }
      
      // onActionWeb3Transaction({
      //   to: address,
      //   from: account,
      //   value: fromTokenUnitAmount(amount, selected.currency.decimals).toString()
      // });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box mb={5}>
          <Select
            fullWidth
            native
            variant='outlined'
            onChange={(e) => handleToken(e.target.value)}
            inputProps={ { name: 'Token', id:'token' } }
          >
          {
            props?.balances?.map((balance, i) => {
              return (<option defaultValue={balance.currency.name} value={i} key={i}>{`${balance.currency.name.toUpperCase()} (${balance.currency.symbol.toUpperCase()})`}</option>)
            })
          }
        </Select>
        </Box>

        <Box mb={5}>
          {
            <Box
              mb={2}
              color='grey.400'
              textAlign='right'
              className={classes.textRes}
            >
              { selected?.value ? `${selected.value.toFixed(6)} ${selected.currency?.symbol} ($${selected.valueUsd?.toFixed(2)})` : `0` }
            </Box>
          }
          {/* <TextField
            fullWidth
            variant='outlined'
            label={<IntlMessages id='Amount' />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          /> */}
          <FormControl className={clsx(classes.inputText)} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount"><IntlMessages id='Amount' /></InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              fullWidth
              type={'text'}
              label={<IntlMessages id='Amount' />}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleMax} edge="end">
                    <CallReceivedIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Box mb={5}>
          <FormControl className={clsx(classes.inputText)} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-to"><IntlMessages id='To' /></InputLabel>
            <OutlinedInput
              id="outlined-adornment-to"
              fullWidth
              type={'text'}
              label={<IntlMessages id='To' />}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleCopy} edge="end">
                    <FileCopyIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Box textAlign="center" mb={5}>
          <Button 
            fullWidth 
            style={{maxWidth: '60%'}} 
            variant="contained" 
            color="primary"
            onClick={handleSend}
            disabled={!isAddress(address) || selected.value < parseFloat(amount) || parseFloat(amount) == 0 || amount == ''}
          >
            {
              address == '' || amount == '0' ? 'Send' : (
                !isAddress(address) ? 'Invalid Address' : ( selected.value < parseFloat(amount) ? 'Insufficient funds' : 'Send')
              )
            }
          </Button>
        </Box>
       
      </form>
     
    </Box>
  );
};

export default SenderForm;
