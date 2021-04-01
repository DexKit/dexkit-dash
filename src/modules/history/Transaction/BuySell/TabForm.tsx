import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Grid  from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import { InputAdornment } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {BuySellDataProps} from '../../../../types/models/Crypto';
import {CremaTheme} from '../../../../types/AppContextPropsType';
import {ArrowDownwardOutlined} from '@material-ui/icons';


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
      marginBottom: 0,
      fontSize: 13,
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
          <Grid  style={{padding:4}} item xs={12} md={8}>
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
              endAdornment: <InputAdornment position="end">= $20.5</InputAdornment>,
            }}
          />
          </Grid>
          <Grid  style={{padding:4}}item xs={12} md={4}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='left'
            className={classes.textRes}>
           Token
          </Box>
          <Select
          fullWidth
          native
          variant='outlined'
          value='KIT'   
        >
          <option defaultValue="kit" value={10}>KIT</option>     
        </Select>
        </Grid>
        <Grid  style={{padding: 0, marginTop: 4}} item xs={12} md={8}>
        <Box
            mb={2}
            color='grey.400'
            textAlign='center'
            className={classes.textRes}>
            <IconButton style={{padding: 0}} >
            <ArrowDownwardOutlined />
          </IconButton>
          </Box>
        </Grid>

        <Grid  style={{padding:4}} item xs={12} md={8}>
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
            value={inputPrice}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              className: classes.inputText,
              endAdornment: <InputAdornment position="end">= $576.5</InputAdornment>,
            }}
          />
          </Grid>
          <Grid  style={{padding:4}}item xs={12} md={4}>
          <Box
            mb={2}
            color='grey.400'
            textAlign='left'
            className={classes.textRes}>
            <IntlMessages id='Token' />
          </Box>
          <Select
          fullWidth
          native
          variant='outlined'
          value='ETH'   
        >
          <option defaultValue="eth" value={10}>ETH</option>     
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
