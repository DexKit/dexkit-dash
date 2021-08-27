import React, {useState, useCallback} from 'react';

import {
  Chip,
  makeStyles,
  Box,
  Grid,
  Typography,
  Drawer,
  IconButton,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import {CremaTheme} from 'types/AppContextPropsType';

import {MyBalances} from 'types/blockchain';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import Close from '@material-ui/icons/Close';
import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import AssetList from '../components/AssetList';

interface AssetTableProps {
  balances: MyBalances[];
  loading?: boolean;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

enum TokenOrderBy {
  Name,
  UsdAmount,
  TokenAmount,
}

const AssetTable: React.FC<AssetTableProps> = ({balances, loading}) => {
  const classes = useStyles();

  const [orderBy, setOrderBy] = useState(TokenOrderBy.Name);

  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState('all');

  const [search, setSearch] = useState('');

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

        if (firstValue < lastValue) return -1;
        else if (firstValue > lastValue) return 1;

        return 0;
      });
    } else if (orderBy === TokenOrderBy.UsdAmount) {
      results = results.sort((a: MyBalances, b: MyBalances): number => {
        let firstValue = a.valueInUsd || 0;
        let lastValue = b.valueInUsd || 0;

        if (firstValue < lastValue) return -1;
        else if (firstValue > lastValue) return 1;

        return 0;
      });
    }

    return results;
  }, [orderBy, filter, search, balances]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((value) => !value);
  }, []);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            </Grid>

            <Divider />
            <Grid item xs={12}>
              <ContainedInput
                value={search}
                onChange={handleChange}
                placeholder='Search'
                startAdornment={
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant='body1'>
                Network
              </Typography>
              <Chip
                style={{marginRight: 10}}
                label='All'
                clickable
                color={filter === 'all' ? 'primary' : 'default'}
                onClick={() => setFilter('all')}
              />
              <Chip
                style={{marginRight: 10}}
                label='ETH'
                clickable
                color={filter === 'eth' ? 'primary' : 'default'}
                onClick={() => setFilter('eth')}
              />
              <Chip
                label='BSC'
                clickable
                color={filter === 'bnb' ? 'primary' : 'default'}
                onClick={() => setFilter('bnb')}
              />
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
                {filteredBalances().length} Assets
              </Typography>
            </Grid>
            <Grid item xs={isMobile ? 12 : undefined}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs>
                  <ContainedInput
                    value={search}
                    fullWidth
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position='start'>
                        <Search />
                      </InputAdornment>
                    }
                    placeholder='Search'
                  />
                </Grid>
                <Grid item>
                  <SquaredIconButton onClick={handleToggleFilters}>
                    <FilterSearchIcon />
                  </SquaredIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AssetList balances={filteredBalances()} />
        </Grid>
      </Grid>
    </>
  );
};

export default AssetTable;
