import React, {useState, useCallback} from 'react';

import {
  Box,
  MenuItem,
  Menu,
  Button,
  Typography,
} from '@material-ui/core';
/*
Enable these imports to use 
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';*/
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {  GET_GAME_ORDER_OPTIONS } from 'modules/CoinLeagues/utils/game';
import { GameOrderBy } from 'modules/CoinLeagues/constants/enums';

interface Props{
    onSelectGameOrder: (value: GameOrderBy) => void;
}


export const GameOrderByDropdown = (props: Props) => {
  const { onSelectGameOrder } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(true);

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  },[]);

  const handleMenuItemClick = useCallback( (_event: any, index: any) => {
    setSelectedIndex(index);  
    // If direction enable we use first descending, 
   // const ind = direction ? index : index + 1;
    onSelectGameOrder(GET_GAME_ORDER_OPTIONS()[index].value)
    setAnchorEl(null);
  },[direction]);

  const handleClose =  () => {
    setAnchorEl(null);
  };

 /* const toggleDirection = useCallback(() => {
    const ind = !direction ? selectedIndex : selectedIndex + 1;
    onSelectGameOrder(GET_GAME_ORDER_OPTIONS()[ind].value)
    setDirection(!direction);
  },[direction, selectedIndex]);*/

  return (
    <>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>   
       {/* <Tooltip title={direction ? 'Descending' : 'Ascending'}>
         <IconButton aria-label="direction" onClick={toggleDirection} size={'small'}>
         {direction ?  <ArrowDownwardIcon fontSize="inherit" /> :  <ArrowUpwardIcon fontSize="inherit" />}
        </IconButton>
        </Tooltip>*/}
        <Typography>
          Order by: 
        </Typography>
        <Button
          aria-controls='simple-menu'
          aria-haspopup='true'
          onClick={handleClick}
          endIcon={<ExpandMoreIcon />}
          >
         {GET_GAME_ORDER_OPTIONS()[selectedIndex].label} 
        </Button>
      </Box>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {GET_GAME_ORDER_OPTIONS().map((option, index) => (
          <MenuItem
            key={option.value}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
