import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Web3 from 'web3';
import {useWeb3} from 'hooks/useWeb3';
import {useTokenList} from 'hooks/useTokenList';
// import {searchByAddress} from 'services/graphql/bitquery';
import {ChainId} from 'types/blockchain';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {filterTokensInfoByString, getNativeCoinWrapped} from 'utils/tokens';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import GridContainer from '@crema/core/GridContainer';
import {Token} from 'types/app';
import {
  SearchByAddress,
  SearchByAddressVariables,
} from 'services/graphql/bitquery/__generated__/SearchByAddress';
import {SEARCH_BY_ADDRESS} from 'services/graphql/bitquery/gql';
import {client} from 'services/graphql';
import {GET_CHAIN_FROM_NETWORK} from 'shared/constants/Blockchain';

interface TokenSearchProps {
  exchangeName: EXCHANGE;
  networkName: EthereumNetwork;
  type?: 'token' | 'pair' | 'pool';
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

export const TokenSearchByList: React.FC<TokenSearchProps> = (props) => {
  const {filters, exchangeName, type = 'token', networkName} = props;
  const history = useHistory();
  const chainId = GET_CHAIN_FROM_NETWORK(networkName);
  const tokenList = useTokenList(networkName);

  const [found, setFound] = useState<Token[]>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const searchByAddress = (value: string, network: any) => {
    return client.query<SearchByAddress, SearchByAddressVariables>({
      query: SEARCH_BY_ADDRESS,
      variables: {
        network: network,
        value: value,
      },
    });
  };

  useEffect(() => {
    if (tokenList && searchKey) {
      if (Web3.utils.isAddress(searchKey)) {
        setLoading(true);
        searchByAddress(searchKey, networkName)
          .then((result: any) => {
            if (!result.loading && result?.data) {
              const founds = result?.data?.search?.map((s: any) => s.subject);
              const parsedFounds = founds
                ?.filter((f: any) => f.currencyAddress)
                .map((f: any) => {
                  return {
                    ...f,
                    address: f.currencyAddress,
                  };
                });

              if (founds) {
                setFound(parsedFounds);
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
      } else {
        const searchTokens = filterTokensInfoByString(
          tokenList,
          searchKey,
        ).slice(0, 10);
        setFound(searchTokens);
      }
    }
  }, [searchKey, tokenList]);

  const onPairSelected = (currency: Token | null) => {
    const url = `/${networkName}/protocol-explorer/${exchangeName}`;
    if (currency && type === 'token') {
      history.push(`${url}/token-explorer/${currency.address}`);
    }
    if (currency && type === 'pair') {
      if (searchKey && Web3.utils.isAddress(searchKey)) {
        history.push(`${url}/pair-explorer/${currency.address}`);
      } else {
        // @NOTE get chain id from user current network
        history.push(
          `${url}/pair-explorer/${currency.address}-${getNativeCoinWrapped(
            chainId || ChainId.Mainnet,
          ).toUpperCase()}`,
        );
      }
    }
    if (currency && type === 'pool') {
      if (searchKey && Web3.utils.isAddress(searchKey)) {
        history.push(`${url}/pool-explorer/${currency.address}`);
      } else {
        // @NOTE get chain id from user current network
        history.push(
          `${url}/pool-explorer/${currency.address}-${getNativeCoinWrapped(
            chainId || ChainId.Mainnet,
          ).toUpperCase()}`,
        );
      }
    }
  };

  const getOptionLabel = (option: Token) => {
    if (type === 'token' || (searchKey && Web3.utils.isAddress(searchKey))) {
      return `${option.name} (${option.symbol}) - ${option.address.slice(
        0,
        12,
      )}...`;
    } else {
      return `${option.name.slice(0, 8)}... - ${
        option.symbol
      }/${getNativeCoinWrapped(
        chainId || ChainId.Mainnet,
      ).toUpperCase()} - ${option.address.slice(0, 12)}...`;
    }
  };

  return (
    <GridContainer>
      <Grid item xs={12} md={filters != null ? 8 : 12}>
        <Autocomplete
          id='combo-box-search'
          options={found || []}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={'Search by name, symbol or paste address'}
              variant='outlined'
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
      {filters && (
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel style={{marginLeft: 20}} id='demo-simple-select-label'>
              Filter
            </InputLabel>
            <Select
              variant='outlined'
              labelId='demo-simple-select-helper-label'
              id='demo-simple-select-helper'>
              <MenuItem value=''>
                <em>View All</em>
              </MenuItem>
              {isLoading && (
                <MenuItem>
                  <em>Loading ...</em>
                </MenuItem>
              )}
              {filters.forEach((value, key) => (
                <MenuItem value={value}>
                  <em>{key}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </GridContainer>
  );
};
