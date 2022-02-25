import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {useFormik} from 'formik';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';

import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600,
  },
}));

const formSchema = yup.object().shape({
  entryAmount: yup.number().min(1).max(100000).required(),
  startsAt: yup.string().required(),
});

interface GameParams {
  entryAmount: number;
  startsAt: string;
}

export const CreateGamePage = () => {
  const classes = useStyles();

  const {messages} = useIntl();

  const handleSubmit = useCallback(() => {}, []);

  const formik = useFormik<GameParams>({
    initialValues: {
      entryAmount: 1,
      startsAt: '',
    },
    validationSchema: formSchema,
    onSubmit: handleSubmit,
  });

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Typography
              className={classes.bold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages id='squidLeague.SquidLeague' />
            </Typography>
            <Typography color='textSecondary' variant='body1'>
              <IntlMessages id='squidLeague.SquidLeagueDescription' />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={classes.bold}
            color='textPrimary'
            variant='subtitle1'>
            <IntlMessages id='squidLeague.createGame' />
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <IntlMessages id='squidLeague.setTheParametersOfTheGame' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <TextField
                label={messages['squidLeague.entryAmount'] as string}
                value={formik.values.entryAmount}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.entryAmount)}
                helperText={
                  Boolean(formik.errors.entryAmount) &&
                  formik.errors.entryAmount
                }
                name='entryAmount'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={messages['squidLeague.startsAt'] as string}
                value={formik.values.startsAt}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.startsAt)}
                helperText={
                  Boolean(formik.errors.startsAt) && formik.errors.startsAt
                }
                name='startsAt'
                type='datetime-local'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            type='submit'
            disabled={!formik.isValid}
            variant='contained'
            color='primary'>
            <IntlMessages id='squidLeague.createGame' />
          </Button>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default CreateGamePage;
