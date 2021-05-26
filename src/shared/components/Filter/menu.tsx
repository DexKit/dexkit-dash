import React, { useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FilterContext } from 'providers/protocol/filterContext';

interface Filter {  
    label: string;
    onEnable: () => void;
}

interface Props {
    filters?: Filter[]
}


const FilterMenu = () => {
  const {
    filters
  } = useContext(FilterContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseFilter = (callback: any) => {
    setAnchorEl(null);
    callback();
  };

  const onClearAll = () => {
    if(filters){
      filters?.forEach(f => f.onClose());
    }
 
  }
 
  return (
    <div>
      <IconButton 
        aria-label="delete"
        id="fade-button"
        aria-controls="fade-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FilterListIcon fontSize="large" />
     </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
      >
          {filters && filters.filter(f=> !f.enable).map((f, i) => 
                 <MenuItem onClick={()=> handleCloseFilter(f.onEnable)} key={i}>{f.label}</MenuItem>)}
          {(filters && filters.filter(f=> !f.enable).length === 0) &&  <MenuItem onClick={onClearAll} key={'clear-all'}>Clear All</MenuItem>}


      </Menu>
    </div>
  );
}


export default FilterMenu;