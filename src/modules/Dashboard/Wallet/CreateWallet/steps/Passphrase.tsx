import React, {useEffect, useState} from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

interface IPassphrase {
  [key: string]: string | null;
}

const useStyles = makeStyles(() => ({
  aligned: {textAlign: 'center', width: '100%'},
}));

const Passphrase: React.FC<any> = ({setAllowStep, setPass}) => {
  const classes = useStyles();

  const [passphrase, setPassphrase] = useState<IPassphrase>({
    inserted: null,
    confirmation: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const {name, value} = e.target;
    setPassphrase((prev) => ({...prev, [name]: value}));
  };

  useEffect(() => {
    const {inserted, confirmation} = passphrase;
    const isValid = confirmation && inserted === confirmation;

    // Allow the user to go forward in the parent stepper
    setAllowStep(isValid);
    isValid && setPass(passphrase.inserted);
  }, [setAllowStep, passphrase, setPass]);

  return (
    <Container maxWidth='sm'>
      <Box className={classes.aligned}>
        <Typography>
          <b>Set a passphrase to your wallet</b>
        </Typography>
        <Typography>Insert your passphrase</Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <form noValidate autoComplete='off'>
        <Box className={classes.aligned} style={{margin: 15}}>
          <TextField
            name='inserted'
            label='Your passphrase'
            variant='outlined'
            fullWidth
            type='password'
            onChange={handleChange}
          />
        </Box>
        <Box className={classes.aligned} style={{margin: 15}}>
          <TextField
            name='confirmation'
            label='Confirm the passphrase'
            variant='outlined'
            fullWidth
            type='password'
            onChange={handleChange}
            error={passphrase.inserted !== passphrase.confirmation}
          />
        </Box>
      </form>
    </Container>
  );
};

export default Passphrase;
