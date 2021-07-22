import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { Changelly } from "services/rest/changelly";
import { ChangellyCoin } from "types/changelly"

type OnChange = (address: string) => any

interface Props{
    coin?: ChangellyCoin;
    onChange: OnChange;
    address?: string;
    validAddress: boolean;
    onSetValidAddress: (validAddress: boolean) => any;
}

export const ReceiveAddress = (props: Props) => {
    const {address, coin, onChange, validAddress, onSetValidAddress} = props;


    const onChangeAddress = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!coin) {
            return;
        }
        onChange(ev.target.value)
        onSetValidAddress(false);
        const address = ev.target.value;
        Changelly.validateAddress({ currency: coin?.ticker, address })
            .then(r => {
                if(r.result.result){
                    onSetValidAddress(true);
                }else{
                    onSetValidAddress(false);
                }
            })
    }

    const helperText = () => {
        if( !validAddress && address){
           return 'Invalid address';
        }
        if(!address){
          return  'Insert valid address';
        }
    }


    return  <Grid item xs={12}>
                <Typography component={'h1'}>Receive Address</Typography>
                <TextField
                    id="Address"
                    required
                    error={(!validAddress && address !== undefined)}
                    label={`${coin?.name.toUpperCase()} Address`}
                    variant="filled"
                    value={address}
                    onChange={onChangeAddress}
                    fullWidth
                    helperText={helperText()}
                    />
            </Grid>
}