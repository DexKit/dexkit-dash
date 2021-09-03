import React from 'react';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import TableContainer from '@material-ui/core/TableContainer';

import {makeStyles} from '@material-ui/core/styles';

import RemoveRedEye from '@material-ui/icons/RemoveRedEyeOutlined';

import { CoinFeed } from 'types/coinsleague';
import { MumbaiPriceFeeds } from 'modules/CoinsLeague/constants';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: 6,
    border: 'none',
    width: '97%',
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  button: {
    borderRadius: 6,
    justifyContent: 'center',
    border: '1px solid #7A8398',
    padding: theme.spacing(1),
  },
  innerContent: {
    fontSize: '1rem',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
  chip: {
    border: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#ffa552',
    background: '#343A49',
  },
  header: {
    border: 'none',
    color: '#8F96A7',
  },
  noBorder: {
    border: 'none',
  },
}));

interface IRow {
  hash: string;
  coins: CoinFeed[];
  claimed: boolean;
  showClaim?: boolean;
  position: number;
}

interface Props {
  data?: IRow;
}

function OnePlayerTable(props: Props): JSX.Element {
  const classes = useStyles();

  const getIconByCoin = (coin: string) => {
    return MumbaiPriceFeeds.find((c)=> c.address.toLowerCase() === coin)?.logo || ''
  };

  const truncHash = (hash: string): string => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const row = props.data;

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableCell className={classes.header}>Position</TableCell>
          <TableCell className={classes.header}>Coins</TableCell>
          <TableCell className={classes.header}>Score</TableCell>
         {row?.showClaim && <TableCell className={classes.header}>Action</TableCell>}
        </TableHead>

        <TableBody>
          {!row && (
            <TableRow>
              <TableCell
                colSpan={4}
                className={classes.noBorder}
                style={{textAlign: 'center', color: '#ffa552'}}>
                <Typography variant='h5'>No data was found!</Typography>
              </TableCell>
            </TableRow>
          )}
         {row && (   <TableRow>
              <TableCell className={classes.noBorder}>
                <Typography style={{color: '#fff'}}>
                  <Chip className={classes.chip} label={`1º`} />
                  &nbsp; {truncHash(row?.hash)}
                </Typography>
              </TableCell>

              <TableCell className={classes.noBorder}>
                <Grid container>
                  <AvatarGroup max={10} spacing={17}>
                    {row?.coins.map((coin) => (
                      <Avatar
                        className={classes.chip}
                        style={{height: 35, width: 35}}>
                        {getIconByCoin(coin.address)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <RemoveRedEye
                    style={{
                      color: '#fff',
                      marginLeft: 10,
                      alignSelf: 'center',
                    }}
                  />
                </Grid>
              </TableCell>

              <TableCell className={classes.noBorder}>
                <Chip
                  clickable
                  style={{
                    background: '#343A49',
                    color: row?.position > 0 ? '#0e0' : '#e00',
                  }}
                  label={`${row?.position > 0 ? '+' : ''}${row?.position}%`}
                />
              </TableCell>
              {row?.showClaim &&  <TableCell className={classes.noBorder}>
                <Button
                  className={classes.button}
                  disabled={!row?.claimed}
                  style={{
                    width: '66.66%',
                    color: !row?.claimed ? '#646672' : '#000',
                    background: !row?.claimed ? '#3A3D4A' : '#ffa552',
                  }}>
                  {!row?.claimed ? 'REQUESTED' : 'CLAIM'}
                </Button>
              </TableCell>}
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OnePlayerTable;
