import React, {ChangeEvent, useState, useEffect} from 'react';
import {Grid, TextField} from '@material-ui/core';

import MessageView from '@crema/core/MessageView';

import {Collection} from 'types/myApps';
import {ZERO_ADDRESS} from 'shared/constants/Blockchain';
import {isAddress} from '@ethersproject/address';
import {getCollectionInfo} from 'services/rest/opensea';
import {urlValidator} from 'utils/text';
import {CustomLabel} from 'shared/components/Wizard/Label';
import {error, getHelpText} from '../../shared';
import {HELP_TEXT_COLLECTIONS} from '../helpText';
import {InfoComponent} from '../../shared/Buttons/infoComponent';

interface CollectionComponentItemProps {
  index: number;
  data: Collection;
  onChange: (
    $event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    collection: Collection,
    index: number,
  ) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
  editable?: boolean;
  uniqueCheck: (address: string) => boolean;
}

const nameValidator = (name: string) => {
  return name != null && name?.replace(' ', '')?.length >= 3;
};
const addressValidator = (address: string) => {
  return address != null && isAddress(address?.replace(' ', ''));
};

const _urlValidator = (url: string) => {
  return (
    url == null ||
    (url != null &&
      url?.replace(' ', '')?.length > 0 &&
      urlValidator(url?.replace(' ', '')))
  );
};

const slugValidator = (slug: string) => {
  return slug != null && slug?.replace(' ', '')?.length >= 3;
};

