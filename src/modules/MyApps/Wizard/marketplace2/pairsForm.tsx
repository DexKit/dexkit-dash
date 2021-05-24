import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  TextField,
  IconButton,
  Divider,
  withStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Collection } from 'types/myApps';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { WizardProps } from '.';

const CustomGrid = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} !important;`,
    margin: theme.spacing(1, 0)
  }
}))(Grid);

interface CollectionComponentProps {
  index: number;
  data: Collection;
  onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    collection: Collection,
    index: number
  ) => void
}
const CollectionComponent: React.FC<CollectionComponentProps> = (props) => {
  const { index, data, onChange } = props;
  const [name, setName] = useState(data.name);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [slug, setSlug] = useState(data.slug);
  const [address, setAddress] = useState(data.address);
  const [description, setDescription] = useState(data.description);
  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).name`}
          id={`collection(${index}).name`}
          value={name}
          onChange={
            ($e) => {
              setName($e.target.value);
              onChange($e, { ...data, name: $e.target.value }, index);
            }
          }
          fullWidth label={`name`}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).imageUrl`}
          id={`collection(${index}).imageUrl`}
          type="url"
          value={imageUrl}
          onChange={
            ($e) => {
              data.imageUrl = $e.target.value;
              setImageUrl(data.imageUrl);
              onChange($e, data, index);
            }
          }
          fullWidth
          label="image"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).slug`}
          id={`collection(${index}).slug`}
          value={slug}
          onChange={
            ($e) => {
              data.slug = $e.target.value
              setSlug(data.slug);
              onChange($e, data, index);
            }
          }
          fullWidth
          label="slug"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).address`}
          id={`collection(${index}).address`}
          value={address}
          onChange={
            ($e) => {
              data.address = $e.target.value;
              setAddress(data.address);
              onChange($e, data, index);
            }
          }
          fullWidth
          label="address"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          key={`collection(${index}).description`}
          id={`collection(${index}).description`}
          value={description}
          onChange={
            ($e) => {
              data.description = $e.target.value;
              setDescription(data.description);
              onChange($e, data, index);
            }
          }
          fullWidth
          label="description"
          variant="outlined"
        />
      </Grid>
    </>
  )
}
interface CollectionsFormProps {
  title: string
  collections?: Collection[]
}

type Props = CollectionsFormProps & WizardProps;
const CollectionsForm: React.FC<Props> = (props) => {
  const { changeIssuerForm } = props;
  const [collections, setCollections] = useState(props.collections ?? []);
  useEffect(() => {
    if (collections == null || collections?.length === 0) {
      addCollection();
    }
  }, []);

  const onChange = useCallback(
    ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      collection: Collection,
      index: number
    ) => {
      if (index >= 0 && collections != null && index < collections.length) {
        collections[index] = collection;
        changeIssuerForm('collections', collections);
      }
    }, [collections, changeIssuerForm]);
  const addCollection = useCallback((index?: number) => {
    const newItem = {
      name: '',
      imageUrl: '',
      slug: '',
      description: '',
      address: ZERO_ADDRESS,
      assetCount: 0,
      id: ''
    };
    if (index != null && index > 0 && index < (collections?.length ?? 0)) {
      collections.splice(index, 0, newItem);
      setCollections([...collections]);
      return;
    }
    setCollections([...(collections ?? []), newItem]);
  }, [collections, setCollections]);

  useEffect(() => {
    changeIssuerForm('collections', { ...collections });
  }, [collections, changeIssuerForm])

  const remCollection = useCallback((index: number) => {
    if (index >= 0 && index < collections?.length) {
      collections.splice(index, 1);
      const _collections = [...collections];
      setCollections(_collections);
    }
  }, [collections, setCollections]);

  return (
    <GridContainer>

      {
        collections != null ? collections.map((collection: Collection, i: number) => (
          <>
            {
              i > 0 && (
                <CustomGrid item xs={12} md={12} sm={12}>
                  <Divider></Divider>
                </CustomGrid>
              )
            }
            <Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
              <IconButton aria-label="add" onClick={() => addCollection(i)}>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
              {
                i > 0 && (
                  <IconButton aria-label="delete">
                    <DeleteOutlinedIcon onClick={() => remCollection(i)} fontSize="small" />
                  </IconButton>
                )
              }
            </Grid>
            <CollectionComponent
              key={Math.round(Math.random() * 1000 + i)}
              index={i}
              data={collection}
              onChange={onChange}
            />
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default CollectionsForm;