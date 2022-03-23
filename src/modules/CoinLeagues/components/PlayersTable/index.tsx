import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

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
import Tooltip from '@material-ui/core/Tooltip';

import {makeStyles} from '@material-ui/core/styles';

import RemoveRedEye from '@material-ui/icons/RemoveRedEyeOutlined';

import {PriceFeeds} from 'modules/CoinLeagues/constants';
import ViewCoinLeagueDialog from '../ViewCoinsModal/index.modal';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import IconButton from '@material-ui/core/IconButton';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {ReactComponent as CupIcon} from 'assets/images/icons/cup-white.svg';
import {GameType} from 'types/coinsleague';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import Badge from '@material-ui/core/Badge';
import {useMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
import UserProfileItem from '../UserProfileItem';
import {GameProfile} from 'modules/CoinLeagues/utils/types';
import {
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@material-ui/core';
import {useMobile} from 'hooks/useMobile';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import PlayerCoinsTable from '../v2/PlayerCoinsTable';

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
  type?: GameType;
  id: string;
  winner?: any;
  account?: string;
  finished?: boolean;
  hideCoins?: boolean;
  userProfiles?: GameProfile[];
}

const getIconByCoin = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic | ChainId.Binance,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.logo || ''
  );
};

const getIconSymbol = (
  coin: string,
  chainId: ChainId.Mumbai | ChainId.Matic | ChainId.Binance,
) => {
  return (
    PriceFeeds[chainId].find(
      (c) => c.address.toLowerCase() === coin?.toLowerCase(),
    )?.base || ''
  );
};

const USD_POWER_NUMBER = 10 ** 8;

