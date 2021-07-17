import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';

import { Grid, TextField } from '@material-ui/core';

import { TokenMetaData } from 'types/myApps';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { isAddress } from '@ethersproject/address';
import { Token } from 'types/app';
import { ChainId } from 'types/blockchain';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { error } from '..';
import { useBlockchain } from 'hooks/useBlockchain';
import { HELP_TEXT_TOKEN } from './helpText';
import { getHelpText } from '../';
import { InfoComponent } from '../Buttons/infoComponent';
import { MessageView } from '@crema';

interface TokenComponentProps {
  index: number;
  data: TokenMetaData;
  onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    token: TokenMetaData,
    index: number
  ) => void
  validator: (isValid: boolean) => void;
  isValid: boolean;
  tokens: Token[];
  chainId: ChainId;
  editable?: boolean;
  uniqueCheck: (address: string) => boolean;
}

const nameValidator = (name: string) => {
  return name != null && name?.replace(' ', '')?.length >= 3;
}

const addressValidator = (address: string) => {
  return address != null && isAddress(address);
}
const decimalsValidator = (decimals: number): boolean => {
  if (decimals == null) return false;
  const _decimals = Number(decimals);
  return (_decimals > 0 && _decimals < 24 && !isNaN(_decimals) && isFinite(_decimals));
}
export const TokenComponent: React.FC<TokenComponentProps> = (props) => {
  const { index, data, onChange, validator, isValid, tokens, chainId, editable, uniqueCheck } = props;
  const [name, setName] = useState(data.name);
  const [symbol, setSymbol] = useState(data.symbol);
  const [decimals, setDecimals] = useState(data.decimals);
  const [address, setAddress] = useState(data.address);
  const [errors, setErrors] = useState<error>();
  const [valid, setValid] = useState<boolean>(isValid);
  const [loading, setLoading] = useState(false);
  const [searchfailed, setSearchFailed] = useState<string>();
  const { onGetToken } = useBlockchain();

  const findToken = useCallback((): Promise<Token | undefined> => {
    if(address == null || !isAddress(address)){
      return Promise.resolve(undefined);
    }
    const token = tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
    if(token != null){
      return Promise.resolve(token);
    }
    return onGetToken(address?.toLowerCase());
  }, [tokens, address, onGetToken]);

  useEffect(() => {
    if(address){
      const _valid = nameValidator(name) && addressValidator(address) && decimalsValidator(decimals)
      && uniqueCheck(address);
      setValid(_valid);
      validator(_valid);
    }
  }, []);

  useEffect(() => {
    setSearchFailed(undefined);
    if (!Boolean(editable)) {
      return;
    }
    if (errors == null || (errors != null && errors['address'] == null)) {
      setLoading(false)
      findToken()
      .then( token => {
        if (token != null && address) {
          const unique = uniqueCheck(address);
          const _name = token.name ?? name;
          const _symbol = token.symbol ?? symbol;
          const _decimals = token.decimals ?? decimals;
          if(unique){
            setName(_name);
            setSymbol(_symbol);
            setDecimals(_decimals);
          }
          const _errors = {
            ...errors,
            address: unique === false ? 'There is already a collection with the address informed!' : undefined,
            name: nameValidator(_name) ? undefined : 'Token name is invalid!',
            symbol: nameValidator(_symbol) ? undefined : 'Symbol is invalid!',
            decimals: decimalsValidator(_decimals) ? undefined : 'Decimals number is invalid!',
          } as error;
          const _valid = Object.values(_errors).reduce((pre, cur) => pre && cur == null, true);
          if (_valid) {
            const _token: TokenMetaData = {
              address,
              name: _name,
              decimals: _decimals,
              symbol: _symbol,
              addresses: { [Number(chainId)]: token.address }
            };
            const e = new Event('input', { bubbles: true })
            onChange(e as unknown as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _token, index);
          }
          setErrors(_errors);
        }
      })
      .catch(e => {
        setSearchFailed('Token search failed!');
      })
      .finally(() => setLoading(false))
    }
  }, [address]);

  useEffect(() => {
    if (errors != null) {
      const _valid = Object.values(errors).reduce<boolean>((pre, cur): boolean => Boolean(pre && cur == null), true);
      setValid(_valid);
    }
  }, [errors]);

  useEffect(() => {
    if (errors != null) {
      validator(valid);
    }
  }, [valid, validator]);

  useEffect(() => {
    if(searchfailed != null){
      setErrors({ ...errors, address: searchfailed});
    }
  }, [searchfailed])

  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).address`}
          id={`token(${index}).address`}
          value={address}
          onBlur={
            () => {
                if(address){
                const unique = uniqueCheck(address);
                if (!Boolean(editable)) {
                  return;
                }
                if(!unique){
                  setErrors({ ...errors, address: 'There is already a collection with the address informed!'})
                }
                else if (addressValidator(address)){
                  setErrors({ ...errors, address: undefined })
                }
                else{
                  setErrors({ ...errors, address: 'Collection address is invalid!' })
                }
              }
            }
          }
          onChange={
            ($e) => {
              if (!Boolean(editable)) {
                return;
              }
              data.address = $e.target.value;
              setAddress(data.address);
              onChange($e, data, index);
            }
          }
          placeholder={ZERO_ADDRESS}
          helperText={!valid ? errors?.address : undefined}
          error={errors?.address != null}
          fullWidth
          label={<CustomLabel text="Address" required={true} />}
          InputLabelProps={{
            // shrink: placeholder != null,
            shrink: true,
          }}
          variant="outlined"
          disabled={Boolean(editable) ? loading : true}
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_TOKEN, 'address', 0)} />) }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).name`}
          id={`token(${index}).name`}
          value={name}
          onBlur={
            () => {
              if (!Boolean(editable)) {
                return;
              }
              if (nameValidator(name))
                setErrors({ ...errors, name: undefined })
              else
                setErrors({ ...errors, name: 'Token name is invalid!' })
            }
          }
          onChange={
            ($e) => {
              if (!Boolean(editable)) {
                return;
              }
              setName($e.target.value);
              onChange($e, { ...data, name: $e.target.value }, index);
            }
          }
          helperText={!valid ? errors?.name : undefined}
          error={errors?.name != null}
          fullWidth 
          label={`Name`}
          variant="outlined"
          placeholder={'Name'}
          InputLabelProps={{
            // shrink: placeholder != null,
            shrink: true,
          }}
          disabled
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_TOKEN, 'name', 0)} />) }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).symbol`}
          id={`token(${index}).symbol`}
          value={symbol}
          onBlur={
            () => {
              if (!Boolean(editable)) {
                return;
              }
              if (nameValidator(symbol))
                setErrors({ ...errors, symbol: undefined })
              else
                setErrors({ ...errors, symbol: 'Symbol is invalid!' })
            }
          }
          onChange={
            ($e) => {
              if (!Boolean(editable)) {
                return;
              }
              data.symbol = $e.target.value;
              setSymbol(data.symbol);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.symbol : undefined}
          error={errors?.symbol != null}
          fullWidth
          label="Symbol"
          placeholder={'Symbol'}
          variant="outlined"
          InputLabelProps={{
            // shrink: placeholder != null,
            shrink: true,
          }}
          disabled
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_TOKEN, 'symbol', 0)} />) }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).decimals`}
          id={`token(${index}).decimals`}
          value={decimals}
          onBlur={
            () => {
              if (!Boolean(editable)) {
                return;
              }
              if (decimalsValidator(decimals))
                setErrors({ ...errors, decimals: undefined })
              else
                setErrors({ ...errors, decimals: 'Decimals number is invalid!' })
            }
          }
          onChange={
            ($e) => {
              if (!Boolean(editable)) {
                return;
              }
              const value = $e.target.value !== null && $e.target.value !== '' ?
                $e.target.value : '18';

              data.decimals = parseInt(value);

              setDecimals(data.decimals);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.decimals : undefined}
          placeholder={'18'}
          error={errors?.decimals != null}
          fullWidth
          label="Decimals"
          variant="outlined"
          InputLabelProps={{
            // shrink: placeholder != null,
            shrink: true,
          }}
          disabled
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_TOKEN, 'decimals', 0)} />) }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        { searchfailed && <MessageView variant='warning' message={searchfailed} anchorOrigin={{vertical: 'bottom', horizontal: 'right' }}/>}
      </Grid>
    </>
  )
}
