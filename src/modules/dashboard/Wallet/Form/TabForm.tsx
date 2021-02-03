import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {BuySellDataProps} from '../../../../types/models/Crypto';
import {CremaTheme} from '../../../../types/AppContextPropsType';

interface TabFormProps {
  data: BuySellDataProps;
}

const TabForm: React.FC<TabFormProps> = ({data}) => {
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
    const [inputPrice, setPrice] = useState(data.price);
  const [inputAmount, setAmount] = useState(data.amount);

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
          <Select
          fullWidth
          native
          variant='outlined'
          value='KIT'   
         >
          <option defaultValue="kit" value={10}>KIT</option>     
        </Select>
        </Box>
        <Box mb={5}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            <IntlMessages id='KIT (0.35 ETH)' />
          </Box>
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
        <Button fullWidth style={{maxWidth: '60%'}} variant="contained" onClick={() => false} color="primary">
            Send
          </Button>
        </Box>
       
      </form>

     
    </Box>
  );
};

export default TabForm;
