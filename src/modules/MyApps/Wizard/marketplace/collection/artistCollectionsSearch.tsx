import React, {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {DataGrid, GridRowData} from '@material-ui/data-grid';
import {TextField, Grid, Box, IconButton, Icon, Fab} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {MessageView} from '@crema';

import {isAddress} from 'ethers/lib/utils';

import {ZERO_ADDRESS} from 'shared/constants/Blockchain';
import {getCollectionByOwner} from 'services/rest/opensea';
import {CustomLabel} from 'shared/components/Wizard/Label';
/* eslint-disable */
import {error, getHelpText} from '../../shared';
import {InfoComponent} from '../../shared/Buttons/infoComponent';
import {CollectionInfo} from 'types/opensea/collectionInfo.interface';
import {HELP_TEXT_ARTIST_COLLECTIONS} from '../helpText';
interface ArtistCollectionsSearchProps {
  artistAddress?: string;
  collections?: CollectionInfo[];
  validator: (isValid: boolean) => void;
  update: (collections: CollectionInfo[]) => void;
  onSave: (
    $e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    ownerAddress?: string,
  ) => void;
}

const columns = [
  {field: 'id', headerName: 'ID', width: 60},
  {
    field: 'address',
    headerName: 'Address',
    width: 150,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'imageUrl',
    headerName: 'Image URL',
    width: 150,
  },
  {
    field: 'slug',
    headerName: 'Slug URL',
    width: 150,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 150,
  },
];

type Props = PropsWithChildren<ArtistCollectionsSearchProps>;
export function ArtistCollectionsSearch(props: Props) {
  const {
    artistAddress,
    validator,
    update,
    onSave,
    collections: startCollections,
  } = props;
  const [address, setAddress] = useState(artistAddress);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<GridRowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<error>({address: undefined});
  const [valid, setValid] = useState(false);
  const [searchfailed, setSearchFailed] = useState<string>();
  const [pageSize] = useState(10);

  const [collections, setCollections] = useState<CollectionInfo[]>(
    startCollections ?? [],
  );

  /* eslint-disable */
  const [selecteds, setSelecteds] = useState<CollectionInfo[]>(
    startCollections ?? [],
  );

  const findCollections = useCallback(() => {
    return getCollectionByOwner(address ?? '', 0, 100 * pageSize);
  }, [page, address, pageSize]);

  const sendSearch = useCallback(() => {
    if (valid && !loading) {
      setLoading(true);
      setSearchFailed(undefined);
      findCollections()
        .then((_collections) => {
          setCollections(_collections ?? []);
        })
        .catch((e) => {
          setSearchFailed('Artist collection search failed!');
        })
        .finally(() => setTimeout(() => setLoading(false), 500));
    }
  }, [page, address, valid, setLoading]);

  const _validator = useCallback((_address?: string) => {
    if (_address == null || _address.length === 0) {
      validator(false);
      return false;
    }
    const _valid = isAddress(_address);
    validator(_valid);
    return _valid;
  }, []);

  useEffect(() => {
    const _valid = _validator(address);
    if (!_valid) {
      setValid(false);
      return;
    }
    setValid(_valid);
  }, [address]);

  useEffect(() => {
    if (valid) {
      setError({
        address: undefined,
      });
    } else {
      setError({
        address: 'artist address is invalid!',
      });
    }
  }, [valid]);

  useEffect(() => {
    if (searchfailed != null) {
      setError({address: searchfailed});
    }
  }, [searchfailed]);

  useEffect(() => {
    const _rows = collections?.map((collection, i) => {
      return {
        id: i + 1,
        address:
          collection?.primary_asset_contracts?.length > 0
            ? collection?.primary_asset_contracts[0]?.address
            : undefined,
        name: collection?.name,
        imageUrl: collection?.image_url,
        slug: collection?.slug,
        description: collection?.description,
      } as GridRowData;
    });
    setRows(_rows);
  }, [collections]);

  useEffect(() => {
    sendSearch();
  }, [page]);

  return (
    <>
      <Grid item xs={12} key='search-collections'>
        <Box display='flex' width='100%' marginY='1.5rem'>
          <TextField
            type='text'
            value={address}
            helperText={!valid && error != null ? error['address'] : undefined}
            error={error != null && Boolean(error['address'])}
            placeholder={ZERO_ADDRESS}
            onBlur={($e) => {
              const _valid = _validator(address);
              setValid(_valid);
            }}
            onChange={($e) => {
              setAddress($e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            label={<CustomLabel required={true}>Artist address</CustomLabel>}
            variant='outlined'
            InputProps={{
              endAdornment: (
                <InfoComponent
                  text={getHelpText(HELP_TEXT_ARTIST_COLLECTIONS, 'address', 0)}
                />
              ),
            }}
            disabled={loading}
          />
          <IconButton
            aria-label='send'
            color='primary'
            disabled={!valid}
            onClick={($e) => {
              $e.preventDefault();
              sendSearch();
            }}>
            <Icon>send</Icon>
          </IconButton>
        </Box>
      </Grid>
      {/* <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
      </div> */}
      <Grid item xs={12} key='collections-table'>
        <Box height={300} width='100%' marginY='1.5rem'>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            loading={loading}
            onCellClick={($e) => {
              if (
                $e?.field === 'imageUrl' &&
                $e?.getValue($e?.id, $e?.field)?.toString()
              ) {
                window.open($e?.getValue($e?.id, $e?.field)?.toString());
              } else if (
                $e?.field !== '__check__' &&
                $e?.field !== 'id' &&
                $e?.getValue($e?.id, 'slug')?.toString()
              ) {
                window.open(
                  `https://opensea.io/collection/${$e
                    ?.getValue($e?.id, 'slug')
                    ?.toString()}`,
                );
              }
            }}
            onSelectionModelChange={($e) => {
              // setSelecteds(
              //   $e?.selectionModel?.map((id) => {
              //     const _id = Number(id.valueOf());
              //     return collections[_id - 1];
              //   }),
              // );
            }}
            autoPageSize={false}
            onPageChange={(param) => setPage(param)}
            checkboxSelection
          />
        </Box>
      </Grid>
      <Grid item xs={12} key='update-collections'>
        <Box paddingY={10} display='flex'>
          <Fab
            disabled={!valid || selecteds == null || selecteds.length === 0}
            color='primary'
            aria-label='add'
            size='medium'
            onClick={($e) => {
              if (!valid || selecteds == null || selecteds.length === 0) {
                return;
              }
              update(selecteds);
              setLoading(true);
              setTimeout(() => {
                onSave($e, address);
                setLoading(false);
              }, 500);
            }}
            style={{marginLeft: 'auto', marginRight: 0}}>
            <SaveIcon />
          </Fab>
        </Box>
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
}
