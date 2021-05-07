import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import GridContainer from '@crema/core/GridContainer';
import {  FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { search } from 'services/graphql/bitquery';
import { Autocomplete } from '@material-ui/lab';
import { useTokens } from 'hooks/useTokens';
import { Pair, Token } from 'types/app';
import { EXCHANGE } from 'shared/constants/AppEnums';
import { useNetwork } from 'hooks/useNetwork';

interface TokenSearchProps {
  exchangeName?: EXCHANGE;
  type?: 'token' | 'pair';
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

export const TokenSearch: React.FC<TokenSearchProps> = (props) => {

  const history = useHistory();
  const network = useNetwork();
  const tokens  = useTokens(network);

  const [timeout, setClearTimeOut] = useState<number>(-1);
  const [founded, setFounded] = useState<Pair[]>();
  const [searchKey, setSearchKey] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(useCallback(() => {
    clearTimeout(timeout as number);

    const _timeout: number = setTimeout(() => {
      if(searchKey != null) {
        setLoading(true);

        const tokensFounded: Token[] = tokens.filter(e => {
          return (
            e.symbol.toLowerCase().search(searchKey) != -1 ||
            e.name.toLowerCase().search(searchKey) != -1 ||
            e.address.toLowerCase().search(searchKey) != -1
          )
        });

        console.log(props);
        console.log(tokensFounded);
 
        if (props.type == undefined || props.type == 'token') {
          setFounded(tokensFounded.map(e => { return { address: e.address, token0: e, token1: e } }));
        }
        else if (props.exchangeName && tokensFounded.length > 0) {   
          console.log('aqui')       
          search(network, props.exchangeName, tokensFounded.map(e => e.address.toLowerCase()))
            .then(result => { console.log(tokensFounded); setFounded(result) })
            .catch(error => console.error('search', error))
        } else {
          setFounded([]);
        }

        setLoading(false);
      }
    }, 1200) as unknown as number;

    setClearTimeOut(_timeout);
  }, [searchKey, timeout, isLoading]), [searchKey]);


  const onPairSelected = (currency: Pair|null) => {
    if (currency) {
      history.push(`${currency.address}`);
    }
  }


  return (
    <GridContainer>

      <Grid item xs={12} md={props.filters != null ? 8 : 12}>

        <Autocomplete
          id="combo-box-search"
          placeholder={(props.type == 'pair') ? `Find Pair by name, symbol and address...` : `Find Token by name, symbol and address...`}
          options={founded || []}
          getOptionLabel={(option) => (props.type == 'pair') ? 
            `${option.token0.symbol}/${option.token1.symbol} - ${option.address.slice(0, 16)}...` : 
            `${option.token0.name} (${option.token0.symbol}) - ${option.address.slice(0, 16)}...` }
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
      { props.filters && <Grid item xs={12} md={4}>
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
              props.filters.forEach((value, key) => (
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