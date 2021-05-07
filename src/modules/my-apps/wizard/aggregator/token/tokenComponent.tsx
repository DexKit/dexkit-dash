import React, { useState } from 'react';
import {
  Grid,
  TextField,
} from '@material-ui/core';
import { TokenFeeProgramConfig } from '@types';

interface TokenComponentProps {
    index: number;
    data: TokenFeeProgramConfig;
    onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      token: TokenFeeProgramConfig,
      index: number
    ) => void
  }
  export const TokenComponent: React.FC<TokenComponentProps> = (props) => {
    const { index, data, onChange } = props;
    const [amount, setAmount] = useState(data?.token_amount);
    const [percentage, setPercentage] = useState(data?.buyTokenPercentage);
    const [address, setAddress] = useState(data?.token_address);
    return (
      <>
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            key={`token(${index}).address`}
            id={`token(${index}).address`}
            value={address}
            onChange={
              ($e) => {
                data.token_address = $e.target.value;
                setAddress($e.target.value);
                onChange($e, { ...data, token_address: $e.target.value}, index);
              }
            }
            fullWidth
            label="address"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            key={`token(${index}).buyTokenPercentage`}
            id={`token(${index}).buyTokenPercentage`}
            value={percentage}
            onChange={
              ($e) => {
                setPercentage($e.target.value);
                onChange($e, { ...data, buyTokenPercentage: $e.target.value}, index);
              }
            }
            fullWidth
            label="buy token percentage"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            key={`token(${index}).token_amount`}
            id={`token(${index}).token_amount`}
            value={amount}
            onChange={
              ($e) => {
                setAmount($e.target.value);
                onChange($e, { ...data, token_amount: $e.target.value}, index);
              }
            }
            fullWidth
            label="amount"
            variant="outlined"
          />
        </Grid>
      </>
    )
  }