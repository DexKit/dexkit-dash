import React, {useCallback} from 'react';

import {Select, MenuItem, FormControl} from '@material-ui/core';

import {GET_GAME_ORDER_OPTIONS} from 'modules/CoinLeagues/utils/game';
import {GameOrderBy} from 'modules/CoinLeagues/constants/enums';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  onChange: (value: GameOrderBy) => void;
  value: GameOrderBy;
}

export const GameOrderBySelect = (props: Props) => {
  const {value, onChange} = props;

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <FormControl fullWidth>
      <Select onChange={handleChange} value={value}>
        {GET_GAME_ORDER_OPTIONS().map((option, index) => (
          <MenuItem value={option.value} key={index}>
            <IntlMessages id={option.messageId} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GameOrderBySelect;
