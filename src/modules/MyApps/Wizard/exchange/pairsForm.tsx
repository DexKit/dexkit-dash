import React, { ChangeEvent, useCallback, useEffect, useState, SyntheticEvent, memo } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionActions,
  Typography,
  makeStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import { MessageView } from '@crema';

import { AccordionSummary } from '../shared/Accordion';
import { CustomIconButton } from '../shared/Buttons';
import { truncateAddress } from 'utils/text';
import { Token } from 'types/app';
import { ConfigFileExchange, ConfigPairMetaData, CurrencyPairMetaData } from 'types/myApps';
import { ChainId } from 'types/blockchain';
import { useTokenList } from 'hooks/useTokenList';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { WizardProps } from '../shared';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { isAddress } from 'ethers/lib/utils';
import { InfoComponent } from '../shared/Buttons/infoComponent';
import { HELP_TEXT_PAIR } from './helpText';
import { getHelpText } from '../shared';
import { useBlokchain } from 'hooks/useBlokchain';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { PairItemComponent } from './pairItem';

const useStyle = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'center',
    display: 'inline-flex',
    alignSelf: 'center'
  },
}));

interface AccordionLabel {
  base: string;
  quote: string;
  address: string;
}

type ConfigError = {
  [Property in keyof ConfigPairMetaData]: string;
}