const descriptionValidator = (description?: string) => {
  return (
    description == null ||
    (description != null &&
      description?.replace(' ', '')?.length > 0 &&
      description?.replace(' ', '')?.length > 5)
  );
};
export const CollectionComponentItem: React.FC<CollectionComponentItemProps> = (
  props,
) => {
  const {
    index,
    data,
    onChange,
    validator,
    isValid: startValidation,
    editable,
    uniqueCheck,
  } = props;
  const [name, setName] = useState(data.name);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [slug, setSlug] = useState(data.slug);
  const [address, setAddress] = useState(data.address);
  const [description, setDescription] = useState(data.description);
  const [errors, setErrors] = useState<error>();
  const [valid, setValid] = useState<boolean>(startValidation);
  const [searchfailed, setSearchFailed] = useState<string>();
  const addressInput = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    // const _error = fillError(errors, undefined);
    // console.log('error', _error);
    const _valid =
      nameValidator(name) &&
      addressValidator(address) &&
      _urlValidator(imageUrl) &&
      slugValidator(slug) &&
      descriptionValidator(description);
    // setErrors(_error);
    setValid(_valid);
    validator(_valid);
  }, []);

  /* eslint-disable */
  useEffect(() => {
    setSearchFailed(undefined);
    if (isAddress(address)) {
      setLoading(true);
      getCollectionInfo(address)
        .then((asset) => {
          const collection = asset?.collection;
          if (collection != null) {
            const unique = uniqueCheck(address);
            const _name = collection?.name ?? name;
            const _description = collection?.description ?? description;
            const _slug = collection?.slug ?? slug;
            const _image_url = collection.image_url ?? imageUrl;
            if (unique) {
              setName(_name);
              setDescription(_description);
              setSlug(_slug);
              setImageUrl(_image_url);
            }
            const _errors = {
              ...errors,
              address:
                unique === false
                  ? 'There is already a collection with the address informed!'
                  : undefined,
              name: nameValidator(_name)
                ? undefined
                : 'Collection name is invalid!',
              description: descriptionValidator(_description)
                ? undefined
                : 'Description is invalid!',
              slug: slugValidator(_slug) ? undefined : 'Slug is invalid!',
              imageUrl: _urlValidator(_image_url)
                ? undefined
                : 'Image URL is invalid!',
            } as error;
            const _valid = Object.values(_errors).reduce(
              (pre, cur) => pre && cur == null,
              true,
            );
            if (_valid) {
              const _collections: Collection = {
                address,
                name: _name,
                imageUrl: _image_url,
                slug: _slug,
                description: _description,
                id: '',
                assetCount: 0,
              };
              const e = new Event('input', {bubbles: true});
              onChange(
                e as unknown as ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement
                >,
                _collections,
                index,
              );
            }
            setErrors(_errors);
          }
        })
        .catch((e) => {
          setSearchFailed('Collection search failed!');
        })
        .finally(() => setLoading(false));
    }
  }, [address]);

  useEffect(() => {
    if (errors != null) {
      const _valid = Object.values(errors).reduce(
        (pre, cur) => pre && cur == null,
        true,
      );
      setValid(_valid);
    }
  }, [errors]);

  useEffect(() => {
    if (errors != null) {
      validator(valid);
    }
  }, [valid, validator]);

  useEffect(() => {
    if (searchfailed != null) {
      setErrors({...errors, address: searchfailed});
    }
  }, [searchfailed]);

  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          ref={addressInput}
          key={`collection(${index}).address`}
          id={`collection(${index}).address`}
          value={address}
          onBlur={() => {
            const unique = uniqueCheck(address);
            if (!Boolean(editable)) {
              return;
            }
            if (!unique) {
              setErrors({
                ...errors,
                address:
                  'There is already a collection with the address informed!',
              });
            } else if (!addressValidator(address)) {
              setErrors({...errors, address: 'Collection address is invalid!'});
            } else {
              setErrors({...errors, address: undefined});
            }
          }}
          onChange={($e) => {
            if (Boolean(editable)) {
              data.address = $e.target.value;
              $e.preventDefault();
              setAddress(data.address);
              onChange(
                $e,
                {
                  address: $e.target.value,
                  assetCount: 0,
                  imageUrl,
                  name,
                  slug,
                  description,
                  id: '0',
                },
                index,
              );
            }
          }}
          placeholder={ZERO_ADDRESS}
          helperText={!valid ? errors?.address : undefined}
          error={errors?.address != null}
          fullWidth
          label={<CustomLabel text='Address' required={true} />}
          variant='outlined'
          disabled={Boolean(editable) ? loading : true}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={getHelpText(HELP_TEXT_COLLECTIONS, 'address', 0)}
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).name`}
          id={`collection(${index}).name`}
          value={name}
          onBlur={() => {
            if (!Boolean(editable)) {
              return;
            }
            if (!nameValidator(name)) {
              setErrors({...errors, name: 'Collection name is invalid!'});
            }
          }}
          onChange={($e) => {
            if (!Boolean(editable)) {
              return;
            }
            setName($e.target.value);
            onChange($e, {...data, name: $e.target.value}, index);
          }}
          helperText={!valid ? errors?.name : undefined}
          error={errors?.name != null}
          fullWidth
          label={`Name`}
          variant='outlined'
          disabled
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={getHelpText(HELP_TEXT_COLLECTIONS, 'name', 0)}
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).imageUrl`}
          id={`collection(${index}).imageUrl`}
          type='url'
          value={imageUrl}
          onBlur={() => {
            if (!Boolean(editable)) {
              return;
            }
            if (_urlValidator(imageUrl)) {
              setErrors({...errors, imageUrl: undefined});
            } else {
              setErrors({...errors, imageUrl: 'Image URL is invalid!'});
            }
          }}
          onChange={($e) => {
            if (!Boolean(editable)) {
              return;
            }
            data.imageUrl = $e.target.value;
            setImageUrl(data.imageUrl);
            onChange($e, data, index);
          }}
          helperText={!valid ? errors?.imageUrl : undefined}
          error={errors?.imageUrl != null}
          fullWidth
          label='Image'
          variant='outlined'
          disabled
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={getHelpText(HELP_TEXT_COLLECTIONS, 'imageUrl', 0)}
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          key={`collection(${index}).slug`}
          id={`collection(${index}).slug`}
          value={slug}
          onBlur={() => {
            if (!Boolean(editable)) {
              return;
            }
            if (!slugValidator(slug)) {
              setErrors({...errors, slug: 'Slug is invalid!'});
            } else {
              setErrors({...errors, slug: undefined});
            }
          }}
          onChange={($e) => {
            if (!Boolean(editable)) {
              return;
            }
            data.slug = $e.target.value;
            setSlug(data.slug);
            onChange($e, data, index);
          }}
          helperText={!valid ? errors?.slug : undefined}
          error={errors?.slug != null}
          fullWidth
          label='Slug'
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={getHelpText(HELP_TEXT_COLLECTIONS, 'slug', 0)}
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          key={`collection(${index}).description`}
          id={`collection(${index}).description`}
          value={description}
          onBlur={() => {
            if (!Boolean(editable)) {
              return;
            }
            if (!descriptionValidator(description)) {
              setErrors({...errors, description: 'Description is invalid!'});
            } else {
              setErrors({...errors, description: undefined});
            }
          }}
          onChange={($e) => {
            if (!Boolean(editable)) {
              return;
            }
            data.description = $e.target.value;
            setDescription(data.description);
            onChange($e, data, index);
          }}
          helperText={!valid ? errors?.description : undefined}
          error={errors?.description != null}
          fullWidth
          disabled
          label='Description'
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={getHelpText(HELP_TEXT_COLLECTIONS, 'description', 0)}
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        {searchfailed && (
          <MessageView
            variant='warning'
            message={searchfailed}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
          />
        )}
      </Grid>
    </>
  );
};
