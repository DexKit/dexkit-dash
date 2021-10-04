import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import {ReactComponent as People} from 'assets/images/icons/people.svg';
import Skeleton from '@material-ui/lab/Skeleton';

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

function CardInfoPlayersSkeleton(): JSX.Element {
  const classes = useStyles();

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
              <Skeleton>
                <Typography>
                  &nbsp;
                  {`PLAYERS ${0} (${10})`}
                </Typography>
              </Skeleton>
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

export default CardInfoPlayersSkeleton;