interface error {
  address?: string;
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

const placeholders = {
  basePrecision: '18',
  maxAmount: '20',
  minAmount: '0.1',
  pricePrecision: '4',
  quotePrecision: '18'
}

const PairComponent: React.FC<PairComponentProps> = (props) => {
  const { index, data, onChange, validator, isValid, editable } = props;
  const [address, setAddress] = useState(data?.address);
  const [base, setBase] = useState(data?.base);
  const [quote, setQuote] = useState(data?.quote);
  const [config, setConfig] = useState(data?.config);
  const [errors, setErrors] = useState<error>({
    address: undefined,
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
  const [searchfailed, setSearchFailed] = useState<string>();
  const { onGetPair } = useBlokchain();
  const [loading, setLoading] = useState(false);

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

  const findPair = useCallback((): Promise<{ token0: Token | undefined, token1: Token | undefined } | undefined> => {
    if (address != null && isAddress(address)) {
      return onGetPair(address);
    }
    return Promise.resolve(undefined);
  }, [onGetPair, address])

  useEffect(() => {
    if (!Boolean(editable) || !loading) {
      return;
    }
    if (errors == null || (errors != null && errors['address'] == null)) {
      setLoading(true);
      setSearchFailed(undefined);
      findPair()
        .then(tokens => {
          let tokenBase: Token | undefined;
          let tokenQuote: Token | undefined;

          if (tokens != null) {
            tokenBase = tokens?.token0;
            tokenQuote = tokens?.token1;
          }
          if (tokenBase == null || tokenQuote == null) {
            setSearchFailed('Pair not found!');
          }
          const _config = {
            ...(config ?? pair.config),
            basePrecision: ((config?.basePrecision ?? pair.config?.basePrecision) ?? tokenBase?.displayDecimals),
            quotePrecision: ((config?.quotePrecision ?? pair.config?.quotePrecision) ?? tokenQuote?.displayDecimals),
          }
          const _address = address ?? pair.address;
          const _base = tokenBase?.name ?? base ?? pair.base;
          const _quote = tokenQuote?.name ?? quote ?? pair.quote;
          setBase(_base)
          setQuote(_quote)
          setConfig(_config)
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
              address: _address,
              base: _base,
              quote: _quote,
              config: _config
            };
            if (Boolean(editable)) {
              const e = new Event('input', { bubbles: true })
              onChange(e as unknown as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, _pair, index);
            }
          }
          setErrors(_errors);

        })
        .catch(e => {
          setSearchFailed('Pair search failed!');
        })
        .finally(() => setLoading(false));

    }
  }, [config]);

  const _onBlur = ($e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
     key: string | keyof ConfigPairMetaData, errors: error, hasProperty: boolean,
    config: ConfigPairMetaData, setConfig: React.Dispatch<React.SetStateAction<ConfigPairMetaData | undefined>>
    , setErrors:  React.Dispatch<React.SetStateAction<error>>) => 
  {
    if (key === 'minAmount') {
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
    } else if (key === 'maxAmount') {
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
      type _k = keyof typeof config;
      const num = Number($e.target.value);
      console.log(`${key}`, num);
      setConfig({
        ...config,
        [key]: num
      });
      const _valid = positiveValidator(num);
      errors.config = {
        ...errors.config,
        [key]: _valid ? undefined : `${key} precision is invalid!`
      }
      if (errors?.config[key as _k] != null) {
        setErrors({ ...errors });
      }
    }
  };

  const _onChange = ($e: any, key: string, pair: CurrencyPairMetaData, config: ConfigPairMetaData,
    setConfig: React.Dispatch<React.SetStateAction<ConfigPairMetaData | undefined>>) => {
    const _config = {
      ...config,
      [key]: $e.target.value
    };
    pair.config = _config;
    setConfig({
      ..._config
    });
  };

  useEffect(() => {
    setPair({
      address,
      base,
      quote,
      config
    });
  }, [address, base, quote, config]);

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

  useEffect(() => {
    setErrors({ ...errors, address: searchfailed });
  }, [searchfailed]);

  const exclude = ['pricePrecision'];
  const otherFields = Object.keys(config ?? {})
  .filter( f => exclude.every( x => x !== f));
  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type="text"
          value={address}
          key={`pair(${index}).address`}
          id={`pair(${index}).address`}
          helperText={!valid ? errors?.address : undefined}
          error={errors?.address != null}
          placeholder={ZERO_ADDRESS.toString()}
          onBlur={
            () => {
              if (address == null || isAddress(address.toString().trim())) {
                errors.address = undefined;
                setErrors({ ...errors })
              }
              else
                setErrors({ ...errors, address: 'Pair address is invalid!' })
            }
          }
          onChange={
            ($e) => {
              setAddress($e.target.value);
              onChange($e, { ...pair, address }, index);
            }
          }
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          label={<CustomLabel text="Pair address" required={true} />}
          variant="outlined"
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_PAIR, 'address', 0)} />) }}
          disabled={loading}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
      <PairItemComponent
        key={`pricePrecision`}
        index={index}
        label={labels['pricePrecision']}
        placeholder={placeholders['pricePrecision']}
        value={config?.pricePrecision}
        helperText={errors.config['pricePrecision']}
        error={errors?.config['pricePrecision'] != null}
        onBlur={($e) => {
          _onBlur($e, 'pricePrecision', errors, true, config ?? {}, setConfig, setErrors);
        }}
        onChange={($e) => {
          _onChange($e, 'pricePrecision', pair, config ?? {}, setConfig);
          onChange($e, { ...pair }, index);
        }}
        disabled={loading}
      />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`pair(${index}).base`}
          id={`pair(${index}).base`}
          value={base}
          placeholder={'ETH'}
          InputLabelProps={{
            shrink: true,
          }}
          helperText={!valid ? errors?.base : undefined}
          error={errors?.base != null}
          label={<CustomLabel text="Base" required={true} />}
          fullWidth
          variant="outlined"
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_PAIR, 'base', 0)} />) }}
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`pair(${index}).quote`}
          id={`pair(${index}).quote`}
          value={quote}
          placeholder={'DAI'}
          helperText={!valid ? errors?.quote : undefined}
          error={errors?.quote != null}
          label={<CustomLabel text="Quote" required={true} />}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="outlined"
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT_PAIR, 'quote', 0)} />) }}
          disabled
        />
      </Grid>
      {
        config ? (
          otherFields?.map((key => {
              type k = keyof ConfigPairMetaData;
              const _key: k = key as k;
              const hasProperty = !isObjectNullOrEmpty(errors) && checkProperty<ConfigError>(errors?.config, _key);
              return (
                <Grid item xs={12} md={6} sm={6} key={`pair(${index}).${key}`}>
                  <PairItemComponent
                    key={`pair(${index}).${key}`}
                    index={index}
                    label={labels[_key]}
                    placeholder={placeholders[_key]}
                    value={config[_key]}
                    inputProps={
                      {
                        min: _key === 'maxAmount' ? (config?.minAmount ?? 0) : 0,
                        max: _key === 'minAmount' ? (config?.maxAmount ?? MAX_NUMBER) : MAX_NUMBER,
                        step: _key === 'maxAmount' || _key === 'minAmount' ? Math.pow(10, -(Math.max(Math.min(config?.pricePrecision ?? 4, 8), 4))) : 1
                      }
                    }
                    helperText={hasProperty ? errors.config[_key] : undefined}
                    error={hasProperty && errors?.config[_key] != null}
                    onBlur={($e) => {
                      _onBlur($e, key, errors, hasProperty, config, setConfig, setErrors);
                    }}
                    onChange={($e) => {
                      _onChange($e, _key, pair, config, setConfig);
                      onChange($e, { ...pair }, index);
                    }}
                    disabled={loading}
                  />
                </Grid>
              )
            }))
        ) : null
      }
      <Grid item xs={12} md={12}>
        {searchfailed && <MessageView variant='warning' message={searchfailed} />}
      </Grid>

    </>
  )
}



interface PairsFormProps {
  title: string;
  chainId: ChainId;
  pairs?: CurrencyPairMetaData[];
  editable?: boolean;
}

