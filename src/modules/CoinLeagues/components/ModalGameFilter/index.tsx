import React, {useState, useCallback, useEffect} from 'react';

import {
  Chip,
  Box,
  Grid,
  Typography,
  Drawer,
  IconButton,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge,
} from '@material-ui/core';

import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';

import Close from '@material-ui/icons/Close';
import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import { GameOrderBy } from 'modules/CoinLeagues/constants/enums';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props{
  showFilters: boolean;
  onSetOrderGame: any;
}

export const ModalGameFilter = (props: Props) => {
  const {onSetOrderGame} = props;
  const [showFilters, setShowFilters] = useState(false);
  const [orderBy, setOrderBy] = useState(GameOrderBy.HighLevel);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showFiltersActive, setShowFiltersActive] = useState(false);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((value) => !value);
  }, []);

  const handleOrderByChange = useCallback((e) => {
    setOrderBy(e.target.value);
    onSetOrderGame(e.target.value);
  }, []);

  return (
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
              Duration
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  style={{marginRight: 10}}
                  label='All'
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
            <Typography gutterBottom variant='body1'>
             Level
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  style={{marginRight: 10}}
                  label='All'
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
            <Typography gutterBottom variant='body1'>
            Type
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  style={{marginRight: 10}}
                  label='All'
                  size='small'
                  clickable
                  variant={filter === 'all' ? 'default' : 'outlined'}
                  onClick={() => setFilter('all')}
                />
              </Grid>

              <Grid item>
                <Chip
                  style={{marginRight: 10}}
                  label='Bear'
                  clickable
                  size='small'
                  variant={filter === 'bear' ? 'default' : 'outlined'}
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

         {/* <Grid item xs={12}>
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
            </Grid>*/}
          <Grid item xs={12}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel>Order by</InputLabel>
              <Select
                style={{backgroundColor: 'transparent'}}
                label='Order by'
                value={orderBy}
                variant='outlined'
                onChange={handleOrderByChange}
                fullWidth>
                <MenuItem value={GameOrderBy.HighLevel}>Higher Level</MenuItem>
                <MenuItem value={GameOrderBy.LowLevel}>Lower Level</MenuItem>
                <MenuItem value={GameOrderBy.HighDuration}>Higher Duration</MenuItem>
                <MenuItem value={GameOrderBy.LowerDuration}>Lower Duration</MenuItem>
                <MenuItem value={GameOrderBy.MostFull}>Most Full</MenuItem>
                <MenuItem value={GameOrderBy.MostEmpty}>Most Empty</MenuItem> 
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};
