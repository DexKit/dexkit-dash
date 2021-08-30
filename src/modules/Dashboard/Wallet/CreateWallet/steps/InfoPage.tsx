import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  aligned: {textAlign: 'center', width: '100%'},
}));

const ProcedureInfo: React.FC<any> = ({setHasSeed}) => {
  const classes = useStyles();

  return (
    <Container maxWidth='sm'>
      <Box className={classes.aligned}>
        <Typography>
          <b>Lorem ipsum dolor sit amet consectetur adipisicing elit</b>
        </Typography>
      </Box>

      <Box className={classes.aligned}>
        <Typography>Please save your secret phrase (12 words)!</Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Box className={classes.aligned}>
        <Typography>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est ducimus
          vero itaque architecto illo officia labore natus reiciendis ratione
          perferendis placeat, laborum repellat, sapiente modi amet quasi
          voluptatibus aliquam eos.
        </Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Container maxWidth='sm' style={{marginTop: '10%'}}>
        <Box className={classes.aligned}>ALREADY HAD A SEED?</Box>
        <Box className={classes.aligned} style={{marginTop: 10}}>
          <Button
            color='secondary'
            variant='contained'
            onClick={() => setHasSeed(true)}>
            Insert mnemonics
          </Button>
        </Box>
      </Container>
    </Container>
  );
};

export default ProcedureInfo;
