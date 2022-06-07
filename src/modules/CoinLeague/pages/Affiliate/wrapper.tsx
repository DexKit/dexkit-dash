import React from 'react';
import AffiliatePage from '.';
import {FilterContext} from 'providers/protocol/filterContext';
import {useFilter} from 'hooks/shared/useFilter';

const AfilliatePageWrapper = () => {
  const fromFilter = useFilter({type: 'datetime', label: 'From', id: 'from'});
  const toFilter = useFilter({type: 'datetime', label: 'To', id: 'to'});

  const filters = [fromFilter, toFilter];
  return (
    <FilterContext.Provider
      value={{
        filters,
      }}>
      <AffiliatePage />
    </FilterContext.Provider>
  );
};

export default AfilliatePageWrapper;
