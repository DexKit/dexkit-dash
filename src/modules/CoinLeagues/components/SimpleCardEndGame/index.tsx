import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(4, 2),
  },
  button: {
    fontWeight: 600,
    borderRadius: 6,
    fontSize: '1.125rem',
    background: '#ffa552',
    justifyContent: 'center',
  },
}));

interface Props {
  onClick: (args: any) => void;
}

function SimpleCardEndGame(props: Props): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Grid container>
        <Button className={classes.button} fullWidth onClick={props.onClick}>
          <IntlMessages key='app.coinLeagues.endGame' />
        </Button>
      </Grid>
    </Container>
  );
}

export default SimpleCardEndGame;
