import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Game } from 'types/coinsleague';
import {ReactComponent as People} from 'assets/images/icons/people.svg'
const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    padding: theme.spacing(2),
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));

interface Props {
  num_players: number;
  current_players: number;
}

function CardInfoPlayers(props: Props): JSX.Element {
  const classes = useStyles();
  const {num_players, current_players} = props;


  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
        <Grid item xs={12}  >
          <Button fullWidth variant={'contained'} disabled={num_players !== current_players} startIcon={<People/>}>
              {`PLAYERS ${current_players} (${num_players})`}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardInfoPlayers;
