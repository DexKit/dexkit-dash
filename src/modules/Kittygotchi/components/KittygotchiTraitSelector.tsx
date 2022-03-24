import React, {useCallback} from 'react';

import {
  makeStyles,
  Box,
  Divider,
  Grid,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {KittygotchiTraitType} from '../constants/index';

import {KittygotchiTraitItem} from '../types/index';
import TraitSelectorItem from './TraitSelectorItem';

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
    [theme.breakpoints.down('sm')]: {
      overflowY: 'hidden',
      overflowX: 'scroll',
      flexWrap: 'nowrap',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    [theme.breakpoints.up('sm')]: {
      overflowX: 'scroll',
    },
  },
}));

interface Props {
  title: string;
  items: KittygotchiTraitItem[];
  onSelect: (item: KittygotchiTraitItem) => void;
  value?: string;
  kitHolding: number;
  traitType: KittygotchiTraitType;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export const KittygotchiTraitSelector = (props: Props) => {
  const {
    title,
    items,
    onSelect,
    value,
    kitHolding,
    traitType,
    defaultExpanded,
    disabled,
  } = props;

  const classes = useStyles();

  const handleSelect = useCallback(
    (item: KittygotchiTraitItem) => {
      onSelect(item);
    },
    [onSelect],
  );

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='body1'>{title}</Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Box className={classes.traitSelectorWrapper} p={4}>
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
                  traitType={traitType}
                  locked={kitHolding < item.holding}
                  selected={(value || '') === item.value}
                  onClick={handleSelect}
                  disabled={disabled}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </AccordionDetails>
      {/* <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h6'>{title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Box className={classes.traitSelectorWrapper} p={4}>
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
                      traitType={traitType}
                      locked={kitHolding < item.holding}
                      selected={(value || '') === item.value}
                      onClick={handleSelect}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid> */}
    </Accordion>
  );
};

export default KittygotchiTraitSelector;
