import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
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
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {ethers} from 'ethers';
import {ReactComponent as CupIcon} from 'assets/images/icons/cup-white.svg';
import {GameType} from 'types/coinsleague';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import Badge from '@material-ui/core/Badge';
import {useMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';

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
  captainCoin?: string;
  score: number;
}

interface Props {
  data?: IRow[];
  address: string;
  winner?: any;
  account?: string;
  finished?: boolean;
  hideCoins?: boolean;
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
  const {address, account, finished, hideCoins} = props;
  const classes = useStyles();
  const {messages} = useIntl();
  const {chainId} = useWeb3();
  const [coins, setCoins] = useState([]);
  const [selectedCaptainCoin, setSelectedCaptainCoin] = useState();
  const [selectedPlayerAddress, setSelectedPlayerAddress] = useState<string>();
  const accountLabels = useLabelAccounts();
  const {game, currentPrices, allFeeds} = useCoinLeagues(address);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const onCloseViewCoinsDialog = useCallback((ev: any) => {
    setOpenViewDialog(false);
  }, []);
  const {multiplier, loadingMultiplier} = useMultipliers(address);
  const onViewCoins = useCallback((c: any, cap: any, addr: string) => {
    setCoins(c);
    setSelectedCaptainCoin(cap);
    setSelectedPlayerAddress(addr);
    setOpenViewDialog(true);
  }, []);

