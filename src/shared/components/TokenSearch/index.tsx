import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import GridContainer from '@crema/core/GridContainer';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
// import { SearchRounded } from '@material-ui/icons';
import { search } from 'services/graphql/bitquery';
import { Currency } from '@types';
import { Autocomplete } from '@material-ui/lab';
import { useWeb3 } from 'hooks/useWeb3';
interface TokenSearchProps {
  url: string,
  type?: 'token' | 'pair',
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

export const TokenSearch: React.FC<TokenSearchProps> = (props) => {
  const { filters, url } = props; 

  const history = useHistory();
  const {chainId} = useWeb3();

  const [timeout,  setClearTimeOut] = useState<number>(-1);
  const [founded, setFounded] = useState<Currency[]>();
  const [searchKey, setSearchKey] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);


  useEffect(useCallback(() => {
    
    clearTimeout(timeout as number);

    const _timeout: number = setTimeout(() => {
      if(searchKey != null) {

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
      }
    }, 1200) as unknown as number;

    setClearTimeOut(_timeout);
  }, [searchKey, timeout, isLoading]), [searchKey]);

  const onPairSelected = (currency: Currency|null) => {
    if (currency) {
      history.push(`${url}/${currency.address}`);
    }
  }

  return (
    <GridContainer>

      <Grid item xs={12} md={filters != null ? 8 : 12}>

        <Autocomplete
          id="combo-box-search"
          options={founded || []}
          getOptionLabel={(option) => `${option.name} (${option.symbol}) - ${option.address.slice(0, 12)}...`}
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