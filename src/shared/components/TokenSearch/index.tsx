import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import {useTokenList} from 'hooks/useTokenList';
// import {searchByAddress} from 'services/graphql/bitquery';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {filterTokensInfoByString, findTokensInfoByAddress} from 'utils/tokens';
import {
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import GridContainer from '@crema/core/GridContainer';
import { Token } from 'types/app';
import { SearchCurrencyByAddress, SearchCurrencyByAddressVariables } from 'services/graphql/bitquery/__generated__/SearchCurrencyByAddress';
import { SEARCH_CURRENCY_BY_ADDRESS } from 'services/graphql/bitquery/gql';
import { client } from 'services/graphql';

import TokenLogo from './TokenLogo';
import { FORMAT_NETWORK_NAME } from 'shared/constants/Bitquery';

interface TokenSearchProps {
  onClick: any;
  selectedTokenAddress?: string;
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

export const TokenSearch: React.FC<TokenSearchProps> = (props) => {
  const {filters, onClick, selectedTokenAddress } = props;

  const [found, setFound] = useState<Token[]>();
  const [val, setVal] = useState<Token | null>();
  const [inputVal, setInputVal] = useState<Token | null>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const tokenListEth = useTokenList(EthereumNetwork.ethereum);
  const tokenListBsc = useTokenList(EthereumNetwork.bsc);

  const searchByAddress = (value: string) => {
    return client.query<SearchCurrencyByAddress, SearchCurrencyByAddressVariables>({
      query: SEARCH_CURRENCY_BY_ADDRESS,
      variables: {
        value: value
      }
    })
  }

  useEffect(() => {
    if(!searchKey){
      const searchTokens = filterTokensInfoByString(
        tokenListEth.concat(tokenListBsc),
        searchKey,
      ).slice(0, 30);
      setFound(searchTokens);
    }

    if (searchKey && !Web3.utils.isAddress(searchKey)) {
        const searchTokens = filterTokensInfoByString(
        tokenListEth.concat(tokenListBsc),
        searchKey,
        ).slice(0, 30);
        setFound(searchTokens);  
      
    }
  }, [searchKey, tokenListEth, tokenListBsc]);

  
  const getOptionLabel = (option: Token) => {
    if ( searchKey && Web3.utils.isAddress(searchKey)) {
      return `${option.name} (${option.symbol.toUpperCase()}) - ${option.address.slice(
        0,
        12,
      )}...`;
    } else {
      return `${option.name.slice(0, 8)} - ${
        option.symbol
      }`;
    }
  };
  const renderOption = (option: Token) => {
    return ( <Box display={'flex'} alignItems={'center'}>
                  <TokenLogo token={option.address ?? option.symbol} logoURL={option.logoURI}  network={option.networkName as EthereumNetwork} />
                  <Typography component={'h6'} style={{marginLeft: '3px'}}>{option.name} - {option.symbol.toUpperCase()}</Typography>
                
                  <Box style={{marginLeft: '4px'}}>  
                    <Chip
                        label={FORMAT_NETWORK_NAME(option.networkName as EthereumNetwork)}                    
                        color={ 'default'}
                      />  
                    </Box>
              </Box>
    )

  }
  useEffect(()=> {
    if(!val && selectedTokenAddress){
      const tk = findTokensInfoByAddress(tokenListEth.concat(tokenListBsc), selectedTokenAddress);
      if(tk){
       setVal(tk);
       setInputVal(tk);
      }
    }

  }, [selectedTokenAddress, tokenListEth, tokenListBsc])




  const onClickAuto = (token: Token | null) => {
    setVal(token);
    onClick(token);
  }

  const onSearchKey = (key: string) => {
    if ( key && Web3.utils.isAddress(key)) {
      const tk = findTokensInfoByAddress(tokenListEth.concat(tokenListBsc),key);
      if(tk){
       setFound([tk]);
       onClick(tk);
       return;
      }
     setLoading(true);
     searchByAddress(key)
       .then((result: any) => {
         if (!result.loading && result?.data) {
           const founds = result?.data?.search;
           const parsedFounds = founds?.filter((f: any) => f.subject?.currencyAddress)
             .map((f: any) => {
               return {
                 ...f.subject,
                 address: f.subject.currencyAddress,
                 networkName: f.network.network as EthereumNetwork

               };
             });

           if (founds && parsedFounds.length) {
             setFound(parsedFounds);
             onClick(parsedFounds[0]);
           }
         } else if (
           !result.loading &&
           result?.errors != null &&
           result?.errors.length > 0
         ) {
           console.error('search errors', result.errors);
         }
       })
       .catch((error: any) => console.error('search', error))
       .finally(() => setLoading(false));
    }
    setSearchKey(key);
    
  }



  return (
    <GridContainer>
      <Grid item xs={12} md={filters != null ? 8 : 12}>
        <Autocomplete
          id='combo-box-search'
          options={found || []}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={'Search by name, symbol or paste address'}
              variant='outlined'
              onChange={($e) => onSearchKey($e.target.value)}
            />
          )}
          onChange={($e, value) => onClickAuto(value)}
        />
      </Grid>

    </GridContainer>
  );
};
