import React from 'react';

import {GridContainer} from '@crema';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(5),
  },
  input: {},
}));

const GeralStep: React.FC = () => {
  const classes = useStyles();

  return (
    <GridContainer spacing={4} className={classes.root}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Name
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Logo
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Logo Dark
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Buy Token Percentage
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth required size='small'>
          <FormLabel style={{marginBottom: 5, color: '#fff'}}>Domain</FormLabel>
          <OutlinedInput
            placeholder='Content'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton edge='end' size='small'>
                  <InfoIcon style={{color: '#646672'}} />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <RadioGroup row>
              <FormControlLabel
                value='bsc'
                control={<Radio />}
                label='Bsc as Default'
              />
              <FormControlLabel
                value='matic'
                control={<Radio />}
                label='Matic As Default'
              />
            </RadioGroup>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label='Hide Powered By Dexkit'
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Affiliate Address
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Default Token Address
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Default Token Address BSC
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required size='small'>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Default Token Address matic
              </FormLabel>
              <OutlinedInput
                placeholder='Content'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' size='small'>
                      <InfoIcon style={{color: '#646672'}} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={6} xs={12}>
        <FormControl fullWidth required size='small'>
          <FormLabel style={{marginBottom: 5, color: '#fff'}}>
            Default Slippage
          </FormLabel>
          <OutlinedInput
            placeholder='Content'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton edge='end' size='small'>
                  <InfoIcon style={{color: '#646672'}} />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
    </GridContainer>
  );
};

export default GeralStep;
