import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {BuySellDataProps} from '../../../../types/models/Crypto';
import {CremaTheme} from '../../../../types/AppContextPropsType';
import { useWeb3 } from 'hooks/useWeb3';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';

interface TabFormProps {
  data: BuySellDataProps;
}

const TabForm: React.FC<TabFormProps> = ({data}) => {
  const {onConnectWeb3, getWeb3} = useWeb3();
  const ethAccount = useSelector<AppState, AppState['blockchain']['ethAccount']>(state => state.blockchain.ethAccount);

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
  const [inputValue, setValue] = useState(2);
  const [inputPrice] = useState(35);
  const [inputAmount, setAmount] = useState(70);

  const onChangeHave = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = Number(e.target.value);
    setValue(value)
    setAmount(value*inputPrice);
  }
  const onSendETHtoContract = () => {
    const web3 = getWeb3();
    if(web3){
      web3.eth.sendTransaction({to: '0x', value: 1, gas: 8000000}).then(()=>console.log('Sent'))
    }

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
           ETH
          </Box>
          <TextField
            fullWidth
            variant='outlined'
            label={'You Have'}
            type={'number'}
            value={inputValue}
            onChange={onChangeHave}
            InputProps={{
              className: classes.inputText,
              inputProps: { 
                max: 100, min: 1
             }
            }}
          />
        </Box>
        <Box mb={5}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
           KIT/ETH
          </Box>
          <TextField
            fullWidth
            disabled
            variant='outlined'
            label={<IntlMessages id='common.price' />}
            value={inputPrice}
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
            KIT
          </Box>
          <TextField
            fullWidth
            variant='outlined'
            label={'You Get'}
            value={inputAmount}
            onChange={(e) => setAmount(Number(e.target.value))}
            InputProps={{
              className: classes.inputText,
            }}
          />
        </Box>
      </form>
      {ethAccount ?
      <Button color="primary" variant="contained" onClick={onSendETHtoContract}>
       Mint Now
      </Button> :  
      <Button color="primary" variant="outlined" onClick={onConnectWeb3}>
       Connect Wallet
      </Button>
        }
    </Box>
  );
};

export default TabForm;
