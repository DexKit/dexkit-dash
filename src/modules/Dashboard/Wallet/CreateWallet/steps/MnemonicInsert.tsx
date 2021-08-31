import React, {useEffect, useState} from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const MnemonicInsert: React.FC<any> = ({setAllowStep, setMnemonics}) => {
  const [inserted, setInserted] = useState<string>('');

  useEffect(() => {
    const isValid = inserted.split(' ').length >= 12;
    setAllowStep(isValid);
    if (isValid) setMnemonics(inserted.split(' '));
  }, [inserted, setAllowStep, setMnemonics]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist();
    setInserted(e.target.value);
  }

  return (
    <Container maxWidth='sm'>
      <Box style={{width: '100%', textAlign: 'center'}}>
        <Typography variant='subtitle1'>
          Insert your wallet mnemonics':
        </Typography>
      </Box>
      <Divider style={{margin: 10}} />
      <TextField
        fullWidth
        value={inserted}
        variant='outlined'
        label='Your mnemonics'
        error={!!inserted && inserted.split(' ').length < 12}
        onChange={handleChange}
      />
    </Container>
  );
};

export default MnemonicInsert;
