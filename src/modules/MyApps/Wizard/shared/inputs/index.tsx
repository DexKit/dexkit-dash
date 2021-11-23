import React, {FC, useEffect, useRef, useState} from 'react';
import {InputAdornment} from '@material-ui/core';

import {
  InfoButtonComponent,
  PopOverProps,
} from 'shared/components/ActionsButtons/infoButtonComponent';
import {CustomTextInput} from 'shared/components/Inputs/customTextInput';
import {CustomLabel} from 'shared/components/Wizard/Label';
import {error} from '..';
import {GeneralConfig} from 'types/myApps';

interface WizardTextInputProps {
  required?: boolean;
  label: string;
  id?: string;
  error: error;
  property: keyof GeneralConfig;
  value?: string;
  placeholder?: string;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | string
      | undefined,
    field: string,
  ) => void;
  validator: (field: keyof GeneralConfig, error: error) => error;
  minLength?: number;
  maxLength?: number;
  valided?: boolean;
  disabled?: boolean;
  updateError: (value: React.SetStateAction<error>) => void;
  infoText?: string;
}
export const WizardTextInput: FC<WizardTextInputProps> = (props) => {
  const {
    value: startValue,
    minLength,
    maxLength,
    valided,
    onChange,
    label,
    placeholder,
    error,
    property,
    required,
    validator,
    updateError,
    disabled,
    infoText,
  } = props;

  const [value, setValue] = useState(startValue);
  const interval = useRef<number>();

  useEffect(() => {
    if (onChange != null) {
      if (interval.current) {
        console.log('limpou');
        clearTimeout(interval.current);
      }
      interval.current = setTimeout(() => {
        onChange(value, property);
        updateError({...validator(property, error ?? {})});
      }, 1200) as unknown as number;
    }
  }, [value]);

  console.log('error', error != null && error[property]);
  return (
    <CustomTextInput
      key={property?.toString()}
      id={property?.toString()}
      fullWidth
      label={
        required != null ? <CustomLabel text={label} required={true} /> : label
      }
      variant='outlined'
      value={value}
      placeholder={placeholder}
      helperText={
        !valided ? (error != null ? error[property] : undefined) : undefined
      }
      minLength={minLength}
      maxLength={maxLength}
      error={Boolean(error != null && error[property])}
      onBlur={($e) => {
        if (Boolean(disabled)) {
          return;
        }
        updateError({...validator(property, error ?? {})});
        $e.preventDefault();
      }}
      validator={(value) =>
        error == null || (error != null && error[property] == null)
      }
      onChange={($e) => {
        if (Boolean(disabled)) {
          return;
        }
        setValue($e.target.value);
        $e.preventDefault();
      }}
      onError={() => console.log('ocorreu o erro')}
      disabled={!Boolean(disabled)}
      endAdornment={
        <InputAdornment position='end'>
          <InfoButtonComponent
            popoverProps={
              {
                anchorReference: 'anchorEl',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
              } as PopOverProps
            }
            text={infoText}
          />
        </InputAdornment>
      }
    />
  );
};
