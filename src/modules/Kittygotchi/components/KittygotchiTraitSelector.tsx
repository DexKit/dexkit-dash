import React, {useEffect, useState, useCallback} from 'react';
import clsx from 'clsx';

import {
  makeStyles,
  Box,
  Grid,
  IconButton,
  Typography,
  Paper,
} from '@material-ui/core';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TraitSelectorItem from './TraitSelectorItem';

import {KittygotchiTraitItem} from '../constants/index';

const useStyles = makeStyles((theme) => ({
  kittygotchiBackground: {},
  kittyListItem: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: theme.spacing(18),
    height: theme.spacing(18),
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[600],
    '&:hover': {
      backgroundColor: theme.palette.grey[500],
    },
  },
  kittyListItemActive: {
    backgroundColor: theme.palette.grey[500],
    borderColor: theme.palette.common.white,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  traitSelectorWrapper: {
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

interface Props {
  title: string;
  items: KittygotchiTraitItem[];
  onSelect: (item: KittygotchiTraitItem) => void;
  selecteds: KittygotchiTraitItem[];
  kitHolding: number;
}

function isItemSelected(
  items: KittygotchiTraitItem[],
  item: KittygotchiTraitItem,
) {
  return false;
}

export const KittygotchiTraitSelector = (props: Props) => {
  const {title, items, onSelect, selecteds, kitHolding} = props;

  const classes = useStyles();

  const handleSelect = useCallback(
    (item: KittygotchiTraitItem) => {
      onSelect(item);
    },
    [onSelect],
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper>
          <Box
            p={2}
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'>
            <IconButton>
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant='body1'>{title}</Typography>
            <IconButton>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.traitSelectorWrapper} px={4}>
          <Grid
            container
            spacing={4}
            alignItems='center'
            alignContent='center'
            wrap='nowrap'>
            {items.map((item: KittygotchiTraitItem, index: number) => (
              <Grid item key={index}>
                <TraitSelectorItem
                  item={item}
                  locked={item.holding > kitHolding}
                  selected={isItemSelected(selecteds, item)}
                  onClick={handleSelect}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default KittygotchiTraitSelector;
