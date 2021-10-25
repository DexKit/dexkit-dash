import React from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as People} from 'assets/images/icons/people.svg';
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
  const {messages} = useIntl();
  const {num_players, current_players} = props;

  return (
    <Container className={classes.container}>
      <Grid
        container
        className={classes.innerContent}
        justifyContent={'center'}
        alignItems={'center'}
        alignContent={'center'}>
        <Grid item xs={12}>
          <Paper>
            <Box display={'flex'} justifyContent={'center'} p={2}>
              <People />
              <Typography>
                &nbsp;
                {`${messages['app.players']} ${current_players} (${num_players})`}{' '}
              </Typography>
            </Box>
          </Paper>
          {/* <Button
            fullWidth
            variant={'contained'}
            disabled={num_players !== current_players}
            startIcon={}>
           
         </Button>*/}
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardInfoPlayers;
