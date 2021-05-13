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
import { Collection } from '@types';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { WizardProps } from './';
import { isAddress } from '@ethersproject/address';
import { getCollectionInfo } from 'services/rest/opensea';
import MessageView from '@crema/core/MessageView';
import { urlValidator } from 'utils/text';

const CustomGrid = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} !important;`,
    margin: theme.spacing(1, 0)
  }
}))(Grid);
interface error {
  [key: string]: string | undefined;
}

interface CollectionComponentProps {
  index: number;
  data: Collection;
  onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    collection: Collection,
    index: number
  ) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

const nameValidator = (name: string) => {
  return name != null && name?.replace(' ', '')?.length >= 3;
}
const addressValidator = (address: string ) => {
  return address != null && isAddress(address?.replace(' ', ''));
}

const _urlValidator = (url: string) => {
  return url == null || (url != null && url?.replace(' ', '')?.length > 0 && urlValidator(url?.replace(' ', '')));
}

const slugValidator = (slug: string) => {
  return slug != null && slug?.replace(' ', '')?.length >= 3;
}

const descriptionValidator = (description?: string) => {
  return description == null || (description != null && description?.replace(' ', '')?.length  > 0 && 
  description?.replace(' ', '')?.length  > 5)
}
const CollectionComponent: React.FC<CollectionComponentProps> = (props) => {
  const { index, data, onChange, validator, isValid: startValidation } = props;
  const [name, setName] = useState(data.name);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [slug, setSlug] = useState(data.slug);
  const [address, setAddress] = useState(data.address);
  const [description, setDescription] = useState(data.description);
  const [errors, setErrors] = useState<error>();
  const [valid, setValid] = useState<boolean>(startValidation);
  const [searchfailed, setSearchFailed] = useState<string>();

  useEffect(() => {
    setSearchFailed(undefined);
    if (isAddress(address)) {
      getCollectionInfo(address)
        .then(asset => {
          const collection = asset?.collection;
          if (collection != null) {
            const _name = collection?.name ?? name;
            const _description = collection?.description ?? description;
            const _slug = collection?.slug ?? slug;
            const _image_url = collection.image_url ?? imageUrl;
            setName(_name);
            setDescription(_description);
            setSlug(_slug);
            setImageUrl(_image_url);
            const _errors = {
              ...errors,
              name: nameValidator(_name) ? undefined : 'Collection name is invalid!',
              description: descriptionValidator(_description) ? undefined : 'Description is invalid!',
              slug: slugValidator(_slug) ? undefined : 'Slug is invalid!',
              imageUrl: _urlValidator(_image_url) ? undefined : 'Image URL is invalid!'
            } as error;
            setErrors(_errors);

          }
        })
        .catch(e => {
          setSearchFailed('Collection search failed!');
        });
    }
  }, [address]);
  useEffect(() => {
    console.log('errors', errors);
    if(errors != null){
      const _valid = Object.values(errors).reduce((pre, cur) => pre && cur == null, true);
      setValid(_valid);
    }
  }, [errors]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).slug`}
          id={`collection(${index}).slug`}
          value={slug}
          onBlur={() => {
            if(!slugValidator(slug)){
              setErrors({...errors, slug: 'Slug is invalid!'})
            }else{
              setErrors({...errors, slug: undefined})
            }
          }}
          onChange={
            ($e) => {
              data.slug = $e.target.value
              setSlug(data.slug);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.slug : undefined}
          error={errors?.slug != null}
          fullWidth
          label="slug"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).name`}
          id={`collection(${index}).name`}
          value={name}
          onBlur={() => {
            if(!nameValidator(name)){
              setErrors({...errors, name: 'Collection name is invalid!'})
            }
          }}
          onChange={
            ($e) => {
              setName($e.target.value);
              onChange($e, { ...data, name: $e.target.value }, index);
            }
          }
          helperText={!valid ? errors?.name : undefined}
          error={errors?.name != null}
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
          onBlur={() => {
            if(_urlValidator(imageUrl)){
              setErrors({...errors, imageUrl: undefined})
            }else{
              setErrors({...errors, imageUrl: 'Image URL is invalid!'})
            }
          }}
          onChange={
            ($e) => {
              data.imageUrl = $e.target.value;
              setImageUrl(data.imageUrl);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.imageUrl : undefined}
          error={errors?.imageUrl != null}
          fullWidth
          label="image"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).address`}
          id={`collection(${index}).address`}
          value={address}
          onBlur={() => {
            if(!addressValidator(address)){
              setErrors({...errors, address: 'Collection address is invalid!'})
            }else{
              setErrors({...errors, address: undefined})
            }
          }}
          onChange={
            ($e) => {
              data.address = $e.target.value;
              setAddress(data.address);
              onChange($e, data, index);
            }
          }
          placeholder={ZERO_ADDRESS}
          helperText={!valid ? errors?.address : undefined}
          error={errors?.address != null}
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
          onBlur={() => {
            if(!descriptionValidator(description)){
              setErrors({...errors, description: 'Description is invalid!'})
            }else{
              setErrors({...errors, description: undefined})
            }
          }}
          onChange={
            ($e) => {
              data.description = $e.target.value;
              setDescription(data.description);
              onChange($e, data, index);
            }
          }
          helperText={!valid ? errors?.description : undefined}
          error={errors?.description != null}
          fullWidth
          label="description"
          variant="outlined"
        />
      </Grid>
      { searchfailed && <MessageView variant='warning' message={searchfailed} /> }
    </>
  )
}


interface CollectionsFormProps {
  title: string;
  collections?: Collection[];
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

type Props = CollectionsFormProps & WizardProps;
const CollectionsForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation } = props;
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
      address: '',
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
    changeIssuerForm('collections', [...collections]);
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
        collections != null ? collections?.map((collection: Collection, i: number) => (
          <>
            {
              i > 0 && (
                <CustomGrid item xs={12} md={12} sm={12}>
                  <Divider></Divider>
                </CustomGrid>
              )
            }
            <Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
              <IconButton aria-label="add" onClick={() => addCollection(i)} disabled={!startValidation}>
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
              validator={validator}
              isValid={startValidation}
            />
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default CollectionsForm;