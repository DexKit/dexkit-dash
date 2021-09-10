import React from 'react';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import CardPrize from '../../components/CardPrize';


const coins = [
  {name: 'RDC', icon: '0'},
  {name: 'BCD', icon: '1'},
  {name: 'DOG', icon: '2'},
  {name: 'BSC', icon: '3'},
  {name: 'KIT', icon: '4'},
  {name: 'ADA', icon: '5'},
  {name: 'ABC', icon: '6'},
  {name: 'CDS', icon: '7'},
  {name: 'HYR', icon: '8'},
];

const rowsMock = [
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: true,
    position: -19,
  },
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: false,
    position: 10,
  },
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: true,
    position: 24,
  },
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: true,
    position: 10,
  },
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: false,
    position: -10,
  },
  {
    coins,
    hash: '0x0000000000000000000',
    claimed: true,
    position: 10,
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(2),
    backgroundColor: '#1F1D2B',
  },
  chip: {
    color: '#fff',
    background: '#1F1D2B',
    border: '2px solid #2e3243',
  },
}));

interface Props {
  id: number;
  time: number;
  prizePool: number;
  value: {qty: number; coin?: string};
}

function Game(props: Props) {
  const classes = useStyles();

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container spacing={4}>
        <Grid item xs={12}  sm={12} xl={12}>
          <Grid container>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.75rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link color='inherit' href=''>
                Dashboard
              </Link>
              <Link color='inherit' href=''>
                Games
              </Link>
              <Typography color='textPrimary'>#{props.id}</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid container xs={12} xl={12} sm={12}>
            <Typography variant='h5' style={{margin: 5}}>
              <ArrowBackIcon /> Game #{props.id}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container xs={6} style={{border: '1px solid #fff', margin: 5}}>
            <Typography>Copy URL</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} spacing={2} alignContent='space-around'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {/*<SimpleCardGame
                id={props.id}
                time={props.time}
                value={props.value}
              />*/}
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <CardPrize prizePool={props.prizePool || 0} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              [ COUNTDOWN COMPONENT ]
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} spacing={2}>
         {/* <PlayersTable data={rowsMock} />*/}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Game;
