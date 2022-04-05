import React, {useCallback, useState} from 'react';

import {
  Box,
  Link,
  TableRow,
  TableCell,
  Hidden,
  IconButton,
  Collapse,
  Grid,
  Typography,
  Chip,
  Avatar,
} from '@material-ui/core';

import humanizeDuration from 'humanize-duration';

import {Link as RouterLink, useHistory} from 'react-router-dom';

import IntlMessages from '@crema/utility/IntlMessages';

import {GameGraph} from '../utils/types';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {ethers} from 'ethers';
import moment from 'moment';
import NFTLeagueAvatar from './NFTLeagueAvatar';
import Countdown from 'shared/components/Countdown';
import TimerRoundedIcon from '@material-ui/icons/TimerRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';

import AlarmRoundedIcon from '@material-ui/icons/AlarmRounded';
import {AvatarGroup} from '@material-ui/lab';

interface Props {
  game: GameGraph;
}

export const NFTLeagueGamesTableRow: React.FC<Props> = ({game}) => {
  const [collapse, setCollapse] = useState(false);

  const handleToggle = useCallback(() => {
    setCollapse((value) => !value);
  }, []);

  const history = useHistory();

  return (
    <>
      <TableRow>
        <TableCell>
          <Link component={RouterLink} to={`/nft-league/${game.id}`}>
            {game.id}
          </Link>
        </TableCell>
        <TableCell>{ethers.utils.formatEther(game.entry)} MATIC</TableCell>
        <TableCell>
          <Chip
            label={
              game.status === 'Waiting' ? (
                <IntlMessages
                  id='nftLeague.waitingOpponent'
                  defaultMessage='Waiting Opponent'
                />
              ) : game.status === 'Ended' ? (
                <IntlMessages
                  id='nftLeague.gameEnded'
                  defaultMessage='Game Ended'
                />
              ) : game.status === 'Started' ? (
                <IntlMessages
                  id='nftLeague.inProgress'
                  defaultMessage='In Progress'
                />
              ) : undefined
            }
            size='small'
          />
        </TableCell>
        <Hidden smDown>
          <TableCell>
            {game.status === 'Ended' || game.status === 'Started' ? (
              <Chip
                variant='outlined'
                size='small'
                icon={<EventRoundedIcon />}
                label={moment
                  .unix(parseInt(game.startsAt))
                  .format('DD/MM/YYYY HH:mm:ss')}
              />
            ) : (
              <Chip
                size='small'
                variant='outlined'
                icon={<TimerRoundedIcon />}
                label={
                  <Countdown
                    startTimestamp={parseInt(game?.startedAt || '0')}
                  />
                }
              />
            )}
          </TableCell>
          <TableCell>
            {game?.status === 'Started' ? (
              <Chip
                size='small'
                variant='outlined'
                icon={<AlarmRoundedIcon />}
                label={
                  <Countdown
                    startTimestamp={parseInt(game?.startsAt || '0')}
                    duration={parseInt(game?.duration || '0')}
                  />
                }
              />
            ) : (
              <>{humanizeDuration(parseInt(game?.duration || '0') * 1000)}</>
            )}
          </TableCell>
        </Hidden>
        <TableCell>
          <AvatarGroup max={2}>
            {game.players?.map((player, index: number) => (
              <NFTLeagueAvatar player={player} key={index} />
            ))}
          </AvatarGroup>
        </TableCell>
        <Hidden smUp>
          <TableCell>
            <IconButton onClick={handleToggle}>
              {collapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </Hidden>
      </TableRow>
      <Hidden smUp>
        <TableRow>
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>
            <Collapse in={collapse}>
              <Box py={4}>
                <Grid container spacing={4}>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages id='nftLeague.startsAt' />
                    </Typography>
                    <Box>
                      {game.status === 'Ended' || game.status === 'Started' ? (
                        <Chip
                          variant='outlined'
                          size='small'
                          icon={<EventRoundedIcon />}
                          label={moment
                            .unix(parseInt(game.startsAt))
                            .format('DD/MM/YYYY HH:mm:ss')}
                        />
                      ) : (
                        <Chip
                          size='small'
                          variant='outlined'
                          icon={<TimerRoundedIcon />}
                          label={
                            <Countdown
                              startTimestamp={parseInt(game?.startedAt || '0')}
                            />
                          }
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages id='nftLeague.endsIn' />
                    </Typography>
                    <Box>
                      {game?.status === 'Started' ? (
                        <Chip
                          size='small'
                          variant='outlined'
                          icon={<AlarmRoundedIcon />}
                          label={
                            <Countdown
                              startTimestamp={parseInt(game?.startsAt || '0')}
                              duration={parseInt(game?.duration || '0')}
                            />
                          }
                        />
                      ) : (
                        <>
                          {humanizeDuration(
                            parseInt(game?.duration || '0') * 1000,
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Hidden>
    </>
  );
};

export default NFTLeagueGamesTableRow;
