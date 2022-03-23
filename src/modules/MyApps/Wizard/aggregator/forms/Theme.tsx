import React from 'react';

import Grid from '@material-ui/core/Grid';
import {FormikProps} from 'formik';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface GeneralFormProps {
  formik: FormikProps<any>;
}

export const ThemeForm = (props: GeneralFormProps) => {
  const {formik} = props;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} sm={12}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.is_dark_mode}
            control={
              <Checkbox
                defaultChecked={formik.values.is_dark_mode}
                onChange={formik.handleChange}
                name={'is_dark_mode'}
                id='is_dark_mode'
                color='primary'
              />
            }
            label={'Dark Mode as Default'}
            labelPlacement='end'
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          type={'color'}
          id='brand_color'
          name='brand_color'
          label='Brand Color'
          variant='outlined'
          value={formik.values.brand_color}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.brand_color)}
          helperText={formik.errors.brand_color}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          type={'color'}
          id='brand_color_dark'
          name='brand_color_dark'
          label='Brand Color Dark'
          variant='outlined'
          value={formik.values.brand_color_dark}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.brand_color_dark)}
          helperText={formik.errors.brand_color_dark}
        />
      </Grid>
    </Grid>
  );
};
