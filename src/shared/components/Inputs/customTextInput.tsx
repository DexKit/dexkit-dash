import { InputBaseComponentProps, TextField } from '@material-ui/core';
import React, { PropsWithChildren, useEffect, useState } from 'react';

interface CustomTextInputProps {
  required?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  key?: React.Key | null;
  variant?: 'filled' | 'outlined';
  value?: string;
  helperText?: string | HTMLSpanElement | React.Component;
  label: string | HTMLLabelElement | JSX.Element ;
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inputProps?: InputBaseComponentProps;
  minLength?: number;
  maxLength?: number;
  validator?:(value?: string) => boolean;
  valided?: boolean;
  onError?: () => void;
  disabled?:boolean;
  endAdornment?: React.ReactNode

}

const _validator = (
  value: string, 
  setValid: React.Dispatch<boolean>, 
  minlength?: number,
  validator?: (value?: string) => boolean
) => {
  if(!!minlength && minlength > (value?.length ?? 0))
  {
    setValid(false);
  } else if(validator != null){
    const v = validator(value);
    console.log('_validator', v);
    setValid(v);
  }
}

type Props = PropsWithChildren<CustomTextInputProps>;

export function CustomTextInput(props: Props) {
  const { 
    value: startValue, 
    minLength: startMinLength, 
    maxLength: startMaxLength, 
    valided, 
    onChange, 
    onBlur, 
    inputProps, 
    validator,
    error: startError,
    onError,
    label,
    placeholder,
    fullWidth,
    helperText,
    endAdornment
  } = props;
  const [value] = useState(startValue);
  const[minLength] = useState(startMinLength ?? -1);
  const[maxLength] = useState(startMaxLength ?? 10000000000);
  const [error, setError] = useState(startError);
  const [isValid, setValid] = useState(valided);

  useEffect(() => {
    if(isValid == false)
      setError(true);
    else {
      setError(false);
    }
  }, [isValid]);

  useEffect(() => {
    if(onError != null && error)
      onError();
  }, [error])
  return (
    <TextField
      type='text'
      variant={ props.variant ?? 'standard'}
      value={value}
      error={error}
      label={label}
      fullWidth={fullWidth}
      placeholder={placeholder}
      helperText={helperText}
      onChange={($e) => {
        if(onChange != null) onChange($e);
      }}
      onBlur={($e) => {
        const { value: _value } = $e.target;
        _validator(_value, setValid, minLength, validator);
        if(!!onBlur) onBlur($e);
      }}
      inputProps={{
        minLength,
        maxLength,
        ...inputProps
      }}
      InputProps={{
        endAdornment,
      }}
    />
  )
}

