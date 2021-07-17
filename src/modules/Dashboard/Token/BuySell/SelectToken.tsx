import React, { useEffect } from 'react';
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

import { VariableSizeList, ListChildComponentProps } from 'react-window';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import { filterTokensInfoByString } from 'utils/tokens';
interface Props {
  id: string;
  selected: Token | undefined;
  options: Token[];
  disabled?: boolean;
  limitCoins?: boolean;
  label?: string;
  onChange: ($token: Token | undefined) => void;
}

const LISTBOX_PADDING = 12; // px

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
  const { data, index, style } = props;
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
const ListboxComponent = React.forwardRef<HTMLDivElement>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const smUp = useMediaQuery((theme: any) => theme.breakpoints.up('sm'), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 40 : 58;

  const getChildSize = (child: React.ReactNode) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 58;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: number) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

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
  label,
  limitCoins
}) => {
  const classes = useStyles();

  const [inputValue, setInputValue] = React.useState(selected?.symbol);

  const filterOptions = (options: any, state: FilterOptionsState<any>): any => {
    const filterValue = state.inputValue;
    return filterTokensInfoByString(options, filterValue);
  
  
  };
  //NOTE: This is due to bug on autocomplete
  useEffect(()=> {
    if(selected){
      setInputValue(selected?.symbol);
    }
   
  },[selected])

  const getSymbol = (sel:any)=>{
    console.log(sel)
    return sel.symbol;


  }

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
        (id && selected) && (
          <Autocomplete
            id={id}
            closeIcon={false}
            disabled={disabled || false}
            filterOptions={filterOptions}
            ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
            options={options.filter(
              (option) => option.symbol.toLowerCase() || option.address.toLowerCase() || option.name.toLowerCase(),
            )}
            defaultValue={selected}
            onChange={(event, value) => onChange(value ?? undefined)}
            getOptionLabel={(e) => `${e.symbol}`}
            renderOption={(option) => (
              <SelectOption>
                <TokenLogo token0={option.address} networkName={option?.networkName} logoURL0={option?.logoURI}/>
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
                { selected && <TokenLogo token0={selected?.address} networkName={selected?.networkName} logoURL0={selected?.logoURI}/>}
                 <TextField
                  {...params}
                  defaultValue={selected?.symbol}
                  label={label || "Search a coin"}
                  placeholder={
                    selected
                      ? selected.symbol
                      : 'Search by name, symbol or paste address'
                  }
                  variant='outlined'
                  className={classes.textField}
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
