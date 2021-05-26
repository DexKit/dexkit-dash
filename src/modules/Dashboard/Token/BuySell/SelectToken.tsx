import React from 'react';
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
  textField: {
    '& .MuiOutlinedInput-root': {
      paddingLeft: '55px',
    },
    // '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    //   border: 'none',
    // },
  },
});

const SelectBox = styled.div`
  display: flex;
  position: relative;

  & img {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  /* padding: 0 8px;
  overflow: hidden;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  pointer-events: none;
  border-color: rgba(255, 255, 255, 0.23);
  display: flex;
  align-items: center;
  justify-content: center; */
`;

const SelectOption = styled.div`
  display: flex;
  align-items: center;

  & img {
    margin-right: 10px;
  }
`;

const SelectToken: React.FC<Props> = ({id, selected, options, onChange}) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState('');

  const OPTIONS_LIMIT = 10;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options: any, state: FilterOptionsState<any>): any => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT + 1);
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
          renderOption={(option) => (
            <SelectOption>
              <TokenLogo token0={option.address} />
              {option.name}
            </SelectOption>
          )}
          renderInput={(params) => (
            <SelectBox>
              <TokenLogo token0={selected.address} />
              <TextField
                {...params}
                placeholder={'Search by name, symbol or paste address'}
                variant='outlined'
                className={classes.textField}
                // onChange={($e) => search($e.target.value)}
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
