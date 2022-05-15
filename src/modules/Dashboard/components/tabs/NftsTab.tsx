import IntlMessages from '@crema/utility/IntlMessages';
import {NFTEmptyStateImage} from 'shared/components/Icons';

import {AppState} from 'redux/store';
import Box from '@material-ui/core/Box';
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import AddIcon from '@material-ui/icons/Add';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SendIcon from '@material-ui/icons/Send';

import AssetCard from 'modules/Dashboard/components/AssetCard';
import AssetDetailDialog from 'modules/Dashboard/components/AssetDetailDialog';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import {
  useAddCustomAsset,
  useAssetList,
  useRemoveCustomAsset,
} from 'hooks/tokens';
import {useToggler} from 'hooks/useToggler';
import ImportNftTokenDialog, {
  ImportNftTokenValues,
} from 'modules/Settings/components/ImportNftTokenDialog';
import {useWeb3} from 'hooks/useWeb3';
import ConfirmRemoveAssetDialog from 'modules/Dashboard/components/ConfirmRemoveAssetDialog';

import TransferAssetDialog from 'shared/components/Dialogs/TransferAssetDialog';
import SelectAddressDialog from 'shared/components/SelectAddressDialog';
import {useSelector} from 'react-redux';
import {ownerOf} from 'services/nfts';
import {isAddressEqual} from 'utils/blockchain';
import NftsFilterDrawer from '../NftsFilterDrawer';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import {Badge} from '@material-ui/core';

const FILTER_EMPTY_STATE: any = {chainId: undefined};

const INITIAL_PAGE_SIZE = 10;

const PAGE_SIZES = [
  INITIAL_PAGE_SIZE,
  2 * INITIAL_PAGE_SIZE,
  5 * INITIAL_PAGE_SIZE,
  10 * INITIAL_PAGE_SIZE,
];

const ASSET_VALUES_EMTPY = {
  address: '',
  tokenId: '',
};

const AssetCardWithMetadata = (props: {
  contractAddress: string;
  tokenId: string;
  metadata: any;
  chainId: number;
  onMenu: (
    contractAddress: string,
    tokenId: string,
    metadata: any,
    chainId: number,
    target: any,
  ) => void;
  onClick: (
    contractAddress: string,
    tokenId: string,
    metadata: any,
    chainId: number,
  ) => void;
}) => {
  const {contractAddress, tokenId, onMenu, onClick, metadata, chainId} = props;

  const handleClick = useCallback(
    (e: any) => {
      e.preventDefault();
      onClick(contractAddress, tokenId, metadata, chainId);
    },
    [contractAddress, tokenId, onClick, metadata, chainId],
  );

  const handleMenu = useCallback(
    (target: any) => {
      onMenu(contractAddress, tokenId, metadata, chainId, target);
    },
    [contractAddress, tokenId, onMenu, metadata, chainId],
  );

  return (
    <AssetCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      caption={metadata?.title}
      imageUrl={metadata?.imageUrl}
      onMenu={handleMenu}
      onClick={handleClick}
      collectionName={metadata?.collectionName}
    />
  );
};

