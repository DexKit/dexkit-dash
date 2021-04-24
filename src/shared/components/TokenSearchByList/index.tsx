import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import GridContainer from '@crema/core/GridContainer';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
// import { SearchRounded } from '@material-ui/icons';
import { search } from 'services/graphql/bitquery';
import { Currency } from '@types';
import { Autocomplete } from '@material-ui/lab';
import { useWeb3 } from 'hooks/useWeb3';
import { useTokenList } from 'hooks/useTokenList';
import Web3 from 'web3';
import { filterTokensInfoByString, getNativeCoinWrapped } from 'utils/tokens';
import { ChainId } from 'types/blockchain';

interface TokenSearchProps {
  url: string,
  type?: 'token' | 'pair',
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

export const TokenSearchByList: React.FC<TokenSearchProps> = (props) => {
  const { filters, url, type = 'token' } = props; 

  const history = useHistory();
  const { chainId } = useWeb3();
  const tokenList = useTokenList();

  const [timeout,  setClearTimeOut] = useState<number>(-1);
  const [founded, setFounded] = useState<Currency[]>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);


  useEffect(() => {
      if(tokenList && searchKey){
        if(Web3.utils.isAddress(searchKey)){
          setLoading(true);
          search<{ search: { subject: Currency }[] }>(searchKey).then(result => {
  
            if(!result.loading && result?.data){
              const founds = result?.data?.search?.map( s => s.subject);
              setFounded(founds);
            }
            else if(!result.loading && result?.errors != null && result?.errors.length > 0){
              console.error('search errors', result.errors);
            }
          })
          .catch( error => console.error('search', error))
          .finally(() => setLoading(false));
        }else{
          const searchTokens = filterTokensInfoByString(tokenList.tokens, searchKey)
          setFounded(searchTokens);

        }

      }
   

    
  }, [searchKey, tokenList]);

  const onPairSelected = (currency: Currency|null) => {
    if (currency && type === 'token') {
      history.push(`${url}/${currency.address}`);
    }
    if (currency && type === 'pair') {
      if(searchKey && Web3.utils.isAddress(searchKey)){
        history.push(`${url}/${currency.address}`);
      }else{
        // @NOTE get chain id from user current network
        history.push(`${url}/${currency.address}-${getNativeCoinWrapped(chainId || ChainId.Mainnet).toUpperCase()}`);
      }
    
    }
  }
  const getOptionLabel = (option:Currency) => {
    if(type === 'token' || (searchKey && Web3.utils.isAddress(searchKey))){
      return `${option.name} (${option.symbol}) - ${option.address.slice(0, 12)}...`
    }else{
      return `${option.name.slice(0, 8)}... - ${option.symbol}/${getNativeCoinWrapped(chainId || ChainId.Mainnet).toUpperCase()} - ${option.address.slice(0, 12)}...`
    }
    

  }


  return (
    <GridContainer>

      <Grid item xs={12} md={filters != null ? 8 : 12}>

        <Autocomplete
          id="combo-box-search"
          options={founded || []}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField {...params} 
              placeholder={'Search by name, symbol or paste address'}
              variant="outlined"
              onChange={($e) => setSearchKey($e.target.value)}
            />
          )}
          onChange={($e, value) => onPairSelected(value)}
        />

        {/* <TextField
          fullWidth
          variant='outlined'
          onChange={($e) => setSearchKey($e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position={positionIcon ?? 'start'}>
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        /> */}
      </Grid>
      { filters && <Grid item xs={12} md={4}>
        <FormControl fullWidth  >
          <InputLabel style={{ marginLeft: 20 }} id="demo-simple-select-label">Filter</InputLabel>
          <Select
            variant='outlined'
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
          >
            <MenuItem value="">
              <em>View All</em>
            </MenuItem>
            {
              filters.forEach((value, key) => (
                <MenuItem value={value}>
                  <em>{key}</em>
                </MenuItem>
              ))
            }
          </Select>
        </FormControl >
      </Grid>}
    </GridContainer>


  )

}