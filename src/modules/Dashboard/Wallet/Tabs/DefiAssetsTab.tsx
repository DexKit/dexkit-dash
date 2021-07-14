
import React from 'react';
import {Grid} from '@material-ui/core';
import DefiCoins from '../DefiCoins';
import {useDefi} from 'hooks/useDefi';

export const DefiAssetsTab = (account: string) => {
    const {defiBalance} = useDefi(account);


    return (
        <Grid item xs={12} md={6} style={{marginTop: 15}}>
              <DefiCoins {...defiBalance} />
        </Grid>
    )

}