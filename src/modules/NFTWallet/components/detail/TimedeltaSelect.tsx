import IntlMessages from '@crema/utility/IntlMessages';
import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import {getUnixDays} from 'modules/NFTWallet/utils';
import React, {ChangeEvent, useCallback, useState} from 'react';
import {useIntl} from 'react-intl';

interface Option {
  caption: string;
  timedelta?: number;
  custom?: boolean;
}

const DEFAULT_OPTIONS: Option[] = [
  {
    caption: 'In 7 days',
    timedelta: getUnixDays(7),
  },
  {
    caption: '3 days',
    timedelta: getUnixDays(3),
  },
  {
    caption: 'A month',
    timedelta: getUnixDays(30),
  },
  {caption: 'Never Expire'},
  {caption: 'Custom', custom: true},
];

interface Props {
  onSelect: (opt: Option) => void;
}

export default (props: Props) => {
  const {onSelect} = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const {messages} = useIntl();

  const handleChange = useCallback(
    (e) => {
      let index = parseInt(e.target.value);
      setSelectedIndex(index);
      onSelect(DEFAULT_OPTIONS[index]);
    },
    [onSelect],
  );

  return (
    <FormControl variant='outlined' fullWidth>
      <InputLabel>
        <IntlMessages id='nfts.wallet.offer.expiration' />
      </InputLabel>
      <Select
        label={messages['nfts.wallet.offer.expiration'].toString()}
        value={selectedIndex}
        fullWidth
        onChange={handleChange}
        variant='outlined'>
        {DEFAULT_OPTIONS.map((option: Option, index: number) => (
          <MenuItem key={index} value={index}>
            {option.caption}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
