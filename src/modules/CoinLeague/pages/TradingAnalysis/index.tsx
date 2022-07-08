import React, {useState} from 'react';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {
  Grid,
  Breadcrumbs,
  Link,
  IconButton,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import ChartTV from 'modules/CoinLeague/components/ChartTV';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {useWindowSize} from 'hooks/useWindowSize';
import {useMobile} from 'hooks/useMobile';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../redux/store';

export function TradingAnalysis() {
  const isMobile = useMobile();
  const [charts, setCharts] = useState(2);
  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();
  const {height, width} = useWindowSize();

  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  const widthComp = isMobile ? 0 : navCollapsed ? 150 : 450;
  const heightComp = isMobile ? 0 : 150;

  return (
    <Grid container spacing={4}>
      {!isMobile && (
        <Grid item xs={12}>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              Coin League
            </Link>
          </Breadcrumbs>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' alignContent='center'>
          <Box display='flex' alignItems='center' alignContent='center' mr={2}>
            <IconButton size='small' onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Typography variant='h5'>Trading Analysis</Typography>
          <Box p={2}>
            <FormControl>
              <Select
                variant='outlined'
                value={charts}
                onChange={(e) => setCharts(Number(e.target.value))}
                renderValue={(value) => <> {value}</>}>
                <MenuItem value={1}>{1} </MenuItem>
                <MenuItem value={2}>{2}</MenuItem>
                <MenuItem value={4}>{4}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Grid>
      {charts === 2 && width && height && (
        <>
          <Grid item xs={12} md={6}>
            <ChartTV
              height={`${height - heightComp}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartTV
              symbol={'COINBASE:ETHUSD'}
              height={`${height - heightComp}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
        </>
      )}
      {charts === 1 && width && height && (
        <>
          <Grid item xs={12} md={6}>
            <ChartTV
              height={`${height - heightComp}px`}
              width={`${width - widthComp}px`}
            />
          </Grid>
        </>
      )}
      {charts === 4 && width && height && (
        <>
          <Grid item xs={12} md={6}>
            <ChartTV
              height={`${(height - heightComp) / 2}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartTV
              symbol={'COINBASE:ETHUSD'}
              height={`${(height - heightComp) / 2}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartTV
              symbol={'BINANCE:BNBUSD'}
              height={`${(height - heightComp) / 2}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartTV
              symbol={'BINANCE:SOLUSD'}
              height={`${(height - heightComp) / 2}px`}
              width={`${(width - widthComp) / 2}px`}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default TradingAnalysis;
