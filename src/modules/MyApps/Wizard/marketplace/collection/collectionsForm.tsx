import React, {useCallback, useEffect, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {Grid, makeStyles, FormControlLabel} from '@material-ui/core';

import {Collection, ConfigFileMarketplace} from 'types/myApps';
import {WizardProps} from '../../shared';

import {ArtistCollectionsSearch} from './artistCollectionsSearch';
import {CollectionInfo} from 'types/opensea/collectionInfo.interface';
import {
  collectionInfo2Collection,
  collection2CollectionInfo,
} from 'utils/collections';
import {IOSSwitchComponent} from 'shared/components/Inputs/iOsSwitchComponent';
import {CollectionComponentList} from './collectionComponentList';

const useStyle = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'center',
    display: 'inline-flex',
    alignSelf: 'center',
  },
}));

interface CollectionsFormProps {
  title: string;
  collections?: Collection[];
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

type Props = CollectionsFormProps &
  WizardProps<ConfigFileMarketplace, keyof ConfigFileMarketplace>;

const CollectionsForm: React.FC<Props> = (props) => {
  const {
    changeIssuerForm,
    validator,
    isValid: startValidation,
    editable,
  } = props;
  const [collections, setCollections] = useState(props.collections ?? []);
  const [showGrid, setShowGrid] = useState(true);
  const [ownerAddress, setOwnerAddress] = useState<string | undefined>(
    '0xebd4d9c4ebc66cfbac7aad613948c26ae3ef0772',
  );
  const classes = useStyle();

  useEffect(() => {
    if (collections == null || collections?.length === 0) {
      setCollections([
        {
          name: '',
          imageUrl: '',
          slug: '',
          description: '',
          address: '',
          assetCount: 0,
          id: '',
        },
      ] as Collection[]);
    }
  }, []);

  const onChange = useCallback(
    (
      $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      collection: Collection,
      index: number,
    ) => {
      if (!Boolean(editable)) {
        return;
      }
      if (index >= 0 && collections != null && index < collections.length) {
        collections[index] = collection;
        changeIssuerForm('collections', collections);
      }
    },
    [collections, changeIssuerForm],
  );

  useEffect(() => {
    if (Boolean(editable)) {
      changeIssuerForm('collections', [...collections]);
    }
  }, [collections, changeIssuerForm, editable]);

  const uniqueCheck = useCallback(
    (address: string): boolean => {
      const r = collections.filter(
        (t) =>
          t.address?.toLowerCase() === address?.toLowerCase() ||
          t.slug?.toLowerCase() === address?.toLowerCase(),
      );
      return r?.length === 1;
    },
    [collections],
  );

  const updateCollection = useCallback(
    (_collections: CollectionInfo[] | Collection[]) => {
      let union: Collection[] = [];
      if (_collections == null) {
        return;
      }
      const _filter = (c: CollectionInfo | Collection | undefined) =>
        c != null && c.slug != null && c.slug?.length > 0;
      if (_collections.length == 0) {
        union = collections.filter(_filter);
      } else {
        const _aux =
          'primary_asset_contracts' in _collections[0]
            ? collectionInfo2Collection(...(_collections as CollectionInfo[]))
            : (_collections as Collection[]);
        union = [...collections.filter(_filter), ..._aux];
      }
      const set = new Set(union.map((c) => c?.slug.toLowerCase()));
      const _t = Array.from(set.values())
        .map((x) => union.find((t) => t.slug.toLowerCase() === x))
        .filter(_filter) as Collection[];
      setCollections([..._t]);
    },
    [collections, setCollections],
  );

  const switchOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setShowGrid(checked);
  };

  const onSave = (
    $e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    ownerAddress?: string,
  ) => {
    if ($e != null) {
      $e.preventDefault();
    }
    setShowGrid(false);
    setOwnerAddress(ownerAddress);
  };

  return (
    <GridContainer>
      <Grid item xs={6} key={'multiple'}>
        <FormControlLabel
          control={
            <IOSSwitchComponent
              checked={showGrid}
              onChange={switchOnChange}
              name='multiple'
            />
          }
          label='Include by Artist Address'
        />
      </Grid>
      {showGrid ? (
        <ArtistCollectionsSearch
          artistAddress={ownerAddress}
          collections={collection2CollectionInfo(...collections)}
          update={updateCollection}
          onSave={onSave}
          validator={validator}
        />
      ) : (
        <CollectionComponentList
          classes={classes}
          collections={collections}
          editable={Boolean(editable)}
          valid={startValidation}
          validator={validator}
          onChange={onChange}
          uniqueCheck={uniqueCheck}
        />
      )}
    </GridContainer>
  );
};

export default CollectionsForm;
