import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import LinearProgress from '@material-ui/core/LinearProgress';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {makeStyles} from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import FilterIcon from '@material-ui/icons/FilterList';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import LinkIcon from '@material-ui/icons/CallMadeOutlined';

import AffiliateTotalCard from '../components/AffiliateTotalCard';
import {toCurrency} from '../../../utils/currency';

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
    border: '1px solid #fff',
    borderRadius: 5,
  },
  table: {
    backgroundColor: 'white',
  },
  filterBtn: {},
  settingsBtn: {},
}));

function LinearProgressWithLabel(props: {to: number; from: number}) {
  const {to, from} = props;

  return (
    <Box display='flex' alignItems='center'>
      <Typography variant='body2' color='textSecondary'>
        {toCurrency(from)}
      </Typography>
      <Box width='100%' mr={1}>
        <LinearProgress variant='determinate' value={from} />
      </Box>
      <Box minWidth={35}>
        <Typography variant='body2' color='textSecondary'>
          {toCurrency(to)}
        </Typography>
      </Box>
    </Box>
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
      <Grid container xs={12} xl={8} sm={8}>
        <Grid container>
          <Breadcrumbs
            style={{color: '#fff', fontSize: '0.8rem'}}
            separator={<NavigateNextIcon fontSize='small' />}>
            <Link color='inherit' href=''>
              <Typography variant='subtitle2'>Dashboard</Typography>
            </Link>
            <Typography variant='subtitle2' style={{color: '#2e3243'}}>
              Página de Afiliados
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid container xs={12} xl={10} sm={10} alignContent='center'>
          <Typography variant='h5' style={{margin: 5, fontWeight: 600}}>
            Página de afiliados
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{marginBottom: 20}}>
        <Grid item md={7} xs={12}>
          <AffiliateTotalCard total={props.total || 2000} />
        </Grid>
        <Grid item md={5} xs={12}>
          <Grid container>
            <Grid item xs={10}>
              <Typography style={{color: '#B3B7C0'}}>
                Account Receive Rewards:
              </Typography>
              <Typography>
                {props.address || '0x0000000000000000000000000000000'}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button className={classes.settingsBtn}>
                <SettingsIcon fontSize='large' style={{color: '#fff'}} />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.affiliateCard}>
        <Grid item md={12}>
          <Grid container>
            <Grid item md={12}>
              <Typography variant='h5'>Affiliate</Typography>
            </Grid>
            <Grid item md={12}>
              <Typography variant='subtitle1' style={{color: '#B3B7C0'}}>
                You need to have 200 KIT in your wallet to earn money from
                referrals.
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography>
                <LinearProgressWithLabel to={25} from={100} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider
          style={{
            background: '#525C75',
            width: '90%',
            padding: 0.2,
            margin: '0 auto',
          }}
        />

        <Grid item md={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={5} xs={12}>
              <Typography>Chain</Typography>
              <Select fullWidth>
                {(props.chains || ['[SELECT CHAIN]']).map((chain) => (
                  <MenuItem>{chain}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography>Affiliate link</Typography>
              <Box className={classes.field}>
                <Typography>{props.affiliateLink || 'Link'}</Typography>
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
          width: '90%',
          padding: 0.2,
          margin: '20px auto',
        }}
      />

      <Grid container spacing={2} style={{marginTop: 15}}>
        <Grid item md={12} xs={12}>
          <Typography>Trade History</Typography>
        </Grid>
        <Grid item md={12}>
          <ButtonGroup>
            <Button>My coins</Button>
            <Button>History</Button>
          </ButtonGroup>
        </Grid>

        <Grid item md={7} xs={12}>
          <Typography>{(props.coins || [{}]).length} coins</Typography>
          <Typography>Highest Cap</Typography>
        </Grid>
        <Grid item md={4} xs={10}>
          <Typography>[SEARCH COMPONENT]</Typography>
        </Grid>
        <Grid item md={1} xs={2}>
          <Button className={classes.filterBtn}>
            <FilterIcon />
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Buy Amount</TableCell>
                <TableCell>Buy Amount</TableCell>
                <TableCell>Buy Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(props.coins || [{}]).map((affilate) => (
                <TableRow>
                  <TableCell>$ 120,00</TableCell>
                  <TableCell>$ 120,00</TableCell>
                  <TableCell>$ 120,00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}

export default AffiliatePage;
