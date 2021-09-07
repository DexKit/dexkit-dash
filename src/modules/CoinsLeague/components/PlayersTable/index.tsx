import React, { useCallback, useState } from 'react';

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
import {ReactComponent as BcdIcon} from 'assets/images/icons/send-square.svg';
import {ReactComponent as RedCoinIcon} from 'assets/images/icons/export.svg';
import {MumbaiPriceFeeds} from 'modules/CoinsLeague/constants';
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
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
  coins: string[];
  claimed: boolean;
  showClaim?: boolean;
  score: number;
}

interface Props {
  data?: IRow[];
  address: string;
}

const getIconByCoin = (coin: string) => {
  return (
    MumbaiPriceFeeds.find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (coin: string) => {
  return (
    MumbaiPriceFeeds.find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const truncHash = (hash: string): string => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

function PlayersTable(props: Props): JSX.Element {
  const {address} = props;
  const classes = useStyles();
  const [coins, setCoins] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback((ev: any) => {
    setOpenViewDialog(false);
  }, []);

  const onViewCoins = useCallback((c: any) => {
    console.log(c);
    setCoins(c)
    setOpenViewDialog(true);
  }, []);

  return (
    <>
      <ViewCoinLeagueDialog
        open={openViewDialog}
        onClose={onCloseViewCoinsDialog}
        coins={coins}
        address={address}
      />
      <TableContainer className={classes.container} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableCell className={classes.header}>Position</TableCell>
            <TableCell className={classes.header}>Coins</TableCell>
            <TableCell className={classes.header}>Score</TableCell>
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
            {props.data
              ?.sort((a, b) => b.score - a.score)
              .map((row, i) => (
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
                        {row?.coins.map((coin) => (
                          <Avatar
                            className={classes.chip}
                            src={getIconByCoin(coin)}
                            style={{height: 35, width: 35}}>
                            {getIconSymbol(coin)}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <RemoveRedEye
                        style={{
                          color: '#fff',
                          marginLeft: 10,
                          alignSelf: 'center',
                        }}
                        onClick={() => onViewCoins(row.coins)}
                      />
                    </Grid>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Chip
                      clickable
                      style={{
                        background: '#343A49',
                        color: row.score > 0 ? '#0e0' : '#e00',
                      }}
                      label={`${row.score > 0 ? '+' : ''}${row.score}%`}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PlayersTable;
