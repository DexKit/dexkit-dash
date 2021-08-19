import {
  Button,
  Grid,
  Card,
  Paper,
  CardContent,
  TextField,
  InputAdornment,
  Tooltip,
  Box,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  IconButton,
  FormControlLabel,
  Typography,
  Switch,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Link,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {Link as RouterLink} from 'react-router-dom';

import React, {useCallback, useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import IntlMessages from '@crema/utility/IntlMessages';

export interface TokenSetupProps {}

export const TokenSetup = (props: TokenSetupProps) => {
  const history = useHistory();

  const [values, setValues] = useState({
    name: '',
    symbol: '',
    supply: 0,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values, [e.target.name]: e.target.value});
    },
    [values],
  );

  const handleBack = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  return (
    <>
      <Box mb={4}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to='/wizard'>
            Wizard
          </Link>
          <Link color='inherit'>Create token</Link>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    label='Name'
                    variant='outlined'
                    name='name'
                    value={values.name}
                    error={values.name === ''}
                    helperText=''
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='The name of your token'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label='Symbol'
                    variant='outlined'
                    name='symbol'
                    value={values.symbol}
                    error={values.symbol === ''}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='Symbol used to identify the token in the blockchain'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Box p={4}>
              <Box display='flex' justifyContent='space-between'>
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  variant='outlined'>
                  Back
                </Button>
                <Button
                  startIcon={<ArrowForwardIcon />}
                  variant='contained'
                  color='primary'>
                  Next
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TokenSetup;
