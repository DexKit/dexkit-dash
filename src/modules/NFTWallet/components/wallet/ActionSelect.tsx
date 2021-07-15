import React from 'react';
import {MenuItem, Select, SelectProps} from '@material-ui/core';

export enum Actions {
  CREATE_BUNDLE = 'CREATE_BUNDLE',
}

export interface ActionSelectProps extends SelectProps {}

export default (props: ActionSelectProps) => {
  return (
    <Select {...props} displayEmpty>
      <MenuItem value=''>Actions</MenuItem>
      <MenuItem value={Actions.CREATE_BUNDLE}>Create bundle</MenuItem>
    </Select>
  );
};
