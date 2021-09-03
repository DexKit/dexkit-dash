import React from 'react';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import CardGame from '../../components/CardGame';

const cardMock = [
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
  },
  {
    id: 5345345224,
    time: 110,
    coins: 60,
    startsIn: 123123123,
    prizePool: 1000,
    entries: {in: 10, out: 20},
    value: {qty: 1000, coin: 'ETH'},
    btnMessage: 'VIEW',
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
    '&:hover': {
      background: '#2e3243',
    },
    '&:focus': {
      background: '#2e3243',
    },
  },
  btnFilter: {
    order: 3,
    [theme.breakpoints.only('xs')]: {
      order: 2,
    },
  },
  chipFilter: {
    order: 2,
    [theme.breakpoints.only('xs')]: {
      order: 3,
      margin: theme.spacing(1.5),
    },
  },
  btnLoadMore: {
    color: '#fff',
    background: '#2e3243',
  },
}));

function GamesInProgress() {
  const classes = useStyles();

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container spacing={4}>
        <Grid item xs={12} xl={12} sm={12}>
          <Grid item xs={12}>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.75rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link color='inherit' href=''>
                Dashboard
              </Link>
              <Link color='inherit' href=''>
                Games
              </Link>
              <Typography color='textPrimary'>Games in progress</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} xl={12} sm={12}>
            <Typography variant='h4' style={{margin: 5}}>
              <ArrowBackIcon /> Games in progress
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={6} style={{border: '1px solid #fff', margin: 5}}>
            <Typography>[ Search Component ]</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={3}>
              <Grid item xs={12} sm={12}>
                <Typography variant='h6'>21Games</Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography gutterBottom>
                  Recently added &nbsp;
                  <ExpandMoreIcon
                    fontSize='small'
                    style={{verticalAlign: 'top'}}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Grid item sm={6} spacing={1} justifyContent='center'>
              <Grid container justifyContent='center' spacing={2}>
                <Grid item>
                  <Chip clickable className={classes.chip} label='All' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='Fast' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='Medium' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='24hrs' />
                </Grid>
              </Grid>
            </Grid>
            <Grid container sm={3} justifyContent='flex-end'>
              <Button variant='text'>
                <FilterListIcon style={{color: '#fff'}} />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} justifyContent='flex-start'>
          <Grid container spacing={2}>
            {/*cardMock.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                <CardGame {...card} />
              </Grid>
            ))*/}
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        xs={12}
        style={{paddingTop: 25, paddingBottom: 50}}
        justifyContent='center'
        alignContent='center'>
        <Button className={classes.btnLoadMore} size='large'>
          <ArrowDropDownIcon fontSize='large' />
          <Typography variant='h6'>LOAD MORE</Typography>
        </Button>
      </Grid>
    </Container>
  );
}

export default GamesInProgress;
