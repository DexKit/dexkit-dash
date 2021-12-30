import {Grid, Button, Box, Paper} from '@material-ui/core';
import {CollectionItemData} from 'modules/Wizard/types';
import React, {useCallback} from 'react';
import CollectionItem from '../CollecttionItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IntlMessages from '@crema/utility/IntlMessages';

interface ItemsStepProps {
  values: any;
  items: CollectionItemData[];
  onChange: (item: CollectionItemData) => void;
  onRemove: (item: CollectionItemData) => void;
  onAddItem: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const ItemsStep = (props: ItemsStepProps) => {
  const {items, onChange, onRemove, onAddItem, onBack, onNext} = props;

  const hasInvalidItems = useCallback(() => {
    for (let item of items) {
      let hasName = item.name !== '';
      let hasDescription = item.name !== '';
      let hasImage = item.image !== null;

      if (!hasName || !hasDescription || !hasImage) {
        return true;
      }
    }

    return false;
  }, [items]);

  return (
    <Grid container spacing={4} justify='center'>
      <Grid item xs={12}>
        <Grid container spacing={4} alignItems='center' justify='center'>
          {items.map((item: CollectionItemData, index: number) => (
            <Grid item xs={10} key={index}>
              <CollectionItem
                item={item}
                onChange={onChange}
                onRemove={onRemove}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={10}>
            <Button
              fullWidth
              onClick={onAddItem}
              variant='outlined'
              color='primary'>
              <IntlMessages id='app.wizard.addItem' />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Paper>
          <Box p={4}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                variant='outlined'>
                <IntlMessages id='app.wizard.back' />
              </Button>

              <Button
                disabled={hasInvalidItems()}
                startIcon={<ArrowForwardIcon />}
                onClick={onNext}
                variant='contained'
                color='primary'>
                {items.length > 0 ? <IntlMessages id='app.wizard.next' /> : <IntlMessages id='app.wizard.skip' />}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ItemsStep;
