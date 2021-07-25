import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import Assignment from '@material-ui/icons/Assignment';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  aligned: {textAlign: 'center', width: '100%', padding: 20},
  buttons: {
    marginTop: theme.spacing(1),
    display: 'flex',
    padding: 15,
    justifyContent: 'flex-end',
  },
  margin: {margin: theme.spacing(1)},
  container: {
    padding: theme.spacing(5),
    marginTop: 200,
    height: 250,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Transaction: React.FC = () => {
  const classes = useStyles();

  const [form, setForm] = useState({address: '', amount: 0});
  const [hasPasted, setHasPasted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist();
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  function handlePaste() {
    navigator.clipboard.readText().then((address) => {
      setHasPasted(true);
      setForm((prev) => ({...prev, address}));
    });
  }

  return (
    <div className={classes.container}>
      <Container maxWidth='sm' className={classes.aligned}>
        <Card component={Paper}>
          <form noValidate autoComplete='off'>
            <Typography style={{padding: 25}} variant='h5'>
              Insert the informations about the transfer
            </Typography>
            <Divider style={{margin: 10}} />
            <Box className={classes.aligned}>
              <TextField
                name='address'
                label='Target address'
                variant='outlined'
                value={form.address}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  label: 'Address',
                  endAdornment: (
                    <InputAdornment position='end' onClick={handlePaste}>
                      {hasPasted ? <CheckCircle /> : <Assignment />}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className={classes.aligned}>
              <TextField
                name='amount'
                fullWidth
                variant='outlined'
                label='Amount'
                type='number'
                value={form.amount}
                onChange={handleChange}
                InputProps={{
                  label: 'Amount',
                  startAdornment: (
                    <InputAdornment position='start'>₿</InputAdornment>
                  ),
                }}
              />
            </Box>
          </form>
          <div className={classes.buttons}>
            <Button
              color='secondary'
              variant='text'
              onClick={() => setForm({address: '', amount: 0})}>
              RESET
            </Button>
            <Button
              color='primary'
              variant='contained'
              disabled={Number(form.amount) <= 0 || !form.address}>
              TRANSFER
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Transaction;
