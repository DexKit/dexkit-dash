import React from 'react';
import {
  Autocomplete,
  createFilterOptions,
  FilterOptionsState,
} from '@material-ui/lab';
import {Token} from 'types/app';
import {Chip, makeStyles, TextField, Box} from '@material-ui/core';
import TokenLogo from 'shared/components/TokenLogo';
import styled from 'styled-components';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';

interface Props {
  id: string;
  selected: Token | undefined;
  options: Token[];
  disabled?: boolean;
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

const SelectToken: React.FC<Props> = ({
  id,
  selected,
  options,
  disabled,
  onChange,
}) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState('');

  const OPTIONS_LIMIT = 10;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options: any, state: FilterOptionsState<any>): any => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT + 1);
  };

  return (
    <>
      {options.length === 0 ? (
        <Autocomplete
          closeIcon={false}
          disabled={disabled}
          options={[]}
          onChange={(event, value) => onChange(value ?? undefined)}
          inputValue={inputValue}
          renderInput={(params) => (
            <SelectBox>
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
      ) : (
        id &&
        selected && (
          <Autocomplete
            id={id}
            closeIcon={false}
            disabled={disabled || false}
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
            getOptionLabel={(e) => `${e.symbol}`}
            renderOption={(option) => (
              <SelectOption>
                <TokenLogo token0={option.address} />
                {option.name}
                {option?.networkName && (
                  <Box pl={1}>
                    <Chip
                      label={FORMAT_NETWORK_NAME(option?.networkName)}
                      color={'default'}
                      size={'small'}
                    />
                  </Box>
                )}
              </SelectOption>
            )}
            renderInput={(params) => (
              <SelectBox>
                <TokenLogo token0={selected.address} />
                <TextField
                  {...params}
                  placeholder={
                    selected
                      ? selected.symbol
                      : 'Search by name, symbol or paste address'
                  }
                  variant='outlined'
                  className={classes.textField}
                  // onChange={($e) => search($e.target.value)}
                />
              </SelectBox>
            )}
          />
        )
      )}
    </>
  );
};

export default SelectToken;
