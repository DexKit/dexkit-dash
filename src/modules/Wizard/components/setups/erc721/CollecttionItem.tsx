import React, {useCallback} from 'react';

import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Divider,
  makeStyles,
} from '@material-ui/core';
import {CollectionAttribute, CollectionItemData} from 'modules/Wizard/types';
import ImageUploadButton from './ImageUploadButton';
import CollectionItemAttribute from './CollectionItemAttribute';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IntlMessages from '@crema/utility/IntlMessages';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
  invalid: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.error.main,
  },
}));

interface CollectionItemProps {
  item: CollectionItemData;

  onRemove: (item: CollectionItemData) => void;
  onChange: (item: CollectionItemData) => void;
  variant?: 'outlined' | 'elevation' | undefined;
}

export const CollectionItem = (props: CollectionItemProps) => {
  const {item, onRemove, onChange, variant} = props;

  const classes = useStyles();

  const handleRemove = useCallback(() => {
    onRemove(item);
  }, [onRemove, item]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({...item, [e.target.name]: e.target.value});
    },
    [onChange, item],
  );

  const handleImageChange = useCallback(
    (file: File | null) => {
      onChange({...item, image: file});
    },
    [onChange, item],
  );

  const handleAddAttribute = useCallback(() => {
    let newItem = {...item};

    newItem.attributes = [
      ...newItem.attributes,
      {
        value: '',
        trait_type: '',
      },
    ];

    onChange(newItem);
  }, [onChange, item]);

  const handleChangeAttribute = useCallback(
    (attr: CollectionAttribute, index: number) => {
      let newItem = {...item};

      newItem.attributes[index] = attr;

      onChange(newItem);
    },
    [onChange, item],
  );

  const isInvalid = useCallback(() => {
    let hasName = item.name !== '';
    let hasDescription = item.name !== '';
    let hasImage = item.image !== null;

    if (!hasName || !hasDescription || !hasImage) {
      return true;
    }

    return false;
  }, [item]);

  const { messages } = useIntl();

  return (
    <Card
      variant={variant ? variant : 'elevation'}
      className={isInvalid() ? classes.invalid : undefined}>
      <CardContent>
        <Grid container spacing={4} alignItems='center'>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'></Typography>
              <IconButton onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display='flex' justifyContent='center'>
              <ImageUploadButton
                error={item.image === null}
                onChange={handleImageChange}
                file={item.image}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  required
                  value={item.name}
                  name='name'
                  onChange={handleChange}
                  label={messages["app.wizard.name"]}
                  error={item.name === ''}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name='description'
                  value={item.description}
                  label={messages["app.wizard.description"]}
                  rows={3}
                  multiline
                  error={item.description === ''}
                  variant='outlined'
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          {item.attributes.length > 0 ? (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'><IntlMessages id='app.wizard.traits' /></Typography>
              </Grid>
              <Grid item xs={12}>
                {item.attributes.map(
                  (attr: CollectionAttribute, index: number) => (
                    <CollectionItemAttribute
                      key={index}
                      attribute={attr}
                      index={index}
                      onChange={handleChangeAttribute}
                    />
                  ),
                )}
              </Grid>
            </>
          ) : null}
          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={handleAddAttribute}
              startIcon={<AddIcon />}
              color='primary'>
              <IntlMessages id='app.wizard.newTrait' />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CollectionItem;
