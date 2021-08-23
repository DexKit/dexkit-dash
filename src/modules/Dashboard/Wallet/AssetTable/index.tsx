import React, {useState, useCallback} from 'react';
import CTable from './CTable';
import {
  Chip,
  Fade,
  makeStyles,
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  Drawer,
  IconButton,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import {CremaTheme} from 'types/AppContextPropsType';
import LoadingTable from 'modules/Common/LoadingTable';
import {MyBalances} from 'types/blockchain';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import Close from '@material-ui/icons/Close';
import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import SquaredIconButton from 'shared/components/SquaredIconButton';

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

const AssetTable: React.FC<AssetTableProps> = ({balances, loading}) => {
  const classes = useStyles();

  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState('all');

  const filteredBalances = () => {
    if (filter === 'eth') {
      return balances.filter((b) => b.network === EthereumNetwork.ethereum);
    }
    if (filter === 'bnb') {
      return balances.filter((b) => b.network === EthereumNetwork.bsc);
    }
    return balances;
  };

  const handleToggleFilters = useCallback(() => {
    setShowFilters((value) => !value);
  }, []);

  const [search, setSearch] = useState('');

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
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
          {loading ? (
            <LoadingTable columns={3} rows={3} />
          ) : (
            <CTable balances={filteredBalances()} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AssetTable;