type Props = PairsFormProps & WizardProps<ConfigFileExchange, keyof ConfigFileExchange>;
const PairsForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation, chainId, editable } = props;
  const classes = useStyle();
  const [pairs, setPairs] = useState(props.pairs ?? []);
  const listToken = useTokenList(GET_NETWORK_NAME(chainId));

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

  const addPair = useCallback((index?: number, $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable) && pairs?.length > 0) {
      return;
    }
    const newItem = {
      base: '',
      quote: '',
      config: {
        basePrecision: 18,
        quotePrecision: 18,
        maxAmount: 20,
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
  }, [pairs, setPairs, editable]);

  useEffect(() => {
    changeIssuerForm('pairs', [...pairs]);
  }, [pairs, changeIssuerForm]);

  useEffect(() => {
    console.log('pairsForm loaded!');
    if (pairs == null || pairs?.length === 0) {
      addPair();
    }
  }, []);

  const remPair = useCallback((index: number, $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable)) {
      return;
    }
    if (index >= 0 && index < pairs?.length) {
      pairs.splice(index, 1);
      const _pairs = [...pairs];
      setPairs(_pairs);
    }
  }, [pairs, setPairs, editable]);

  const sortPair = useCallback((index: number, action: 'UP' | 'DOWN', $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable)) {
      return;
    }
    const direction = action === 'UP' ? -1 : 0;
    const removed = pairs.splice(index + direction, 1);
    if (action === 'UP') {
      pairs.splice(index, 0, ...removed);
    } else {
      pairs.splice(index + 1, 0, ...removed);
    }
    const _pairs = [...pairs];
    setPairs(_pairs);
  }, [pairs, setPairs, editable]);

  const AccordionLabelComponente = memo((props: AccordionLabel) => {
    const {base, quote, address } = props;
    const text =  base && quote ? `${base}/${quote} ${truncateAddress(address)}` :
    `${truncateAddress(address)}`;
    return (
      <Typography className={classes.heading} variant="subtitle2" component="h2">
        {text}
      </Typography>
    )
  });

  return (
    <GridContainer>
      {
        pairs != null ? pairs.map((pair: CurrencyPairMetaData, i: number) => (
          <Grid item xs={12} md={12} sm={12}>
            <Accordion defaultExpanded={!Boolean(pair?.address)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls={`accordion-summary-${i}`}
                id={`accordion-summary-${i}`}
              >
                <AccordionLabelComponente
                  address={pair.address}
                  base={pair.base}
                  quote={pair.quote}
                  key={'accordioLabel'} 
                />
                <AccordionActions>
                  <CustomIconButton aria-label={`add(${i})`} onClick={($e) => addPair(i, $e)} disabled={Boolean(editable) ? !startValidation : true}>
                    <AddCircleOutlineOutlinedIcon fontSize="small" />
                  </CustomIconButton>
                  {
                    i > 0 ? (
                      <>
                        <CustomIconButton
                          key={`delete(${(new Date()).getTime()})`}
                          aria-label={`delete(${i})`}
                          disabled={!Boolean(editable)}
                          onClick={($e) => remPair(i, $e)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </CustomIconButton>
                        <CustomIconButton
                          key={`up(${i})`}
                          aria-label={`up(${i})`}
                          onClick={($e) => sortPair(i, 'UP', $e)}
                          disabled={!Boolean(editable)}
                        >
                          <ArrowUpwardOutlinedIcon fontSize="small" />
                        </CustomIconButton>
                        <CustomIconButton
                          key={`down(${i})`} aria-label={`down(${i})`}
                          disabled={Boolean(editable) ? Boolean(i >= pairs?.length - 1) : true}
                          onClick={($e) => sortPair(i, 'DOWN', $e)}
                        >
                          <ArrowDownwardOutlinedIcon fontSize="small" />
                        </CustomIconButton>
                      </>

                    ) :
                      (
                        <>
                          <CustomIconButton
                            key={`up(${i})`}
                            aria-label={`up(${i})`}
                            disabled={true}
                          >
                            <ArrowUpwardOutlinedIcon fontSize="small" />
                          </CustomIconButton>
                          <CustomIconButton
                            key={`down(${i})`} aria-label={`down(${i})`}
                            disabled={Boolean(editable) ? Boolean(i >= pairs?.length - 1) : true}
                            onClick={($e) => sortPair(i, 'DOWN', $e)}
                          >
                            <ArrowDownwardOutlinedIcon fontSize="small" />
                          </CustomIconButton>
                        </>
                      )
                  }
                </AccordionActions>
              </AccordionSummary>
              <AccordionDetails>
                <GridContainer>
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
                </GridContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )) : null
      }
    </GridContainer >
  );
}

export default PairsForm;