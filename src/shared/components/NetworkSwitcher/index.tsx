import { Box, Button, Chip, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { FORMAT_NETWORK_NAME } from "shared/constants/Bitquery";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';




interface Props{
 networkName: EthereumNetwork;
 onClick: (network: EthereumNetwork) => any;
 style?: any;
}


const supportedNetworks = [EthereumNetwork.bsc, EthereumNetwork.ethereum];

const NetworkSwitcher = (props: Props) => {
    const {networkName, onClick, style} = props;


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkClick = (network: EthereumNetwork) => {
    handleClose();
    onClick(network);

  }

  return (
    <div style={style}>

      <Chip  color={'default'}  clickable label={<Box display={'flex'} alignItems={'center'}>{FORMAT_NETWORK_NAME(networkName)}<ExpandMoreIcon/> </Box>} onClick={handleClick} />
      <Menu
        id="network-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
     {supportedNetworks.filter(n => n !== networkName).map(n => 
                    <MenuItem onClick={() => handleNetworkClick(n)}>
                      <Chip  color={ 'default'}  label={FORMAT_NETWORK_NAME(n)}  />  
                   </MenuItem>) } 
        </Menu>
       
    </div>
  );




}

export default NetworkSwitcher