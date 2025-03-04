import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import {useTokenList} from 'hooks/useTokenList';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {filterTokensInfoByString, findTokensInfoByAddress} from 'utils/tokens';
import {
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import GridContainer from '@crema/core/GridContainer';
import {Token} from 'types/app';
import {
  SearchCurrencyByAddress,
  SearchCurrencyByAddressVariables,
} from 'services/graphql/bitquery/__generated__/SearchCurrencyByAddress';
import {SEARCH_CURRENCY_BY_ADDRESS} from 'services/graphql/bitquery/gql';
import {client} from 'services/graphql';
//@ts-ignore
import {VariableSizeList, ListChildComponentProps} from 'react-window';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import TokenLogo from './TokenLogo';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';

interface TokenSearchProps {
  onClick: any;
  selectedTokenAddress?: string;
  positionIcon?: 'start' | 'end';
  filters?: Map<string, string>;
}

const LISTBOX_PADDING = 28; // px

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

function renderRow(props: ListChildComponentProps) {
  const {data, index, style} = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(
  function ListboxComponent(props, ref) {
    const {children, ...other} = props;
    const itemData = React.Children.toArray(children);
    const smUp = useMediaQuery((theme: any) => theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 48 : 58;

    const getChildSize = (child: React.ReactNode) => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 68;
      }

      return itemSize;
    };

    const getHeight = () => {
      return 68 * itemSize;
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width='100%'
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType='ul'
            itemSize={(index: number) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}>
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: '#252836',
    borderStyle: 'none !important',
    borderWidth: '0 !important',
    border: 'none !important',
    color: '#7A8398',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontStyle: 'normal',
  },
  noBorder: {
    borderWidth: '0 !important',
    border: 'none !important',
  },
}));

export const TokenSearch: React.FC<TokenSearchProps> = (props) => {
  const {filters, onClick, selectedTokenAddress} = props;

  const [found, setFound] = useState<Token[]>();
  const [val, setVal] = useState<Token | null>();
  const [, setInputVal] = useState<Token | null>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [, setLoading] = useState<boolean>(false);

  const tokenListEth = useTokenList(EthereumNetwork.ethereum);
  const tokenListBsc = useTokenList(EthereumNetwork.bsc);
  const tokenListMatic = useTokenList(EthereumNetwork.matic);

  const searchByAddress = (value: string) => {
    return client.query<
      SearchCurrencyByAddress,
      SearchCurrencyByAddressVariables
    >({
      query: SEARCH_CURRENCY_BY_ADDRESS,
      variables: {
        value: value,
      },
    });
  };

  useEffect(() => {
    if (!searchKey) {
      const searchTokens = filterTokensInfoByString(
        tokenListEth.concat(tokenListBsc),
        searchKey,
      );
      setFound(searchTokens);
    }

    if (searchKey && !Web3.utils.isAddress(searchKey)) {
      const searchTokens = filterTokensInfoByString(
        tokenListEth.concat(tokenListBsc).concat(tokenListMatic),
        searchKey,
      );
      setFound(searchTokens);
    }
  }, [searchKey, tokenListEth, tokenListBsc, tokenListMatic]);

  const getOptionLabel = (option: Token) => {
    if (searchKey && Web3.utils.isAddress(searchKey)) {
      return `${
        option.name
      } (${option.symbol.toUpperCase()}) - ${option.address.slice(0, 12)}...`;
    } else {
      return `${option.name.slice(0, 8)} - ${option.symbol}`;
    }
  };

  const renderOption = (option: Token) => {
    return (
      <Box width='100%' display='block' py={4}>
        <Grid container alignItems='center' spacing={4}>
          <Grid item>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center '
              alignContent='center'>
              <TokenLogo
                token={option.address ?? option.symbol}
                logoURL={option.logoURI}
                network={option.networkName as EthereumNetwork}
              />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant='body1'>{option.name}</Typography>
            <Typography color='textSecondary' variant='body2'>
              {option.symbol.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              size='small'
              label={FORMAT_NETWORK_NAME(option.networkName as EthereumNetwork)}
              color='default'
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  useEffect(() => {
    if (!val && selectedTokenAddress) {
      const tk = findTokensInfoByAddress(
        tokenListEth.concat(tokenListBsc),
        selectedTokenAddress,
      );
      if (tk) {
        setVal(tk);
        setInputVal(tk);
      }
    }
  }, [selectedTokenAddress, tokenListEth, tokenListBsc]);

  const onClickAuto = (token: Token | null) => {
    setVal(token);
    onClick(token);
  };

  const onSearchKey = (key: string) => {
    if (key && Web3.utils.isAddress(key)) {
      const tk = findTokensInfoByAddress(
        tokenListEth.concat(tokenListBsc),
        key,
      );
      if (tk) {
        setFound([tk]);
        onClick(tk);
        return;
      }
      setLoading(true);
      searchByAddress(key)
        .then((result: any) => {
          if (!result.loading && result?.data) {
            const founds = result?.data?.search;
            const parsedFounds = founds
              ?.filter((f: any) => f.subject?.currencyAddress)
              .map((f: any) => {
                return {
                  ...f.subject,
                  address: f.subject.currencyAddress,
                  networkName: f.network.network as EthereumNetwork,
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
  };

  const theme = useTheme();

  const classes = useStyles();

  return (
    <GridContainer>
      <Grid item xs={12} md={filters != null ? 8 : 12}>
        <Autocomplete
          id='combo-box-search'
          options={found || []}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          ListboxComponent={
            ListboxComponent as React.ComponentType<
              React.HTMLAttributes<HTMLElement>
            >
          }
          className={classes.noBorder}
          classes={{
            inputRoot: classes.input,
            input: classes.input,
            root: classes.noBorder,
          }}
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
