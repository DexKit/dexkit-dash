import React from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

interface Props {
  message: string;
}

const ErrorView: React.FC<Props> = ({message}) => {
  const {messages} = useIntl();

  return (
    <Box py={4} display={'flex'} justifyContent={'center'}>
      <Grid
        container
        alignItems='center'
        alignContent='center'
        justify='center'
        direction='column'
        spacing={2}>
        <Grid item xs={12}>
          <WarningIcon color='secondary' fontSize='large' />
        </Grid>
        <Grid item xs={12}>
          <Typography
            style={{textTransform: 'uppercase'}}
            gutterBottom
            align='center'
            variant='h5'>
            {messages['app.opsErrorFetchingData']}
          </Typography>
          <Typography align='center'>
            {messages['app.tryAgainPlease']}!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorView;
