import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  TextField,
  IconButton,
  Divider,
  withStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { TokenMetaData } from 'types/myApps';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { WizardProps } from '.';
import { useTokenList } from 'hooks/useTokenList';
import { isAddress } from '@ethersproject/address';
import { Token } from 'types/app';
import { ChainId } from 'types/blockchain';
import { CustomLabel } from 'shared/components/Wizard/Label';

const CustomGrid = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} !important;`,
    margin: theme.spacing(1, 0)
  }
}))(Grid);


interface error {
  [key: string]: string | undefined;
}

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
}

const nameValidator = (name: string) => {
  return name != null && name?.replace(' ', '')?.length >= 3;
}

const addressValidator = (address: string ) => {
  return address != null && isAddress(address);
}
const decimalsValidator = (decimals: number): boolean => {
  if(decimals == null) return false;
  const _decimals = Number(decimals);
  return (_decimals > 0 && _decimals < 24 && !isNaN(_decimals) && isFinite(_decimals));
}
const TokenComponent: React.FC<TokenComponentProps> = (props) => {
  const { index, data, onChange, validator, isValid, tokens, chainId } = props;
  const [name, setName] = useState(data.name);
  const [symbol, setSymbol] = useState(data.symbol);
  const [decimals, setDecimals] = useState(data.decimals);
  const [address, setAddress] = useState(data.address);
  const [errors, setErrors] = useState<error>();
  const [valid, setValid] = useState<boolean>(isValid);

   
  useEffect(() => {
    if(errors == null || (errors != null && errors['address'] == null) ){
      const token = tokens.find( t => t.address.toLowerCase() === address.toLowerCase());
      if(token != null){
        const _name = token.name ?? name;
        const _symbol = token.symbol ?? symbol;
        const _decimals = token.decimals ?? decimals;
        setName(_name);
        setSymbol(_symbol);
        setDecimals(_decimals);
        const _errors = {
          ...errors,
          name: nameValidator(_name) ? undefined : 'Token name is invalid!',
          symbol: nameValidator(_symbol) ? undefined : 'Symbol is invalid!',
          decimals: decimalsValidator(_decimals) ? undefined : 'Decimals number is invalid!', 
        } as error;
        const _valid = Object.values(_errors).reduce((pre, cur) => pre && cur == null, true);
        if(_valid){
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
    }
  }, [address]);

  useEffect(() => {
    if (errors != null) {
      const _valid = Object.values(errors).reduce((pre, cur) => pre && cur == null, true);
      setValid(_valid);
    }
  }, [errors]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).address`}
          id={`token(${index}).address`}
          value={address}
          onBlur={
            () => {
              if(addressValidator(address))
                setErrors({...errors, address: undefined})
              else
                setErrors({...errors, address: 'Collection address is invalid!'})
            }
          }
          onChange={
            ($e) => {
              data.address = $e.target.value;
              setAddress(data.address);
              onChange($e, data, index);
            }
          }
          placeholder={ZERO_ADDRESS}
          helperText={!valid ? errors?.address : undefined}
          error={errors?.address != null}
          fullWidth
          label={<CustomLabel text="address" required={true} />}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).name`}
          id={`token(${index}).name`}
          value={name}
          onBlur={
            () => {
              if(nameValidator(name))
                setErrors({...errors, name: undefined})
              else
                setErrors({...errors, name: 'Token name is invalid!'})
            }
          }
          onChange={
            ($e) => {
              setName($e.target.value);
              onChange($e, { ...data, name: $e.target.value }, index);
            }
          }
          helperText={!valid ? errors?.name : undefined}
          error={errors?.name != null}
          fullWidth label={`name`}
          variant="outlined"
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).symbol`}
          id={`token(${index}).symbol`}
          value={symbol}
          onBlur={
            () => {
              if(nameValidator(symbol))
                setErrors({...errors, symbol: undefined})
              else
                setErrors({...errors, symbol: 'Symbol is invalid!'})
            }
          }
          onChange={
            ($e) => {
              data.symbol = $e.target.value;
              setSymbol(data.symbol);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.symbol : undefined}
          error={errors?.symbol != null}
          fullWidth
          label="symbol"
          variant="outlined"
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`token(${index}).decimals`}
          id={`token(${index}).decimals`}
          value={decimals}
          onBlur={
            () => {
              if(decimalsValidator(decimals))
                setErrors({...errors, decimals: undefined})
              else
                setErrors({...errors, decimals: 'Decimals number is invalid!'})
            }
          }
          onChange={
            ($e) => {
              const value = $e.target.value !== null && $e.target.value !== '' ?
                $e.target.value : '18';

              data.decimals = parseInt(value);

              setDecimals(data.decimals);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.decimals : undefined}
          error={errors?.decimals != null}
          fullWidth
          label="decimals"
          variant="outlined"
          disabled
        />
      </Grid>

    </>
  )
}



interface TokensFormProps {
  title: string;
  chainId: ChainId;
  tokens?: TokenMetaData[];
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation, chainId } = props;
  const [tokens, setTokens] = useState(props.tokens ?? []);
  const listToken = useTokenList();
  useEffect(() => {
    if (tokens == null || tokens?.length === 0) {
      addToken();
    }
  }, []);

  const onChange = useCallback(
    ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      token: TokenMetaData,
      index: number
    ) => {
      if (index >= 0 && tokens != null && index < tokens.length) {
        tokens[index] = token;
        changeIssuerForm('tokens', tokens);
      }
    }, [tokens, changeIssuerForm]);

  const addToken = useCallback((index?: number) => {
    const newItem = {
      name: '',
      symbol: '',
      decimals: 0,
      address: '',
      addresses: {}
    };

    if (index != null && index > 0 && index < (tokens?.length ?? 0)) {
      tokens.splice(index, 0, newItem);
      setTokens([...tokens]);
      return;
    }
    setTokens([...(tokens ?? []), newItem]);
  }, [tokens, setTokens]);

  useEffect(() => {
    changeIssuerForm('tokens', [...tokens]);
  }, [tokens, changeIssuerForm])

  const remToken = useCallback((index: number) => {
    if (index >= 0 && index < tokens?.length) {
      tokens.splice(index, 1);
      const _tokens = [...tokens];
      setTokens(_tokens);
    }
  }, [tokens, setTokens]);

  return (
    <GridContainer>
      {
        tokens != null ? tokens.map((token: TokenMetaData, i: number) => (
          <>
            {
              i > 0 && (
                <CustomGrid item xs={12} md={12} sm={12}>
                  <Divider></Divider>
                </CustomGrid>
              )
            }
            <Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
              <IconButton aria-label="add" onClick={() => addToken(i)}>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
              {
                i > 0 && (
                  <IconButton aria-label="delete">
                    <DeleteOutlinedIcon onClick={() => remToken(i)} fontSize="small" />
                  </IconButton>
                )
              }
            </Grid>
            <TokenComponent
              key={Math.round(Math.random() * 1000 + i)}
              index={i}
              data={token}
              onChange={onChange}
              validator={validator}
              isValid={startValidation}
              chainId={chainId}
              tokens={listToken}
            />
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default TokensForm;