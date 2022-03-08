import React, {useCallback, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  useTheme,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Badge from '@material-ui/core/Badge';

import {MyBalances} from 'types/blockchain';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import Close from '@material-ui/icons/Close';
import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import AssetList from '../components/AssetList';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';

interface AssetTableProps {
  balances: MyBalances[];
  loading?: boolean;
  hideBalance?: boolean;
  loadingUsd?: boolean;
  errorUsd?: boolean;
}

enum TokenOrderBy {
  Name,
  UsdAmount,
  TokenAmount,
}

const AssetTable: React.FC<AssetTableProps> = ({
  balances,
  loading,
  hideBalance,
  loadingUsd,
  errorUsd,
}) => {
  const [orderBy, setOrderBy] = useState(TokenOrderBy.UsdAmount);

  const [showFilters, setShowFilters] = useState(false);

  const [showZero, setShowZero] = useState(false);

  const [filter, setFilter] = useState('all');

  const [search, setSearch] = useState('');

  const {messages} = useIntl();

  const onSetShowZero = useCallback(() => {
    setShowZero(!showZero);
  }, [showZero]);

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const filteredBalances = useCallback(() => {
    let results = balances;

    if (filter === 'eth') {
      results = results.filter((b) => b.network === EthereumNetwork.ethereum);
    }
    if (filter === 'bnb') {
      results = results.filter((b) => b.network === EthereumNetwork.bsc);
    }

    if (filter === 'matic') {
      results = results.filter((b) => b.network === EthereumNetwork.matic);
    }

    if (search !== '') {
      results = results.filter(
        (b) =>
          b.currency?.name?.toLowerCase().startsWith(search.toLowerCase()) ||
          b.currency?.symbol?.toLowerCase().startsWith(search.toLowerCase()),
      );
    }

    // TODO: simplify this code
    if (orderBy === TokenOrderBy.Name) {
      results = results.sort((a: MyBalances, b: MyBalances): number => {
        return a.currency?.name?.localeCompare(b.currency?.name || '') || 0;
      });
    } else if (orderBy === TokenOrderBy.TokenAmount) {
      results = results.sort((a: MyBalances, b: MyBalances): number => {
        let firstValue = a.value || 0;
        let lastValue = b.value || 0;

        if (firstValue > lastValue) return -1;
        else if (firstValue < lastValue) return 1;

        return 0;
      });
    } else if (orderBy === TokenOrderBy.UsdAmount) {
      results = results.sort((a: MyBalances, b: MyBalances): number => {
        let firstValue = a.valueInUsd || 0;
        let lastValue = b.valueInUsd || 0;

        if (firstValue > lastValue) return -1;
        else if (firstValue < lastValue) return 1;

        return 0;
      });
    }
    if (!showZero && !loadingUsd && !errorUsd) {
      return results.filter((r) => r?.valueInUsd && r.valueInUsd > 0);
    }

    return results;
  }, [orderBy, filter, search, balances, showZero, loadingUsd, errorUsd]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((value) => !value);
  }, []);

  const handleOrderByChange = useCallback((e) => {
    setOrderBy(e.target.value);
  }, []);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showFiltersActive, setShowFiltersActive] = useState(false);

  useEffect(() => {
    if (filter !== 'all' || orderBy !== TokenOrderBy.UsdAmount) {
      setShowFiltersActive(true);
    } else {
      setShowFiltersActive(false);
    }
  }, [filter, orderBy]);

  return (
    <>
      <Drawer open={showFilters} anchor='right' onClose={handleToggleFilters}>
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Grid container justify='space-between' alignItems='center'>
                  <Grid item>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <FilterSearchIcon style={{}} />
                      </Grid>
                      <Grid item>
                        <Typography variant='body1'>Filter</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <IconButton size='small' onClick={handleToggleFilters}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom variant='body1'>
                <IntlMessages id='app.dashboard.network' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item>
                  <Chip
                    style={{marginRight: 10}}
                    label={messages['app.dashboard.all'] as string}
                    size='small'
                    clickable
                    variant={filter === 'all' ? 'default' : 'outlined'}
                    onClick={() => setFilter('all')}
                  />
                </Grid>

                <Grid item>
                  <Chip
                    style={{marginRight: 10}}
                    label='ETH'
                    clickable
                    size='small'
                    variant={filter === 'eth' ? 'default' : 'outlined'}
                    onClick={() => setFilter('eth')}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label='BSC'
                    clickable
                    size='small'
                    variant={filter === 'bnb' ? 'default' : 'outlined'}
                    onClick={() => setFilter('bnb')}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label='MATIC'
                    clickable
                    size='small'
                    variant={filter === 'matic' ? 'default' : 'outlined'}
                    onClick={() => setFilter('matic')}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
                value={search}
                onChange={handleChange}
                placeholder={messages['app.dashboard.search'] as string}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant='outlined' fullWidth>
                <InputLabel>
                  <IntlMessages id='app.dashboard.orderBy' />
                </InputLabel>
                <Select
                  style={{backgroundColor: 'transparent'}}
                  label={messages['app.dashboard.orderBy'] as string}
                  value={orderBy}
                  variant='outlined'
                  onChange={handleOrderByChange}
                  fullWidth>
                  <MenuItem value={TokenOrderBy.Name}>
                    <IntlMessages id='app.dashboard.name' />
                  </MenuItem>
                  <MenuItem value={TokenOrderBy.TokenAmount}>
                    <IntlMessages id='app.dashboard.tokenAmount' />
                  </MenuItem>
                  <MenuItem value={TokenOrderBy.UsdAmount}>
                    USD <IntlMessages id='app.dashboard.amount' />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justify='space-between'
            alignItems='baseline'>
            <Grid item xs={isMobile ? 12 : undefined}>
              <Typography variant='body1' style={{fontWeight: 600}}>
                {filteredBalances().length}{' '}
                <IntlMessages id='app.dashboard.assets' />
              </Typography>
            </Grid>

            <Grid item xs={isMobile ? 12 : undefined}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox value={showZero} onClick={onSetShowZero} />
                      }
                      label={
                        <IntlMessages id='app.dashboard.showZeroValueCoin' />
                      }
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs>
                  <TextField
                    value={search}
                    fullWidth
                    size='medium'
                    variant='outlined'
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    placeholder={messages['app.dashboard.search'] as string}
                  />
                </Grid>
                <Grid item>
                  <SquaredIconButton onClick={handleToggleFilters}>
                    <Badge
                      color='primary'
                      variant='dot'
                      invisible={!showFiltersActive}>
                      <FilterSearchIcon />
                    </Badge>
                  </SquaredIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
              <Grid item xs={12}>
                <TokenListItemSkeleton />
              </Grid>
            </Grid>
          ) : (
            <AssetList
              hideBalance={hideBalance}
              balances={filteredBalances()}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AssetTable;
