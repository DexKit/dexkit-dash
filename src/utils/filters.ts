
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

export const getFilterValueById = (id: string, filters?: Filters[]) => {
    if(filters && filters.length > 0 ){
        const filter = filters.find(f=> f.id === id);
        if(filter && filter.enable){
            return filter.value;
        }else{
            return null;
        }
    }else{
        return null;
    }
}