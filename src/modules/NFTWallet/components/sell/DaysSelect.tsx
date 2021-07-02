import React from 'react';
import {SelectProps, Select, MenuItem} from '@material-ui/core';
import {getUnixDays} from 'modules/NFTWallet/utils';

const ITEMS = [
  {caption: '1 day', days: getUnixDays(1)},
  {caption: '2 days', days: getUnixDays(2)},
  {caption: '3 days', days: getUnixDays(3)},
  {caption: '7 days', days: getUnixDays(7)},
  {caption: '30 days', days: getUnixDays(30)},
];

interface Props extends SelectProps {
  emptyLabel: string;
}

export default (props: Props) => {
  const {emptyLabel} = props;

  return (
    <Select {...props}>
      <MenuItem value='0'>{emptyLabel}</MenuItem>
      {ITEMS.map((item, index) => (
        <MenuItem key={index} value={item.days}>
          {item.caption}
        </MenuItem>
      ))}
    </Select>
  );
};
