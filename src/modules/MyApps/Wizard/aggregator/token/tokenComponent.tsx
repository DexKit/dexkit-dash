import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
} from '@material-ui/core';
import { TokenFeeProgramConfig } from 'types/myApps';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { InfoComponent } from '../../shared/Buttons/infoComponent';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';

const helpText = new Map<keyof TokenFeeProgramConfig, string>();
helpText.set('token_address', 'token address');
helpText.set('token_amount', '');
helpText.set('buyTokenPercentage', '');
interface TokenComponentProps {
    index: number;
    data: TokenFeeProgramConfig;
    onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      token: TokenFeeProgramConfig,
      index: number
    ) => void;
    uniqueCheck: (address: string) => boolean;
  }
  export const TokenComponent: React.FC<TokenComponentProps> = (props) => {
    const { index, data, onChange } = props;
    const [amount, setAmount] = useState(data?.token_amount);
    const [percentage, setPercentage] = useState(data?.buyTokenPercentage);
    const [tokenName, setTokenName] = useState();
    const [maxPercente] = useState(100);

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
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={ZERO_ADDRESS}
            fullWidth
            label={<CustomLabel text="Address" required={true} />}
            variant="outlined"
            InputProps={{ endAdornment: (<InfoComponent text={helpText.get('token_address')}/>)}}
          />
        </Grid>
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            key={`token(${index}).name`}
            id={`token(${index}).name`}
            value={tokenName}
            fullWidth
            label={'Toke name'}
            variant="outlined"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="number"
            key={`token(${index}).buyTokenPercentage`}
            id={`token(${index}).buyTokenPercentage`}
            placeholder="0.0% - 100%"
            value={percentage}
            onChange={
              ($e) => {
                setPercentage($e.target.value);
                onChange($e, { ...data, buyTokenPercentage: $e.target.value}, index);
              }
            }
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={
              {
                min: 0.0,
                max: maxPercente,
                step: 0.001
              }
            }
            fullWidth
            label={<CustomLabel text="Buy token percentage" required={true} />}
            variant="outlined"
            InputProps={{ endAdornment: (<InfoComponent text={helpText.get('buyTokenPercentage')}/>)}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
          type="number"
            key={`token(${index}).token_amount`}
            id={`token(${index}).token_amount`}
            value={amount}
            onChange={
              ($e) => {
                setAmount($e.target.value);
                onChange($e, { ...data, token_amount: $e.target.value}, index);
              }
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            label={<CustomLabel text="Amount" required={true} />}
            variant="outlined"
            placeholder={'0.98'}
            InputProps={{ endAdornment: (<InfoComponent text={helpText.get('token_amount')}/>)}}
          />
        </Grid>
      </>
    )
  }