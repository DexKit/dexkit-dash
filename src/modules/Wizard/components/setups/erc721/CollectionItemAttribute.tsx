import React, {useCallback} from 'react';
import {Grid, TextField, MenuItem} from '@material-ui/core';
import {
  CollectionAttribute,
  DISPLAY_TYPE_BOOST_NUMBER,
  DISPLAY_TYPE_BOOST_PERCENTAGE,
  DISPLAY_TYPE_NUMBER,
} from 'modules/Wizard/types';

export interface CollectionItemAttribute {
  onChange: (attr: CollectionAttribute, index: number) => void;
  attribute: CollectionAttribute;
  index: number;
}

export const CollectionItemAttribute = (props: CollectionItemAttribute) => {
  const {attribute, index, onChange} = props;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({...attribute, [e.target.name]: e.target.value}, index);
    },
    [onChange, attribute, index],
  );

  // const handleSelect = useCallback(
  //   (
  //     e: React.ChangeEvent<{
  //       name?: string | undefined;
  //       value: unknown;
  //     }>,
  //   ) => {
  //     if (e.target.name) {
  //       onChange({...attribute, [e.target.name]: e.target.value}, index);
  //     }
  //   },
  //   [onChange, attribute, index],
  // );

  return (
    <Grid container spacing={2} alignItems='center' alignContent='center'>
      <Grid item xs={3}>
        <TextField
          size='small'
          variant='outlined'
          name='display_type'
          select
          SelectProps={{displayEmpty: true}}
          placeholder='Display type'
          fullWidth
          value={attribute.display_type || ''}
          onChange={handleChange}>
          <MenuItem value=''>None</MenuItem>
          <MenuItem value={DISPLAY_TYPE_NUMBER}>Number</MenuItem>
          <MenuItem value={DISPLAY_TYPE_BOOST_NUMBER}>Boost number</MenuItem>
          <MenuItem value={DISPLAY_TYPE_BOOST_PERCENTAGE}>
            Boost Percentage
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={5}>
        <TextField
          placeholder='Type'
          variant='outlined'
          size='small'
          onChange={handleChange}
          name='trait_type'
          value={attribute.trait_type}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          placeholder='Value'
          size='small'
          onChange={handleChange}
          name='value'
          value={attribute.value}
          fullWidth
          variant='outlined'
        />
      </Grid>
    </Grid>
  );
};

export default CollectionItemAttribute;
