import React from 'react';
import { Select } from '@material-ui/core';
import { TokenMetaData } from '@types';

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
            <option
            key={_token.symbol} 
            value={Object.values(_token.addresses)[0]}
            >
              {_token.symbol.toUpperCase()}
            </option> 
          ))
        }
      </Select>
);

export default SelectToken;