function PlayersTable(props: Props): JSX.Element {
  const {id, account, finished, hideCoins, type, data, userProfiles} = props;
  const classes = useStyles();
  const theme = useTheme();
  const {messages} = useIntl();
  const {chainId} = useWeb3();

  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({});

  const accountLabels = useLabelAccounts();
  const {game, currentPrices, allFeeds} = useCoinLeagues(id);

  const isMobile = useMobile();

  const {multiplier, loadingMultiplier, tooltipMessage} = useMultipliers(id);

  // We need to this to calculate the monster of score in real time
  const playerRowData = useMemo(() => {
    if (game && !game.finished && game.started && !game.aborted) {
      return data?.map((d) => {
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
            let multiplier = 1;

            if (
              d.captainCoin &&
              d.captainCoin.toLowerCase() === f.feed.toLowerCase()
            ) {
              const end = f.price.toNumber() / USD_POWER_NUMBER;
              const start = startFeed
                ? ((startFeed?.start_price.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0;
              if (end && start) {
                const scr = (end - start) / end;
                if (scr > 0 && type === GameType.Winner) {
                  multiplier = 1.2;
                }
                if (scr < 0 && type === GameType.Loser) {
                  multiplier = 1.2;
                }
              }
            }

            return {
              endPrice: (f.price?.toNumber() / USD_POWER_NUMBER) as number,
              startPrice: startFeed
                ? ((startFeed?.start_price?.toNumber() /
                    USD_POWER_NUMBER) as number)
                : 0,
              multiplier,
            };
          });

          const scores = prices
            .filter((p) => p.endPrice && p.startPrice)
            .map(
              (p) =>
                ((p.endPrice - p.startPrice) / p.endPrice) * 100 * p.multiplier,
            );
          const score = scores.length > 0 ? scores.reduce((p, c) => p + c) : 0;
          const profile = (userProfiles || []).find(
            (p) => p.address.toLowerCase() === d.hash.toLowerCase(),
          );
          return {
            ...d,
            account: d.hash,
            hash: label,
            score,
            profile,
          };
        } else {
          const profile = (userProfiles || []).find(
            (p) => p.address.toLowerCase() === d.hash.toLowerCase(),
          );
          return {
            ...d,
            account: d.hash,
            hash: label,
            score: d.score / 1000,
            profile,
          };
        }
      });
    }
    return data?.map((d) => {
      let label;
      const bitboyMember = GET_BITBOY_NAME(d.hash);
      if (bitboyMember) {
        label = bitboyMember.label;
      } else {
        label = accountLabels
          ? accountLabels.find((a) => a.address === d.hash)?.label || d.hash
          : d.hash;
      }
      const profile = (userProfiles || []).find(
        (p) => p.address.toLowerCase() === d.hash.toLowerCase(),
      );
      return {
        ...d,
        account: d.hash,
        hash: label,
        score: d.score / 1000,
        profile,
      };
    });
  }, [game, currentPrices, allFeeds, data, type, accountLabels, userProfiles]);

  const {isBalanceVisible} = useIsBalanceVisible();

  return (
    <>
      <Grid container spacing={4}>
        {!props.data?.length && (
          <Grid item xs={12}>
            <Typography variant='h5'>
              <IntlMessages id='app.coinLeagues.notDataFound' />!
            </Typography>
          </Grid>
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
            <Grid key={i} item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent='space-between'
                    alignItems='center'
                    alignContent='center'>
                    <Grid item>
                      <Grid
                        container
                        spacing={2}
                        alignItems='center'
                        alignContent='center'>
                        <Grid item>
                          <Chip
                            size='small'
                            variant='outlined'
                            label={
                              <Typography variant='inherit' color='primary'>
                                {i + 1}°
                              </Typography>
                            }
                          />
                        </Grid>
                        <Grid item>
                          {isBalanceVisible ? (
                            <UserProfileItem
                              address={row.hash}
                              profile={row.profile}
                            />
                          ) : (
                            <Typography variant='subtitle1'>******</Typography>
                          )}
                        </Grid>

                        {finished &&
                          (playerRowData.length === 2 ||
                            playerRowData.length === 3) &&
                          i === 0 && (
                            <Grid item>
                              <Chip
                                color='primary'
                                icon={<CupIcon />}
                                label={
                                  messages['app.coinLeagues.winner'] as string
                                }
                                size='small'
                              />
                            </Grid>
                          )}

                        {finished && playerRowData.length > 3 && i === 0 && (
                          <Grid item>
                            <Chip
                              color='primary'
                              icon={<CupIcon />}
                              label={
                                messages['app.coinLeagues.winner'] as string
                              }
                              size='medium'
                            />
                          </Grid>
                        )}

                        {finished && playerRowData.length > 3 && i === 1 && (
                          <Grid item>
                            <Chip
                              color='primary'
                              icon={<CupIcon />}
                              label={
                                messages['app.coinLeagues.winner'] as string
                              }
                              size='small'
                            />
                          </Grid>
                        )}

                        {finished && playerRowData.length > 3 && i === 2 && (
                          <Grid item>
                            <Chip
                              color='primary'
                              icon={<CupIcon />}
                              label={
                                messages['app.coinLeagues.winner'] as string
                              }
                              size='small'
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    {!hideCoins && (
                      <Grid item>
                        <IconButton
                          size='small'
                          onClick={() =>
                            setExpanded((value) => ({
                              ...value,
                              [i]: !value[i],
                            }))
                          }>
                          {expanded[i] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                {!expanded[i] && (
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item>
                        {!hideCoins ? (
                          row?.captainCoin && (
                            <Tooltip title={tooltipMessage(row.hash)}>
                              <Badge
                                color='primary'
                                overlap='circular'
                                badgeContent={
                                  !loadingMultiplier &&
                                  multiplier(row.hash).toFixed(3)
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
                            </Tooltip>
                          )
                        ) : (
                          <>
                            <Avatar
                              className={classes.chip}
                              style={{height: 35, width: 35}}
                            />
                          </>
                        )}
                      </Grid>
                      <Grid item xs>
                        {row?.coins.length > 0 &&
                          (!isMobile ? (
                            <Grid container spacing={2}>
                              {row?.coins.map((coin, index) => (
                                <Grid item key={index}>
                                  {!hideCoins ? (
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
                                  )}
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <AvatarGroup max={10} spacing={17}>
                              {row?.coins.map((coin, index) =>
                                !hideCoins ? (
                                  <Avatar
                                    key={index}
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
                                    key={index}
                                    className={classes.chip}
                                    style={{height: 35, width: 35}}
                                  />
                                ),
                              )}
                            </AvatarGroup>
                          ))}
                      </Grid>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          style={{
                            color:
                              row.score > 0
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                          }}
                          label={
                            isBalanceVisible
                              ? `${
                                  row.score > 0 ? '+' : ''
                                }${row.score?.toFixed(3)}%`
                              : '*.**%'
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  style={{display: expanded[i] ? 'block' : 'none'}}>
                  <Collapse in>
                    <PlayerCoinsTable
                      id={id}
                      playerAddress={row.hash}
                      coins={row.coins}
                      captainCoin={row.captainCoin}
                    />
                  </Collapse>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default PlayersTable;