  // We need to this to calculate the monster of score in real time
  const playerRowData = useMemo(() => {
    if (game && !game.finished && game.started && !game.aborted) {
      return props?.data?.map((d) => {
        let label;
        const bitboyMember = GET_BITBOY_NAME(d.hash);
        if (bitboyMember) {
          label = bitboyMember.label;
        } else {
          label = accountLabels
            ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
            : d.hash;
        }

        const currentFeedPrice = currentPrices?.filter((f) =>
          d.coins
            .concat(d.captainCoin ? d.captainCoin : [])
            .map((c) => c.toLowerCase())
            .includes(f.feed.toLowerCase()),
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
              multiplier: 1,
            };
          });

          const scores = prices
            .filter((p) => p.endPrice && p.startPrice)
            .map(
              (p) =>
                ((p.endPrice - p.startPrice) / p.endPrice) * 100 * p.multiplier,
            );
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
            score: d.score / 1000,
          };
        }
      });
    }
    return props?.data?.map((d) => {
      let label;
      const bitboyMember = GET_BITBOY_NAME(d.hash);
      if (bitboyMember) {
        label = bitboyMember.label;
      } else {
        label = accountLabels
          ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
          : d.hash;
      }
      return {
        ...d,
        account: d.hash,
        hash: label,
        score: d.score / 1000,
      };
    });
  }, [props.data, game, currentPrices, allFeeds]);

  const {isBalanceVisible} = useIsBalanceVisible();

  return (
    <>
      <ViewCoinLeagueDialog
        open={openViewDialog}
        onClose={onCloseViewCoinsDialog}
        coins={coins}
        captainCoin={selectedCaptainCoin}
        address={address}
        playerAddress={selectedPlayerAddress}
      />
      <TableContainer className={classes.container} component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header}>
                {messages['app.position']}
              </TableCell>
              <TableCell className={classes.header}>
                {messages['app.captain']}
              </TableCell>
              {(game?.num_coins.toNumber() || 0) > 1 && (
                <TableCell className={classes.header}>
                  {messages['app.coins']}
                </TableCell>
              )}
              <TableCell className={classes.header}>
                {messages['app.score']}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!props.data?.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className={classes.noBorder}
                  style={{textAlign: 'center', color: '#ffa552'}}>
                  <Typography variant='h5'>
                    {messages['app.notDataFound']}!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {playerRowData
              ?.sort((a, b) => {
                if (game?.game_type === GameType.Winner) {
                  return b.score - a.score;
                } else {
                  return a.score - b.score;
                }
              })
              .map((row, i) => (
                <TableRow
                  key={i}
                  selected={
                    row.account.toLowerCase() === account?.toLowerCase() &&
                    isBalanceVisible
                  }>
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Chip className={classes.chip} label={`${i + 1}º`} />
                      <Typography style={{color: '#fff'}}>
                        &nbsp; {truncHash(row.hash)}
                      </Typography>

                      {finished &&
                        (playerRowData.length === 2 ||
                          playerRowData.length === 3) &&
                        i === 0 && (
                          <Box ml={2}>
                            {' '}
                            <Chip
                              color='primary'
                              icon={<CupIcon />}
                              label={messages['app.winner'] as string}
                              size='small'
                            />{' '}
                          </Box>
                        )}

                      {finished && playerRowData.length > 3 && i === 0 && (
                        <Box ml={2}>
                          {' '}
                          <Chip
                            color='primary'
                            icon={<CupIcon />}
                            label={messages['app.winner'] as string}
                            size='medium'
                          />{' '}
                        </Box>
                      )}

                      {finished && playerRowData.length > 3 && i === 1 && (
                        <Box ml={2}>
                          {' '}
                          <Chip
                            color='primary'
                            icon={<CupIcon />}
                            label={messages['app.winner'] as string}
                            size='small'
                          />{' '}
                        </Box>
                      )}

                      {finished && playerRowData.length > 3 && i === 2 && (
                        <Box ml={2}>
                          {' '}
                          <Chip
                            color='primary'
                            icon={<CupIcon />}
                            label={messages['app.winner'] as string}
                            size='small'
                          />{' '}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell className={classes.noBorder}>
                    <Box display={'flex'} alignItems={'center'}>
                      {!hideCoins ? (
                        row?.captainCoin && (
                          <>
                            <Badge
                              color={'primary'}
                              overlap='circular'
                              badgeContent={
                                !loadingMultiplier && multiplier(row.hash)
                              }>
                              <Avatar
                                className={classes.chip}
                                src={getIconByCoin(
                                  row.captainCoin,
                                  GET_LEAGUES_CHAIN_ID(chainId),
                                )}
                                style={{height: 35, width: 35}}>
                                {getIconSymbol(
                                  row.captainCoin,
                                  GET_LEAGUES_CHAIN_ID(chainId),
                                )}
                              </Avatar>
                            </Badge>
                            {row?.coins.length === 0 && (
                              <IconButton
                                onClick={() =>
                                  onViewCoins(
                                    row.coins,
                                    row.captainCoin,
                                    row.hash as string,
                                  )
                                }>
                                <RemoveRedEye
                                  style={{
                                    color: '#fff',
                                    marginLeft: 10,
                                    alignSelf: 'center',
                                  }}
                                />
                              </IconButton>
                            )}
                          </>
                        )
                      ) : (
                        <Badge color={'primary'} overlap='circular'>
                          <Avatar
                            className={classes.chip}
                            style={{height: 35, width: 35}}
                          />
                        </Badge>
                      )}
                    </Box>
                  </TableCell>

                  {row?.coins.length > 0 && (
                    <TableCell className={classes.noBorder}>
                      <Box display={'flex'} alignItems={'center'}>
                        <AvatarGroup max={10} spacing={17}>
                          {row?.coins.map((coin) =>
                            !hideCoins ? (
                              <Avatar
                                className={classes.chip}
                                src={getIconByCoin(
                                  coin,
                                  GET_LEAGUES_CHAIN_ID(chainId),
                                )}
                                style={{height: 35, width: 35}}>
                                {getIconSymbol(
                                  coin,
                                  GET_LEAGUES_CHAIN_ID(chainId),
                                )}
                              </Avatar>
                            ) : (
                              <Avatar
                                className={classes.chip}
                                style={{height: 35, width: 35}}
                              />
                            ),
                          )}
                        </AvatarGroup>
                        {!hideCoins && (
                          <IconButton
                            onClick={() =>
                              onViewCoins(
                                row.coins,
                                row.captainCoin,
                                row.hash as string,
                              )
                            }>
                            <RemoveRedEye
                              style={{
                                color: '#fff',
                                marginLeft: 10,
                                alignSelf: 'center',
                              }}
                            />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}

                  <TableCell className={classes.noBorder}>
                    <Chip
                      clickable
                      style={{
                        background: '#343A49',
                        color: row.score > 0 ? '#0e0' : '#e00',
                      }}
                      label={`${row.score > 0 ? '+' : ''}${row.score?.toFixed(
                        3,
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
