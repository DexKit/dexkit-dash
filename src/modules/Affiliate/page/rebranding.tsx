import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import LinearProgress from '@material-ui/core/LinearProgress';

import {makeStyles} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import FilterIcon from '@material-ui/icons/FilterList';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LinkIcon from '@material-ui/icons/CallMadeOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import {Link, BrowserRouter as Router} from 'react-router-dom';

import AffiliateTotalCard from '../components/AffiliateTotalCard';
import {useUSDFormatter} from '../../../hooks/utils/useUSDFormatter';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(3),
    backgroundColor: '#1F1D2B',
  },
  affiliateCard: {
    borderRadius: 8,
    padding: theme.spacing(1.5),
    backgroundColor: '#252836',
  },
  field: {
    padding: theme.spacing(1),
    border: '1px solid #525C75',
    borderRadius: 5,
  },
  tableCell: {
    borderBottom: '1px solid #525C75',
    color: 'white',
    backgroundColor: 'transparent',
  },
  tableHead: {
    color: 'white',
  },
  filterBtn: {
    color: 'white',
    borderRadius: 5,
    backgroundColor: '#252836',
  },
  settingsBtn: {
    color: '#fff',
  },
}));

function LinearProgressWithLabel(props: {to: number; from: number}) {
  const {to, from} = props;
  const {usdFormatter} = useUSDFormatter();

  return (
    <Grid
      container
      md={6}
      xs={12}
      spacing={2}
      style={{
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#2E3243',
      }}>
      <Grid item xs={12}>
        <LinearProgress
          style={{borderRadius: 10}}
          variant='determinate'
          value={(from / (to || 1)) * 100}
        />
      </Grid>

      <Grid container justifyContent='space-between'>
        <Grid item xs={2}>
          <Typography variant='body2' color='inherit'>
            {usdFormatter.format(from)}
          </Typography>
        </Grid>

        <Grid item xs={8} />

        <Grid item xs={2}>
          <Typography variant='body2' color='inherit'>
            {usdFormatter.format(to)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface Props {
  coins?: any[];
  total?: number;
  chains?: any[];
  address?: string;
  affiliateLink?: string;
}

function AffiliatePage(props: Props) {
  const classes = useStyles();

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container xs={12} sm={8}>
        <Grid container>
          <Router>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.8rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link to=''>
                <Typography variant='subtitle2'>Dashboard</Typography>
              </Link>
              <Typography variant='subtitle2' style={{color: '#2e3243'}}>
                Página de Afiliados
              </Typography>
            </Breadcrumbs>
          </Router>
        </Grid>
        <Grid container xs={12} sm={10} alignContent='center'>
          <Typography
            variant='h5'
            style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
            Página de afiliados
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        style={{marginBottom: 20}}
        justifyContent='space-between'>
        <Grid item md={7} xs={12}>
          <AffiliateTotalCard total={props.total || 2000} />
        </Grid>
        <Grid item md={5} xs={12}>
          <Grid container>
            <Grid item xs={11}>
              <Typography style={{color: '#B3B7C0'}}>
                Account Receive Rewards:
              </Typography>
              <Typography>
                {props.address || '0x0000000000000000000000000000000'}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton className={classes.settingsBtn}>
                <SettingsIcon fontSize='large' />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.affiliateCard}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5'>Affiliate</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' style={{color: '#B3B7C0'}}>
                You need to have 200 KIT in your wallet to earn money from
                referrals.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgressWithLabel to={100} from={25} />
            </Grid>
          </Grid>
        </Grid>

        <Divider
          variant='middle'
          style={{
            background: '#525C75',
            width: '100%',
            padding: 0.2,
            margin: '10px auto',
          }}
        />

        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justifyContent='space-between'>
            <Grid item md={5} xs={12}>
              <FormControl fullWidth>
                <Typography>Chain</Typography>
                <Select
                  fullWidth
                  variant='outlined'
                  style={{border: '1px solid #525C75'}}>
                  {(props.chains || ['[SELECT CHAIN]']).map((chain, i) => (
                    <MenuItem value={chain} key={i}>
                      {chain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={7} xs={12}>
              <Typography>Affiliate link</Typography>
              <Box
                className={classes.field}
                display='flex'
                alignItems='center'
                justifyContent='space-between'>
                <Typography noWrap>{props.affiliateLink || 'Link'}</Typography>
                <IconButton size='small' color='primary'>
                  <FileCopyIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid container>
            <Button
              fullWidth
              style={{backgroundColor: '#FFA552', marginBottom: 15}}>
              <LinkIcon />
              OPEN SWAP
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Divider
        style={{
          backgroundColor: '#525C75',
          width: '95%',
          padding: 0.2,
          margin: '20px auto',
        }}
      />

      <Grid container spacing={2} style={{marginTop: 15}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant='h5' style={{fontWeight: 600}}>
                Trade History
              </Typography>
            </Grid>
            {/* FIXME: Change to the buttongroup component */}
            <Grid item md={12} xs={12}>
              <ButtonGroup>
                <Button>My coins</Button>
                <Button>History</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} style={{border: '1px solid white'}}>
              <Typography>[SEARCH COMPONENT]</Typography>
            </Grid>
            <Grid item md={7} xs={11}>
              <Typography variant='h5'>
                {(props.coins || [{}]).length} coins
              </Typography>
              <Typography variant='h6'>Highest Cap &darr;</Typography>
            </Grid>
            <Grid item md={1} xs={1}>
              <IconButton className={classes.filterBtn}>
                <FilterIcon fontSize='large' />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Buy Amount
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    Buy Amount
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    Buy Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(props.coins || [{}, {}]).map((affilate, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.tableCell}>
                      $ 120,00
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      $ 120,00
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      $ 120,00
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* FIXME: Change to the pagination component */}
        <Grid item xs={12} style={{border: '1px solid white'}}>
          [PAGINATION COMPONENT]
        </Grid>
      </Grid>
    </Container>
  );
}

export default AffiliatePage;
