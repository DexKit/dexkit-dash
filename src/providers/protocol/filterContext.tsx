import React from "react";

interface Filters{
    id: string;
    type: string;
    label: string;
    value: any;
    onClose: any;
    onChange: any;
    onEnable: any;
    enable: boolean;
}


interface FilterContextProps{
    filters?: Filters[]
}


export const FilterContext = React.createContext<FilterContextProps>({});