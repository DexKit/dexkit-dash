import React, { useState, useEffect } from 'react';
import { 
  Box,
  Checkbox, 
  CircularProgress, 
  FormControlLabel, 
  Grid, 
  InputAdornment, 
  TextField 
} from '@material-ui/core';
import { GeneralConfigAggregator } from 'types/myApps';
import { capitalize, urlValidator } from 'utils/text';
import { isAddress } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { InfoComponent } from '../../shared/Buttons/infoComponent';

interface error {
  [key: string]: string | undefined;
}

type k = keyof GeneralConfigAggregator;

interface ItemComponentProps {
  fieldName: k;
  label: string | React.ReactElement;
  placeholder?: string;
  value?: string | boolean;
  validator: (isValid: boolean) => void;
  changeField: (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    type: 'string' | 'number' | 'boolean'
  ) => void;
  isValid: boolean;
  helpText: string;
}
type TypeElement = 'checkbox' | 'url' | 'percentage' | 'color' | 'address' | 'text';

export const ItemComponent: React.FC<ItemComponentProps> = (
  { 
    fieldName, 
    value: initialValue, 
    changeField, 
    validator, 
    isValid: startValidation, 
    label,
    placeholder,
    helpText
  }: ItemComponentProps
) => {
  const [error, setError] = useState<error>({[fieldName]: undefined});
  const [valid, setValid] = useState<boolean>(startValidation);
  const [value, setValue] = useState(initialValue);
  const [typeElement, setTypeElement] = useState<TypeElement>()
  


  useEffect(() => {
    setValid(error[fieldName] == null);
  }, [error, fieldName]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  useEffect(() => {
    if (typeof value === 'boolean') {
      setTypeElement('checkbox');
    }
    else if (['logo', 'logo_dark', 'domain'].includes(fieldName)) {
      setTypeElement('url');
    } else if (['feeRecipient', 'buyTokenPercentage'].includes(fieldName)) {
      setTypeElement('percentage');
    } else if (['brand_color', 'brand_color_dark'].includes(fieldName)) {
      setTypeElement('color')
    } else if (['affiliateAddress', 'default_token_address', 'default_token_address_bsc'].includes(fieldName)) {
      setTypeElement('address');
    } else {
      setTypeElement('text');
    }
  }, []);

  switch (typeElement) {
    case 'checkbox':
      return (
        <Grid item xs={6} md={6} sm={6}>
          <FormControlLabel
            value={(value ?? false) as boolean}
            control={
              <Checkbox
                defaultChecked={(value ?? false) as boolean}
                onChange={
                  ($e) => {
                    setValue(Boolean($e.target.value));
                    changeField($e, fieldName, 'boolean');
                  }
                }
                name={capitalize(fieldName,'_')}
                color="primary"
              />
            }
            label={capitalize(fieldName,'_')}
            labelPlacement="end"
          />
          {/* <InfoComponent text={helpText}/> */}
        </Grid>
      );
    case 'url': {
      return (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            type="url"
            value={value}
            key={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            id={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            helperText={!valid && error != null ? error[fieldName] : undefined}
            error={(error != null && error[fieldName] != null) as boolean}
            onBlur={() => {
              const url = value != null ? value as string :  '';
              const _error = url.length > 0 ? ( !urlValidator(url) ? `${capitalize(fieldName, '_', ' ')} is invalid!` : undefined ) : `${capitalize(fieldName, '_', ' ')} is invalid!`;
              if (error != null) {
                setError({[fieldName]: _error})
              } else {
                setError({ [fieldName]: undefined })
              }

            }}
            onChange={
              ($e) => {
                setValue($e.target.value);
                changeField($e, fieldName, 'string');
              }
            }
            fullWidth
            label={label}
            // placeholder={placeholder}
            placeholder={placeholder ?? `https://any-url-for-${fieldName}.com`}
            InputLabelProps={{
              // shrink: placeholder != null,
              shrink: true,
            }}
            variant="outlined"
            InputProps={{ endAdornment: (<InfoComponent text={helpText}/>)}}
          />
        </Grid>
      );
    }
    case 'percentage':{
      return (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            type="number"
            value={value}
            inputProps={
              {
                min: 0.0,
                max: 100,
                step: 0.1
              }
            }
            InputProps={{
              endAdornment: (
                <Box component="span">
                  <InputAdornment position="end" style={{ marginInline: '7px'}}>%</InputAdornment>
                  <InfoComponent text={helpText}/>
                </Box>
              )
            }}
            key={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            id={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            helperText={!valid && error != null ? error[fieldName] : undefined}
            error={(error != null && error[fieldName]) as boolean}
            onBlur={() => {
              const perc = Number(value ?? 0);
              const _error = (perc < 0 ||  perc > 100  || isNaN(perc) || !isFinite(perc)) ? `Percentage in ${capitalize(fieldName, '_')} is invalid` : undefined;
              if (_error != null) {
                setError({[fieldName]: _error })
              } else {
                setError({[fieldName]: undefined })
              }
            }}
            onChange={
              ($e) => {
                const perc = Number($e.target.value);
                setValue(perc.toString());
                changeField($e, fieldName, 'number');
              }
            }
            fullWidth
            label={label}
            placeholder={placeholder ?? '0-100%'}
            variant="outlined"
          />
        </Grid>
      )

    }
    case 'color':
      return (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            value={value ?? '#FFFF'}
            type="color"
            key={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            id={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            helperText={!valid && error != null ? error[fieldName] : undefined}
            error={(error != null && error[fieldName]) as boolean}
            onBlur={() => {
              if (error != null && (error[fieldName] ?? '').toString().length < 5 ) {
                setError({[fieldName]: `Color in ${capitalize(fieldName, '_')}  is invalid!`})
              } else {
                setError({[fieldName]: undefined })
              }
            }}
            onChange={
              ($e) => {
                setValue($e.target.value);
                changeField($e, fieldName, 'string');
              }
            }
            fullWidth
            label={capitalize(fieldName,'_')}
            variant="outlined"
            InputProps={{ endAdornment: (<InfoComponent text={helpText}/>)}}
          />
        </Grid>
      );
    case 'address':{
      
      return (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            type="text"
            value={value}
            key={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            id={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            helperText={!valid && error!= null ? error[fieldName] : undefined}
            error={(error != null && error[fieldName]) as boolean}
            placeholder={placeholder ?? ZERO_ADDRESS.toString()}
            onBlur={() => {
              if (value == null || !isAddress(value.toString().trim())) {
                setError({ [fieldName]: `${capitalize(fieldName, '_')} address is invalid!` })
              } else {
                setError({ [fieldName]: undefined })
              }
            }}
            onChange={
              ($e) => {
                setValue($e.target.value);
                changeField($e, fieldName, 'string');
              }
            }
            InputLabelProps={{
              // shrink: placeholder != null,
              shrink: true,
            }}
            fullWidth
            label={label}
            variant="outlined"
            InputProps={{ endAdornment: (<InfoComponent text={helpText}/>)}}
          />
        </Grid>
      );
    }
    case 'text':{
      return (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            type="text"
            value={value}
            key={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            id={`aggregator-${fieldName.replace('_', '-').toLowerCase()}`}
            helperText={!valid && error != null ? error[fieldName] : undefined}
            error={(error != null && error[fieldName]) as boolean}
            onBlur={() => {
              const _text = value != null ? value as string :  '';
              const _error = _text.length < 3 ? `${capitalize(fieldName, '_', ' ')} is invalid!` : undefined;
              if (error != null) {
                setError({[fieldName]: _error})
              } else {
                setError({ [fieldName]: undefined })
              }

            }}
            onChange={
              ($e) => {
                setValue($e.target.value);
                changeField($e, fieldName, 'string');
              }
            }
            fullWidth
            label={label}
            variant="outlined"
            placeholder={placeholder ?? 'enter text'}
            InputLabelProps={{
              // shrink: placeholder != null,
              shrink: true,
            }}
            InputProps={{ endAdornment: (<InfoComponent text={helpText}/>)}}
          />
        </Grid>
      );
    }

    default: return <CircularProgress color="secondary" />
      

  }
}
