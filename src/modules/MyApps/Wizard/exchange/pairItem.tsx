import React, { FC } from 'react';
import { TextField, InputBaseComponentProps } from '@material-ui/core';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { InfoComponent } from '../shared/Buttons/infoComponent';
import { HELP_TEXT_PAIR_CONFIG } from './helpText';
import { getHelpText } from '../shared';

interface PairItemComponentProps {
  readonly index: number;
  readonly key: string; 
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly helperText?: string;
  readonly onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  readonly onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  readonly error: boolean;
  readonly inputProps?: InputBaseComponentProps | undefined;
  readonly value: number | string | undefined; 
  readonly label?: string;
}
export const PairItemComponent: FC<PairItemComponentProps> = (props) => {

  const { 
    index, 
    key, 
    label, 
    value, 
    helperText, 
    error, 
    onBlur, 
    onChange,
    disabled,
    placeholder,
    inputProps
  } = props;

  return (
    <TextField
      type="number"
      key={`pair(${index}).${key}`} id={`pair(${index}).${key}`}
      fullWidth
      label={<CustomLabel text={label} required={true} />}
      placeholder={placeholder}
      variant='outlined'
      value={value}
      inputProps={inputProps}
      helperText={helperText}
      error={error}
      onBlur={onBlur}
      onChange={onChange}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{ endAdornment: (
      <InfoComponent text={getHelpText(HELP_TEXT_PAIR_CONFIG, key, 0)} />
      ) }}
      disabled={disabled}
    />
  )
}