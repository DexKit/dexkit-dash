import React from 'react';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import TableContainer from '@material-ui/core/TableContainer';

import {makeStyles} from '@material-ui/core/styles';

import RemoveRedEye from '@material-ui/icons/RemoveRedEyeOutlined';

// TODO: Fix the icons import
import BcdIcon from '../../../../assets/images/icons/send-square.svg';
import RedCoinIcon from '../../../../assets/images/icons/export.svg';

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
  coins: {name: string; icon: string}[];
  position: number;
}

interface Props {
  data?: IRow[];
}

function PlayersTable(props: Props): JSX.Element {
  const classes = useStyles();

  const getIconByCoin = (coin: string) => {
    switch (coin) {
      case 'BCD':
        return <BcdIcon />;
      case 'RDC':
        return <RedCoinIcon />;
      case 'BTC':
      case 'DOG':
      case 'KIT':
      case 'ADA':
      default:
        return coin;
    }
  };

  const truncHash = (hash: string): string => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableCell className={classes.header}>Position</TableCell>
          <TableCell className={classes.header}>Coins</TableCell>
          <TableCell className={classes.header}>Position</TableCell>
        </TableHead>

        <TableBody>
          {!props.data?.length && (
            <TableRow>
              <TableCell
                colSpan={4}
                className={classes.noBorder}
                style={{textAlign: 'center', color: '#ffa552'}}>
                <Typography variant='h5'>No data was found!</Typography>
              </TableCell>
            </TableRow>
          )}
          {props.data?.map((row, i) => (
            <TableRow>
              <TableCell className={classes.noBorder}>
                <Typography style={{color: '#fff'}}>
                  <Chip className={classes.chip} label={`${i + 1}º`} />
                  &nbsp; {truncHash(row.hash)}
                </Typography>
              </TableCell>

              <TableCell className={classes.noBorder}>
                <Grid container>
                  <AvatarGroup max={10} spacing={17}>
                    {row.coins.map((coin) => (
                      <Avatar
                        className={classes.chip}
                        style={{height: 35, width: 35}}>
                        {getIconByCoin(coin.name)}
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
                    color: row.position > 0 ? '#0e0' : '#e00',
                  }}
                  label={`${row.position > 0 ? '+' : ''}${row.position}%`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayersTable;
