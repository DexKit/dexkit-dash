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
import { ConfigPairMetaData, CurrencyPairMetaData } from 'types/myApps';
import { WizardProps } from '.';
import { useTokenList } from 'hooks/useTokenList';
import { Token } from 'types/app';
import { ChainId } from 'types/blockchain';
import { CustomLabel } from 'shared/components/Wizard/Label';

const CustomGrid = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} !important;`,
    margin: theme.spacing(1, 0)
  }
}))(Grid);

type ConfigError = {
  [Property in keyof ConfigPairMetaData]: string;
}

interface error {
  base?: string;
  quote?: string;
  config: ConfigError;
}

interface PairComponentProps {
  index: number;
  data: CurrencyPairMetaData;
  onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    token: CurrencyPairMetaData,
    index: number
  ) => void
  validator: (isValid: boolean) => void;
  isValid: boolean;
  tokens: Token[];
  chainId: ChainId;
  editable?: boolean;
}

type ConfigPairLabels = {
  [Property in keyof ConfigPairMetaData]: string;
}

const baseValidator = (name: string) => {
  return name != null && name?.replace(' ', '')?.length >= 3;
}

const quoteValiation = (quote: string, base: string) => {
  return quote != null && quote?.replace(' ', '')?.length >= 3 &&
    quote.toLowerCase() !== base.toLowerCase();
}
const decimalsValidator = (decimals?: number): boolean => {
  if (decimals == null) return false;
  const _decimals = Number(decimals);
  return (_decimals > 0 && _decimals < 24 && !isNaN(_decimals) && isFinite(_decimals));
}
const numberValidator = (num?: number) => {
  if (num == null) return false;
  const _number = Number(num);
  return !isNaN(_number) && isFinite(_number);
}

const positiveValidator = (num?: number) => {
  if (num == null) return false;
  return numberValidator(num) && num > 0;
}

const isObjectNullOrEmpty = (obj: any): boolean => {
  return obj == null || Object.keys(obj).length === 0;
}
function checkProperty<T>(obj: T, key: keyof T) {
  return !isObjectNullOrEmpty(obj) && obj[key] != null;
}
const MAX_NUMBER = 1000;
const labels = {
  basePrecision: 'Base Precision',
  maxAmount: 'Max Amount',
  minAmount: 'Min Amount',
  pricePrecision: 'Price Precision',
  quotePrecision: 'Quote Precision'
} as ConfigPairLabels;

const PairComponent: React.FC<PairComponentProps> = (props) => {
  const { index, data, onChange, validator, isValid, editable } = props;
  const [base, setBase] = useState(data?.base);
  const [quote, setQuote] = useState(data?.quote);
  const [config, setConfig] = useState(data?.config);
  const [errors, setErrors] = useState<error>({
    base: undefined,
    quote: undefined,
    config: {
      basePrecision: undefined,
      maxAmount: undefined,
      minAmount: undefined,
      pricePrecision: undefined,
      quotePrecision: undefined
    }
  } as error);
  const [pair, setPair] = useState(data);
  const [valid, setValid] = useState<boolean>(isValid);
  // type KeysEnum<T> = { [P in keyof Required<T>]: true };

  const maxAmountError = useCallback((): string | undefined => {
    if (positiveValidator(config?.minAmount)) {
      return ((config?.minAmount ?? 0) >= (config?.maxAmount ?? 0) ? 'max amount must be greater than min amount' : undefined)
    }
    return 'max amount is invalid!'
  }, [config]);

  const minAmountError = useCallback((): string | undefined => {
    if (positiveValidator(config?.minAmount)) {
      return ((config?.minAmount ?? 0) >= (config?.maxAmount ?? 0) ? 'min amount must be less than max amount' : undefined)
    }
    return 'min amount is invalid!'
  }, [config]);

  useEffect(() => {
    if (errors == null) {
      const _base = base ?? pair.base;
      const _quote = quote ?? pair.quote;
      const _config = config ?? pair.config;
      const configErros = {
        basePrecision: decimalsValidator(_config?.basePrecision) ? undefined : 'base precision is invalid!',
        quotePrecision: decimalsValidator(_config?.pricePrecision) ? undefined : 'quote precision is invalid!',
        pricePrecision: decimalsValidator(_config?.pricePrecision) ? undefined : 'price precision is invalid!',
        maxAmount: maxAmountError(),
        minAmount: minAmountError()
      } as ConfigError;
      const _errors = {
        base: baseValidator(_base) ? undefined : 'base name is invalid!',
        quote: quoteValiation(_quote, _base) ? undefined : 'quote name is invalid!',
        config: configErros
      } as error;
      const _valid = Object.values(_errors).reduce((pre, cur) => pre && cur == null, true);
      if (_valid) {
        const _pair: CurrencyPairMetaData = {
          base: _base,
          quote: _quote,
          config: _config
        };
        if(Boolean(editable)){
          const e = new Event('input', { bubbles: true })
          onChange(e as unknown as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _pair, index);
        }
      }
      setErrors(_errors);
    }
  }, [config]);

  useEffect(() => {

    setPair({
      base,
      quote,
      config
    });
  }, [base, quote, config]);

  useEffect(() => {
    console.log('errors', errors);
    if (errors != null) {
      const _valid = Object.values(errors).reduce((pre, cur) => pre && cur == null, true) &&
        Object.values(errors?.config ?? {}).reduce((pre, cur) => pre && cur == null, true);
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
          key={`pair(${index}).base`}
          id={`pair(${index}).base`}
          value={base}
          onBlur={
            () => {
              if (baseValidator(base)) {
                errors.base = undefined;
                setErrors({ ...errors })
              }
              else
                setErrors({ ...errors, base: 'base precision is invalid!' })
            }
          }
          onChange={
            ($e) => {
              setBase($e.target.value);
              onChange($e, { ...pair, base }, index);
            }
          }
          placeholder={''}
          helperText={!valid ? errors?.base : undefined}
          error={errors?.base != null}
          label={<CustomLabel text="Base" required={true} />}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`pair(${index}).quote`}
          id={`pair(${index}).quote`}
          value={quote}
          onBlur={
            () => {
              if (quoteValiation(quote, base))
                setErrors({ ...errors, quote: undefined })
              else
                setErrors({ ...errors, quote: 'quote name is invalid!' })
            }
          }
          onChange={
            ($e) => {
              setQuote($e.target.value);
              onChange($e, { ...pair, quote: $e.target.value }, index);
            }
          }
          helperText={!valid ? errors?.quote : undefined}
          error={errors?.quote != null}
          label={<CustomLabel text="Quote" required={true} />}
          fullWidth
          variant="outlined"
        />
      </Grid>
      {
        config ? (
          Object.keys(config)
            ?.map((key => {
              type k = keyof ConfigPairMetaData;
              const _key: k = key as k;
              const hasProperty = !isObjectNullOrEmpty(errors) && checkProperty<ConfigError>(errors?.config, _key);
              return (
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    type="number"
                    key={`pair(${index}).${key}`} id={`pair(${index}).${key}`}
                    fullWidth
                    label={<CustomLabel text={labels[_key]} required={true} />}
                    variant='outlined'
                    value={config[_key]}
                    inputProps={
                      {
                        min: _key === 'maxAmount' ? (config?.minAmount ?? 0) : 0,
                        max: _key === 'minAmount' ? (config?.maxAmount ?? MAX_NUMBER) : MAX_NUMBER,
                        step: _key === 'maxAmount' || _key === 'minAmount' ? Math.pow(10, -(Math.max(Math.min(config?.pricePrecision ?? 4, 8), 4))) : 1
                      }
                    }
                    // InputProps={{
                    //   endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    // }}
                    helperText={hasProperty ? errors.config[_key] : undefined}
                    error={hasProperty && errors?.config[_key] != null}
                    onBlur={($e) => {
                      if (_key === 'minAmount') {
                        const msgError = minAmountError();
                        if (hasProperty && msgError == null) {
                          errors.config.minAmount = undefined;
                          setErrors({ ...errors })
                        }
                        else {
                          errors.config = {
                            ...errors?.config,
                            minAmount: msgError
                          }
                          setErrors({ ...errors })
                        }
                      } else if (_key === 'maxAmount') {
                        const msgError = maxAmountError();
                        if (hasProperty && msgError == null) {
                          errors.config.maxAmount = undefined;
                          setErrors({ ...errors })
                        }
                        else {
                          errors.config = {
                            ...errors?.config,
                            maxAmount: msgError
                          }
                          setErrors({ ...errors })
                        }
                      } else {
                        const _valid = positiveValidator(Number(config[_key]));
                        console.log('_valid', _valid);
                        errors.config[_key] = _valid ? undefined : `${_key} precision is invalid!`;
                        if(errors.config[_key] != null ){
                          setErrors({ ...errors });
                        }
                      }
                    }}
                    onChange={($e) => {
                      const _config = {
                        ...config,
                        [_key]: $e.target.value
                      };
                      pair.config = _config;
                      setConfig({
                        ..._config
                      });
                      onChange($e, { ...pair }, index);
                    }}
                  />
                </Grid>
              )
            }))
        ) : null
      }

    </>
  )
}



interface PairsFormProps {
  title: string;
  chainId: ChainId;
  pairs?: CurrencyPairMetaData[];
  editable?: boolean;
}

type Props = PairsFormProps & WizardProps;
const PairsForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation, chainId, editable } = props;
  const [pairs, setPairs] = useState(props.pairs ?? []);
  const listToken = useTokenList();

  const onChange = useCallback(
    ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      pair: CurrencyPairMetaData,
      index: number
    ) => {
      if (index >= 0 && pairs != null && index < pairs.length) {
        pairs[index] = pair;
        changeIssuerForm('tokens', pairs);
      }
    }, [pairs, changeIssuerForm]);

  const addPair = useCallback((index?: number) => {
    const newItem = {
      base: '',
      quote: '',
      config: {
        basePrecision: 18,
        quotePrecision: 18,
        maxAmount: 1,
        minAmount: 0,
        pricePrecision: 4
      }
    } as CurrencyPairMetaData;

    if (index != null && index > 0 && index < (pairs?.length ?? 0)) {
      pairs.splice(index, 0, newItem);
      setPairs([...pairs]);
      return;
    }
    setPairs([...(pairs ?? []), newItem]);
  }, [pairs, setPairs]);

  useEffect(() => {
    changeIssuerForm('pairs', [...pairs]);
  }, [pairs, changeIssuerForm]);

  useEffect(() => {
    console.log('pairsForm loaded!');
    if (pairs == null || pairs?.length === 0) {
      addPair();
    }
  }, []);

  const remPair = useCallback((index: number) => {
    if (index >= 0 && index < pairs?.length) {
      pairs.splice(index, 1);
      const _pairs = [...pairs];
      setPairs(_pairs);
    }
  }, [pairs, setPairs]);

  return (
    <GridContainer>
      {
        pairs != null ? pairs.map((pair: CurrencyPairMetaData, i: number) => (
          <>
            {
              i > 0 && (
                <CustomGrid item xs={12} md={12} sm={12}>
                  <Divider></Divider>
                </CustomGrid>
              )
            }
            <Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
              <IconButton aria-label="add" onClick={() => addPair(i)}>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
              {
                i > 0 && (
                  <IconButton aria-label="delete">
                    <DeleteOutlinedIcon onClick={() => remPair(i)} fontSize="small" />
                  </IconButton>
                )
              }
            </Grid>
            <PairComponent
              key={Math.round(Math.random() * 1000 + i)}
              index={i}
              data={pair}
              onChange={onChange}
              validator={validator}
              isValid={startValidation}
              chainId={chainId}
              tokens={listToken}
              editable={editable}
            />
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default PairsForm;