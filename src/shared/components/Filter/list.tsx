import { FilterContext } from "providers/protocol/filterContext";
import React, { useContext } from "react";
import AmountUsdField from "./Fields/amountUsd";
import DateAndTimePickerFilterField from "./Fields/datetime";




const FilterList = () => {
    const {
        filters
      } = useContext(FilterContext);
  return (
        <>
            {filters && filters.map( (f, i) => {
                    switch (f.type) {
                        case 'datetime':
                            return <DateAndTimePickerFilterField {...f}/>;    
                        case 'amountusd':
                            return <AmountUsdField {...f}/>;     
                        default:
                        return null;
                    }
            }
        )}
        </> 
  );
}


export default FilterList;