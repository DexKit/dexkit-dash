import React, {useCallback, useMemo, useState} from 'react';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
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

import {PriceFeeds} from 'modules/CoinsLeague/constants';
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
import {useCoinsLeague} from 'modules/CoinsLeague/hooks/useCoinsLeague';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {ethers} from 'ethers';

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
  score: number;
}

interface Props {
  data?: IRow[];
  address: string;
  winner?: any;
  account?: string;
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
  if (ethers.utils.isHexString(hash)) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  } else {
    return hash;
  }
};

const USD_POWER_NUMBER = 10 ** 8;

function PlayersTable(props: Props): JSX.Element {
  const {address, account, winner, data} = props;
  const classes = useStyles();
  const {chainId} = useWeb3();
  const [coins, setCoins] = useState([]);
  const accountLabels = useLabelAccounts();
  const {game, currentPrices, allFeeds} = useCoinsLeague(address);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback((ev: any) => {
    setOpenViewDialog(false);
  }, []);

  const onViewCoins = useCallback((c: any) => {
    setCoins(c);
    setOpenViewDialog(true);
  }, []);

  // We need to this to calculate the monster of score in real time
  const playerRowData = useMemo(() => {
    if (game && !game.finished && game.started && !game.aborted) {
      return props?.data?.map((d) => {
        const label = accountLabels
          ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
          : d.hash;

        const currentFeedPrice = currentPrices?.filter((f) =>
          d.coins.map((c) => c.toLowerCase()).includes(f.feed.toLowerCase()),
        );

        if (currentFeedPrice?.length) {
          const prices = currentFeedPrice.map((f) => {
            const startFeed = allFeeds?.find(
              (al) => al.address.toLowerCase() === f.feed.toLowerCase(),
            );
            return {
              endPrice: (f.price.toNumber() / USD_POWER_NUMBER) as number,
              startPrice: startFeed
                ? ((startFeed?.start_price.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0,
            };
          });

          const scores = prices
            .filter((p) => p.endPrice && p.startPrice)
            .map((p) => ((p.endPrice - p.startPrice) / p.endPrice) * 100);
          const score = scores.reduce((p, c) => p + c) / scores.length;
          return {
            ...d,
            account: d.hash,
            hash: label,
            score,
          };
        } else {
          return {
            ...d,
            account: d.hash,
            hash: label,
            score: d.score / 10,
          };
        }
      });
    }
    return props?.data?.map((d) => {
      const label = accountLabels
        ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
        : d.hash;
      return {
        ...d,
        account: d.hash,
        hash: label,
        score: d.score / 10,
      };
    });
  }, [props.data, game, currentPrices, allFeeds]);

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
            {playerRowData
              ?.sort((a, b) => b.score - a.score)
              .map((row, i) => (
                <TableRow
                  key={i}
                  selected={row.account.toLowerCase() === account?.toLowerCase()}>
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Chip className={classes.chip} label={`${i + 1}º`} />
                      <Typography style={{color: '#fff'}}>
                        &nbsp; {truncHash(row.hash)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <AvatarGroup max={10} spacing={17}>
                        {(chainId === ChainId.Matic ||
                          chainId === ChainId.Mumbai) &&
                          row?.coins.map((coin) => (
                            <Avatar
                              className={classes.chip}
                              src={getIconByCoin(coin, chainId)}
                              style={{height: 35, width: 35}}>
                              {getIconSymbol(coin, chainId)}
                            </Avatar>
                          ))}
                      </AvatarGroup>
                      <IconButton onClick={() => onViewCoins(row.coins)}>
                        <RemoveRedEye
                          style={{
                            color: '#fff',
                            marginLeft: 10,
                            alignSelf: 'center',
                          }}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>

                  <TableCell className={classes.noBorder}>
                    <Chip
                      clickable
                      style={{
                        background: '#343A49',
                        color: row.score > 0 ? '#0e0' : '#e00',
                      }}
                      label={`${row.score > 0 ? '+' : ''}${row.score?.toFixed(
                        2,
                      )}%`}
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
