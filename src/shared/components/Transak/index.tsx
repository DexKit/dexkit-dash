import React from 'react';
import { Button } from '@material-ui/core';

interface Props {
}


const Transak: React.FC<Props> = (props) => {

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={(e: any) => { 
        if (e) {
          // setTransakInstance(onBuy(account));
        }
      }}
      size="small"
      disableElevation
    >
      Buy
    </Button>
  )
}

export default Transak;