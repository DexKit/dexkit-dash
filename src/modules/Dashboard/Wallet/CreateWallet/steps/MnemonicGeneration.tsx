import React, {useEffect} from 'react';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const MnemonicGeneration: React.FC<any> = ({mnemonics, setAllowStep}) => {
  const classes = useStyles();

  useEffect(() => {
    setAllowStep(true);
  }, [setAllowStep]);

  return (
    <Container maxWidth='sm' className={classes.root}>
      <Box style={{width: '100%', textAlign: 'center'}}>
        <Typography>
          Write these words in the correct order and keep them in a safe place.
        </Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Box style={{width: '100%', textAlign: 'center'}}>
        {mnemonics?.map((mnemonic: string, index: number) => (
          <Chip
            key={index}
            style={{padding: 10, margin: 5}}
            clickable
            color='primary'
            label={mnemonic}
            icon={<p style={{padding: 10}}>{index + 1}</p>}
          />
        ))}
      </Box>

      <Divider style={{margin: 10}} />

      <Box style={{width: '100%', textAlign: 'center'}}>
        <Typography>
          1. Write the phrase on paper.
          <br />
          2. Be sure to sign that this is the key to dexkit.com
        </Typography>
      </Box>
    </Container>
  );
};

export default MnemonicGeneration;
