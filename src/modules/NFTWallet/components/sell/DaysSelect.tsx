import React from 'react';
import {
  SelectProps,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import {getUnixDays} from 'modules/NFTWallet/utils';

export interface Option {
  caption: string;
  days: number;
  custom?: boolean;
}

export const DAYS_SELECT_OPTIONS: Option[] = [
  {caption: 'Select', days: 0},
  {caption: '1 day', days: getUnixDays(1)},
  {caption: '2 days', days: getUnixDays(2)},
  {caption: '3 days', days: getUnixDays(3)},
  {caption: '7 days', days: getUnixDays(7)},
  {caption: '30 days', days: getUnixDays(30)},
  {caption: 'Custom', days: -1, custom: true},
];

interface Props extends SelectProps {
  emptyLabel: string;
  helperText?: string;
}

export default (props: Props) => {
  const {helperText, error} = props;

  return (
    <FormControl error={error}>
      <Select {...props}>
        {DAYS_SELECT_OPTIONS.map((item, index) => (
          <MenuItem key={index} value={index}>
            {item.caption}
          </MenuItem>
        ))}
      </Select>
      {error ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
