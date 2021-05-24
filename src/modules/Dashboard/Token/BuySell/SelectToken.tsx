import React, {useEffect, useState} from 'react';
import {
  Autocomplete,
  createFilterOptions,
  FilterOptionsState,
} from '@material-ui/lab';
import {Token} from 'types/app';
import {truncateAddress} from 'utils';
import {makeStyles, TextField} from '@material-ui/core';
import TokenLogo from 'shared/components/TokenLogo';
import styled from 'styled-components';

interface Props {
  id: string;
  selected: Token | undefined;
  options: Token[];
  onChange: ($token: Token | undefined) => void;
}

const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
});

const SelectBox = styled.div`
  padding: 0 8px;
  overflow: hidden;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  pointer-events: none;
  border-color: rgba(255, 255, 255, 0.23);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectToken: React.FC<Props> = ({id, selected, options, onChange}) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState('');

  const OPTIONS_LIMIT = 10;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options: any, state: FilterOptionsState<any>): any => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT + 1);
  };

  const [found, setFound] = useState<Token[]>();

  useEffect(() => {
    if (found == null) {
      setFound(options);
    }
  }, []);

  const search = (value: string) => {
    const list = options.filter(
      (e) =>
        e.symbol.toLowerCase() === value.toLowerCase() ||
        e.address.toLowerCase().includes(value.toLowerCase()) ||
        e.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFound(list);
  };

  return (
    <>
      {id && options && selected && (
        <Autocomplete
          id={id}
          closeIcon={false}
          filterOptions={filterOptions}
          options={options.filter(
            (option) => option.symbol || option.address || option.name,
          )}
          value={selected}
          onChange={(event, value) => onChange(value ?? undefined)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          getOptionLabel={(e) => `${e.symbol} - ${truncateAddress(e.address)}`}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={'Search by name, symbol or paste address'}
              variant='outlined'
              // onChange={($e) => search($e.target.value)}
            />
          )}
        />
      )}

      {id && options && selected && found && (
        <Autocomplete
          id={id}
          closeIcon={false}
          options={found || []}
          defaultValue={selected}
          renderOption={(option) => (
            <React.Fragment>
              <TokenLogo token0={option.address} />
              {option.name}
            </React.Fragment>
          )}
          getOptionLabel={(e) => `${e.symbol} - ${truncateAddress(e.address)}`}
          renderInput={(params) => (
            <SelectBox>
              <TokenLogo token0={selected.address}></TokenLogo>
              <TextField
                {...params}
                placeholder={'Search by name, symbol or paste address'}
                variant='outlined'
                onChange={($e) => search($e.target.value)}
                className={classes.root}
              />
            </SelectBox>
          )}
        />
      )}

      {/* <Select
        fullWidth
        native
        variant='outlined'
        onChange={onChange}
        value={selected != null ? selected.address.toLowerCase() : undefined}
      >
        {
          options.map( _token => (
            <option key={`${id}-${_token.symbol}`} value={_token.address.toLowerCase()}>
              {_token.symbol.toUpperCase()}
            </option>
          ))
        }
      </Select> */}
    </>
  );
};

export default SelectToken;
