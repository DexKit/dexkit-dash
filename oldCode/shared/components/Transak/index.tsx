import React from 'react';
import { Button } from '@material-ui/core';


// const onBuy = (walletAddress: string, ): transakSDK => {
//   const transak = getTransak(
//     walletAddress,
//     '#0A8FDC',
//     '',
//     'GBP',
//     undefined,
//     '450px',
//     '400px'
//   );
//   transak.init();
//   return transak;
// }

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