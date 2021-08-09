import {useFilter} from 'hooks/shared/useFilter';
import React from 'react';
import {FilterContext} from './filterContext';

export const TokenFilterProvider: React.FC<React.ReactNode> = ({children}) => {
  const fromFilter = useFilter({type: 'datetime', label: 'From', id: 'from'});
  const toFilter = useFilter({type: 'datetime', label: 'To', id: 'to'});
  const tradeAmountFilter = useFilter({
    type: 'amountusd',
    label: 'Trade Amount >',
    defaultValue: '0',
    id: 'tradeAmount',
  });

  const filters = [fromFilter, toFilter, tradeAmountFilter];

  return (
    <FilterContext.Provider
      value={{
        filters,
      }}>
      {children}
    </FilterContext.Provider>
  );
};
