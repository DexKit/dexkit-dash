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
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import IntlMessages from '@crema/utility/IntlMessages';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {ethers} from 'ethers';
import moment from 'moment';
import {GameGraph} from 'modules/SquidLeague/utils/types';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

interface Props {
  game: GameGraph;
}

export const GamesTableRow: React.FC<Props> = ({game}) => {
  const [collapse, setCollapse] = useState(false);

  const handleToggle = useCallback(() => {
    setCollapse((value) => !value);
  }, []);

  return (
    <>
      <TableRow>
        <TableCell>
          <Link component={RouterLink} to={`${SQUIDLEAGUE_ROUTE}/${game.id}`}>
            {game.id}
          </Link>
        </TableCell>
        <TableCell>{ethers.utils.formatEther(game.entry)} MATIC</TableCell>
        <Hidden smDown>
          <TableCell>
            {moment.unix(parseInt(game.startsAt)).format('DD/MM/YYYY hh:mm:ss')}
          </TableCell>
          <TableCell>
            {moment
              .unix(parseInt(game.startsAt))
              .add(game.duration, 'seconds')
              .format('DD/MM/YYYY hh:mm:ss')}
          </TableCell>
        </Hidden>
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
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
            <Collapse in={collapse}>
              <Box py={4}>
                <Grid container spacing={4}>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='squidLeague.startsAt'
                        defaultMessage={'Starts At'}
                      />
                    </Typography>
                    <Typography variant='body1'>
                      {moment
                        .unix(parseInt(game.startsAt))
                        .format('DD/MM/YYYY hh:mm:ss')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='caption' color='textSecondary'>
                      <IntlMessages
                        id='squidLeague.endsIn'
                        defaultMessage={'Ends At'}
                      />
                    </Typography>
                    <Typography variant='body1'>
                      {moment
                        .unix(parseInt(game.startsAt))
                        .add(game.duration, 'seconds')
                        .format('DD/MM/YYYY hh:mm:ss')}
                    </Typography>
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

export default GamesTableRow;
