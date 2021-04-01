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
import { TokenMetaData } from '@types';


interface TabFormProps {
  data: BuySellDataProps;
  tokens: TokenMetaData[];
  chainId: number;
}

interface SelectTokenProps{
  token: TokenMetaData | undefined;
  tokens: TokenMetaData[];
  chainId: number;
  onChange: ( $e: React.ChangeEvent<
    {
      name?: string | undefined;
      value: unknown;
    }
  >, child: React.ReactNode) => void;
}

const SelectToken: React.FC<SelectTokenProps> = ({token, tokens, onChange, chainId}) => (
  <Select
  fullWidth
  native
  variant='outlined'
  onChange={onChange}
  value={token != null ? Object.values(token.addresses)[0] : undefined}   
  >
    {
       tokens.filter( _token => {
        return _token.addresses != null && 
        chainId.toString() in _token.addresses && 
          _token.addresses[chainId] != null && _token.addresses[chainId]?.length > 0
      })
      .map( _token => (
        <option value={Object.values(_token.addresses)[0]}>{_token.symbol.toUpperCase()}</option> 
      ))
    }
  </Select>
);


const TabForm: React.FC<TabFormProps> = ({data, tokens, chainId}) => {
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
  // const [inputAmount, setAmount] = useState(data.amount);
  const [tokenFrom, setTokenFrom] = useState<TokenMetaData>();
  const [tokenTo, setTokenTo] = useState<TokenMetaData>();

  const onChange = ( $e: React.ChangeEvent<
    {
      name?: string | undefined;
      value: unknown;
    }
  >, 
  child: React.ReactNode,
  setState: React.Dispatch<React.SetStateAction<TokenMetaData | undefined>>
  ) => {
    const address = $e.target.value;
    const _token = tokens.find(t => Object.values(t.addresses)[0] === address);
    setState(_token);
  }
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
          <SelectToken
            chainId={chainId}
            token={tokenFrom}
            tokens={tokens}
            onChange={($e, child) => onChange($e, child, setTokenFrom)}
          />
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
          <SelectToken
            chainId={chainId}
            token={tokenTo}
            tokens={tokens}
            onChange={($e, child) => onChange($e, child, setTokenTo)}
          />
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