export const NftsTab: React.FC = () => {
  const {assets} = useAssetList();
  const {account, getProvider, chainId} = useWeb3();

  const menuToggler = useToggler();
  const showDetailToggler = useToggler();
  const importNftDialogToggler = useToggler();
  const transferAssetDialogToggler = useToggler();
  const removeAssetDialogToggler = useToggler();

  const [nftTokenValues, setNftTokenValues] =
    useState<ImportNftTokenValues>(ASSET_VALUES_EMTPY);

  const [canTransfer, setCanTransfer] = useState(false);

  const [selectedToken, setSelectedToken] = useState<{
    contractAddress: string;
    tokenId: string;
    metadata: any;
    chainId: number;
  }>();

  const {addAsset} = useAddCustomAsset();

  const {removeAsset} = useRemoveCustomAsset();

  const handleSelectAsset = useCallback(
    (
      contractAddress: string,
      tokenId: string,
      metadata: any,
      chainId: number,
    ) => {
      setSelectedToken({contractAddress, tokenId, metadata, chainId});
      showDetailToggler.set(true);
    },
    [showDetailToggler],
  );

  const handleCloseDialog = useCallback(() => {
    showDetailToggler.set(false);
    setSelectedToken(undefined);
  }, [showDetailToggler]);

  const handleAddNftChange = useCallback(
    (key: string, value: string) => {
      setNftTokenValues({...nftTokenValues, [key]: value});
    },
    [nftTokenValues],
  );

  const handleNftTokenSubmit = useCallback(() => {
    if (chainId && nftTokenValues.tokenId && nftTokenValues.address) {
      addAsset
        .mutateAsync({
          tokenId: nftTokenValues.tokenId,
          contractAddress: nftTokenValues.address,
          chainId: chainId,
        })
        .then(() => {
          importNftDialogToggler.set(false);
          setNftTokenValues(ASSET_VALUES_EMTPY);
        });
    }
  }, [addAsset, nftTokenValues, chainId, importNftDialogToggler]);

  const handleCloseAddNftDialog = useCallback(() => {
    importNftDialogToggler.set(false);
    setNftTokenValues(ASSET_VALUES_EMTPY);
  }, [importNftDialogToggler]);

  const handleCloseRemoveDialog = useCallback(() => {
    removeAssetDialogToggler.set(false);
    setSelectedToken(undefined);
  }, [removeAssetDialogToggler]);

  const handleShowImportAsset = useCallback(() => {
    importNftDialogToggler.set(true);
  }, [importNftDialogToggler]);

  const handleRemoveAsset = useCallback(() => {
    removeAssetDialogToggler.set(true);
    menuToggler.set(false);
  }, [removeAssetDialogToggler, menuToggler]);

  const handleTransferAsset = useCallback(() => {
    transferAssetDialogToggler.set(true);
    menuToggler.set(false);
  }, [transferAssetDialogToggler, menuToggler]);

  const handleConfirmRemoveAsset = useCallback(() => {
    if (selectedToken && chainId) {
      removeAsset({...selectedToken, chainId});
      removeAssetDialogToggler.set(false);
      setSelectedToken(undefined);
    }
  }, [removeAssetDialogToggler, removeAsset, selectedToken, chainId]);

  const [menuTarget, setMenuTarget] = useState<any>();

  const handleAssetMenu = useCallback(
    (
      contractAddress: string,
      tokenId: string,
      metadata: any,
      tokenChainId: number,
      target: any,
    ) => {
      if (chainId === tokenChainId) {
        ownerOf(contractAddress, tokenId, getProvider())
          .then((owner) => {
            if (owner && account) {
              if (isAddressEqual(owner, account)) {
                setCanTransfer(true);
              } else {
                setCanTransfer(false);
              }
            }
          })
          .finally(() => {
            setSelectedToken({
              contractAddress,
              tokenId,
              metadata,
              chainId: tokenChainId,
            });
            setMenuTarget(target);
            menuToggler.set(true);
          });
      } else {
        setSelectedToken({
          contractAddress,
          tokenId,
          metadata,
          chainId: tokenChainId,
        });
        setMenuTarget(target);
        menuToggler.set(true);
      }
    },
    [menuToggler, account, getProvider, chainId],
  );

  const handleCloseAssetMenu = useCallback(() => {
    menuToggler.set(false);
    setCanTransfer(false);
  }, [menuToggler]);

  const handleCloseTransferDialog = useCallback(() => {
    transferAssetDialogToggler.set(false);
    setSelectedToken(undefined);
  }, [transferAssetDialogToggler]);

  const accounts = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const selectAddressDialogToggler = useToggler();
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const handleOpenSelectAddress = useCallback(() => {
    selectAddressDialogToggler.set(true);
  }, [selectAddressDialogToggler]);

  const handleSelectAddress = useCallback(
    (address: string) => {
      setSelectedAddress(address);
      selectAddressDialogToggler.set(false);
    },
    [selectAddressDialogToggler],
  );

  const handleCloseSelectAddress = useCallback(() => {
    selectAddressDialogToggler.set(false);
  }, [selectAddressDialogToggler]);

  const filterToggler = useToggler();

  const handleShowFilters = useCallback(() => {
    filterToggler.set(true);
  }, [filterToggler]);

  const handleCloseFilter = useCallback(() => {
    filterToggler.set(false);
  }, [filterToggler]);

  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(e.target.value);
  }, []);

  useEffect(() => {
    setPage(1);
  }, []);

  const paginate = useCallback(
    (array: any[], page_size: number, page_number: number) => {
      return array.slice(
        (page_number - 1) * page_size,
        page_number * page_size,
      );
    },
    [],
  );

  const handleGoNext = useCallback(() => {
    setPage((value) => value + 1);
  }, []);

  const handleGoPrevious = useCallback(() => {
    setPage((value) => value - 1);
  }, []);

  const [filterParams, setFilterParams] = useState<any>(FILTER_EMPTY_STATE);

  const handleChangeParam = useCallback((params: any) => {
    setFilterParams(params);
  }, []);

  const filteredAssets = useMemo(() => {
    let newAssets = [...assets];

    if (filterParams.chainId) {
      newAssets = newAssets.filter((a) => a.chainId === filterParams.chainId);
    }

    return newAssets;
  }, [assets, filterParams]);

  const handleResetNFT = useCallback(() => {
    addAsset.reset();
  }, [addAsset]);

  return (
    <>
      <Menu
        onClose={handleCloseAssetMenu}
        anchorEl={menuTarget}
        open={menuToggler.show}>
        {canTransfer ? (
          <MenuItem onClick={handleTransferAsset}>
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <Typography variant='inherit'>
              <IntlMessages id='app.wallet.transfer' />
            </Typography>
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleRemoveAsset}>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <Typography variant='inherit'>
            <IntlMessages id='app.wallet.remove' />
          </Typography>
        </MenuItem>
      </Menu>
      <TransferAssetDialog
        defaultAddress={selectedAddress}
        onSelectAddress={handleOpenSelectAddress}
        dialogProps={{
          open: transferAssetDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseTransferDialog,
        }}
        contractAddress={selectedToken?.contractAddress}
        tokenId={selectedToken?.tokenId}
      />
      <SelectAddressDialog
        open={selectAddressDialogToggler.show}
        accounts={accounts.evm}
        onSelectAccount={handleSelectAddress}
        onClose={handleCloseSelectAddress}
      />
      <AssetDetailDialog
        dialogProps={{
          open: showDetailToggler.show,
          onClose: handleCloseDialog,
          maxWidth: 'xs',
          fullWidth: true,
        }}
        contractAddress={selectedToken?.contractAddress}
        tokenId={selectedToken?.tokenId}
        metadata={selectedToken?.metadata}
        chainId={selectedToken?.chainId}
      />
      <ImportNftTokenDialog
        dialogProps={{
          open: importNftDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddNftDialog,
        }}
        values={nftTokenValues}
        onChange={handleAddNftChange}
        onSubmit={handleNftTokenSubmit}
        loading={addAsset.isLoading}
        error={addAsset.isError as any}
        onReset={handleResetNFT}
      />
      <ConfirmRemoveAssetDialog
        dialogProps={{
          open: removeAssetDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseRemoveDialog,
        }}
        onConfirm={handleConfirmRemoveAsset}
        contractAddress={selectedToken?.contractAddress}
        tokenId={selectedToken?.tokenId}
        metadata={selectedToken?.metadata}
        chainId={selectedToken?.chainId}
      />
      <NftsFilterDrawer
        open={filterToggler.show}
        params={filterParams}
        onClose={handleCloseFilter}
        onChangeParams={handleChangeParam}
      />
      <Box mb={4}>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box>
            <Button
              onClick={handleShowImportAsset}
              variant='contained'
              startIcon={<AddIcon />}
              color='primary'>
              Import
            </Button>
          </Box>
          <Box>
            <SquaredIconButton onClick={handleShowFilters}>
              <Badge
                color='primary'
                variant='dot'
                invisible={filterParams === FILTER_EMPTY_STATE}>
                <FilterSearchIcon />
              </Badge>
            </SquaredIconButton>
          </Box>
        </Box>
      </Box>
      <Box>
        {paginate(filteredAssets, itemsPerPage, page).length > 0 ? (
          <Grid container spacing={4}>
            {paginate(filteredAssets, itemsPerPage, page).map(
              (asset: any, index: number) => (
                <Grid key={index} item xs={6} sm={4}>
                  <AssetCardWithMetadata
                    tokenId={asset.tokenId}
                    contractAddress={asset.contractAddress}
                    metadata={asset.metadata}
                    chainId={asset.chainId}
                    onClick={handleSelectAsset}
                    onMenu={handleAssetMenu}
                  />
                </Grid>
              ),
            )}
            <Grid item xs={12}>
              <Grid
                justify='flex-end'
                container
                alignItems='center'
                spacing={2}>
                <Grid item>
                  <FormControl variant='outlined' size='small'>
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      variant='outlined'>
                      {PAGE_SIZES.map((pageSize, i) => (
                        <MenuItem value={pageSize} key={`menu-${i}`}>
                          {pageSize}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <IconButton disabled={page === 1} onClick={handleGoPrevious}>
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={
                      page >= 1 &&
                      paginate(assets, itemsPerPage, page).length < itemsPerPage
                    }
                    onClick={handleGoNext}>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Box py={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  justifyContent='center'
                  alignContent='center'
                  alignItems='center'>
                  <NFTEmptyStateImage />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  align='center'
                  variant='body2'
                  color={'textSecondary'}>
                  <IntlMessages id='nfts.wallet.noItemsFound' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

export default NftsTab;
