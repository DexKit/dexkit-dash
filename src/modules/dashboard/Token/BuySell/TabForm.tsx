import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';

import Button from '@material-ui/core/Button';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
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
  const [inputValue, setValue] = useState(data.value);
  const [inputPrice, setPrice] = useState(data.price);
  const [inputAmount, setAmount] = useState(data.amount);
  console.log(inputPrice, setPrice, setAmount, inputAmount)

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box mb={5}>
         
          <GridContainer>
          <Grid item xs={12} md={9}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            <IntlMessages id='(500 KITS) Avl.Bal' />
          </Box>
          <TextField
          variant='outlined'

          fullWidth
            label={<IntlMessages id='You send' />}
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
          </Grid>
          <Grid item xs={12} md={3}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='right'
            className={classes.textRes}>
            <IntlMessages id='dashboard.btc' />
          </Box>
          <Select
          native
          variant='outlined'
          value='ten'
          
        >
          <option aria-label="None" value="" />
          <option value={10}>Ten</option>
         
        </Select>
        </Grid>
        <Grid item xs={12} md={9}>
         
          <TextField
          variant='outlined'

          fullWidth
            label={<IntlMessages id='You Receive' />}
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              className: classes.inputText,
            }}
          />
          </Grid>
          <Grid item xs={12} md={3}>
         
          <Select
          native
          variant='outlined'
          value='ten'
          
        >
          <option aria-label="None" value="" />
          <option value={10}>Ten</option>
         
        </Select>
        </Grid>
        
        </GridContainer>      
        </Box>
    
      </form>

      <Button fullWidth variant="contained" color="primary">
        Trade 
      </Button>
    </Box>
  );
};

export default TabForm;
