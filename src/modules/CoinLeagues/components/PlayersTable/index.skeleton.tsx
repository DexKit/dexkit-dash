import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
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

import {PriceFeeds} from 'modules/CoinLeagues/constants';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';

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

interface Props {
  players?: number;
}

const getIconByCoin = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const truncHash = (hash: string): string => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

function PlayersTableSkeleton(props: Props): JSX.Element {
  const classes = useStyles();

  const {players} = props;

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header}>
                <IntlMessages key='app.coinLeagues.position' />
              </TableCell>
              <TableCell className={classes.header}>
                <IntlMessages key='app.coinLeagues.coins' />
              </TableCell>
              <TableCell className={classes.header}>
                <IntlMessages key='app.coinLeagues.score' />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {new Array(players || 1)
              .fill(1)
              .map((_, i) => i + 1)
              .map((key) => (
                <TableRow key={key}>
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Chip className={classes.chip} label={`${key}º`} />
                      <Skeleton>
                        <Typography style={{color: '#fff'}}>
                          &nbsp; {truncHash('0x0000000000000000000000000000')}
                        </Typography>
                      </Skeleton>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <AvatarGroup max={10} spacing={17}>
                        {PriceFeeds[ChainId.Matic]
                          .slice(0, 5)
                          .map((coin, i) => (
                            <Skeleton key={i}>
                              <Avatar
                                className={classes.chip}
                                src={getIconByCoin(coin.address, ChainId.Matic)}
                                style={{height: 35, width: 35}}>
                                {getIconSymbol(coin.address, ChainId.Matic)}
                              </Avatar>
                            </Skeleton>
                          ))}
                      </AvatarGroup>
                      <Skeleton>
                        <IconButton>
                          <RemoveRedEye
                            style={{
                              color: '#fff',
                              marginLeft: 10,
                              alignSelf: 'center',
                            }}
                          />
                        </IconButton>
                      </Skeleton>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Skeleton>
                      <Chip
                        clickable
                        style={{
                          background: '#343A49',
                          color: '#0e0',
                        }}
                        label={'+10%'}
                      />
                    </Skeleton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PlayersTableSkeleton;
