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
import SelectToken from './SelectToken';


interface Props {
  chainId: number;
  tokens: TokenMetaData[];
  actionButton: ($event?: React.SyntheticEvent<HTMLElement, Event>) => void
} 

const MarketForm: React.FC<Props> = (props) => {
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
  const [inputValue, setValue] = useState(0);
  const [inputPrice, setPrice] = useState(0);
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
    const _token = props.tokens.find(t => Object.values(t.addresses)[0] === address);
    setState(_token);
  }

  return (
    <Box>
      <form noValidate autoComplete='off'>
        <Box mb={5}>
          <GridContainer>
            <Grid  style={{padding:4}} item xs={12} md={8}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='You send' />}
                value={inputValue}
                onChange={(e) => setValue(parseFloat(e.target.value))}
              />
            </Grid>
            
            <Grid  style={{padding:4}}item xs={12} md={4}>
              <SelectToken
                chainId={props.chainId}
                token={tokenFrom}
                tokens={props.tokens}
                onChange={($e, child) => onChange($e, child, setTokenFrom)}
              />
            </Grid>


            <Grid  style={{padding: 0, marginTop: 4}} item xs={12} md={8}>
              <Box
                mb={2}
                color='grey.400'
                textAlign='center'
                className={classes.textRes}>
                {/* <IconButton style={{padding: 0}} > */}
                  <ArrowDownwardOutlined />
                {/* </IconButton> */}
              </Box>
            </Grid>


            <Grid  style={{padding:4}} item xs={12} md={8}>
              <TextField
                variant='outlined'
                fullWidth
                label={<IntlMessages id='You receive' />}
                value={inputPrice}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                disabled
              />
            </Grid>
            <Grid  style={{padding:4}}item xs={12} md={4}>
              <SelectToken
                chainId={props.chainId}
                token={tokenTo}
                tokens={props.tokens}
                onChange={($e, child) => onChange($e, child, setTokenTo)}
              />
            </Grid>
        
          </GridContainer>      
        </Box>
    
      </form>

      <Button fullWidth variant="contained" color="primary" onClick={($e) => props.actionButton($e)}>Trade</Button>
    </Box>
  );
};

export default MarketForm;
