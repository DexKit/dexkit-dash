import IntlMessages from '@crema/utility/IntlMessages';
import {NFTEmptyStateImage} from 'shared/components/Icons';

import Paper from '@material-ui/core/Paper';
import {AppState} from 'redux/store';
import Box from '@material-ui/core/Box';
import React, {useState, useCallback, useEffect} from 'react';
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
import {useAsset} from 'hooks/useAsset';
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
  onMenu: (contractAddress: string, tokenId: string, target: any) => void;
  onClick: (contractAddress: string, tokenId: string) => void;
}) => {
  const {contractAddress, tokenId, onMenu, onClick} = props;

  const {data, error, isLoading} = useAsset(contractAddress, tokenId);

  const handleClick = useCallback(
    (e: any) => {
      e.preventDefault();
      onClick(contractAddress, tokenId);
    },
    [contractAddress, tokenId, onClick],
  );

  const handleMenu = useCallback(
    (target: any) => {
      onMenu(contractAddress, tokenId, target);
    },
    [contractAddress, tokenId, onMenu],
  );

  return (
    <AssetCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      loading={isLoading || !data}
      caption={data?.title}
      imageUrl={data?.imageUrl}
      onMenu={handleMenu}
      onClick={handleClick}
      error={error}
      collectionName={data?.collectionName}
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

  const [selectedToken, setSelectedToken] =
    useState<{contractAddress: string; tokenId: string}>();

  const {addAsset} = useAddCustomAsset();

  const {removeAsset} = useRemoveCustomAsset();

  const handleSelectAsset = useCallback(
    (contractAddress: string, tokenId: string) => {
      setSelectedToken({contractAddress, tokenId});
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
      addAsset({
        tokenId: nftTokenValues.tokenId,
        contractAddress: nftTokenValues.address,
        chainId: chainId,
      });
      importNftDialogToggler.set(false);
      setNftTokenValues(ASSET_VALUES_EMTPY);
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
    (contractAddress: string, tokenId: string, target: any) => {
      ownerOf(contractAddress, tokenId, getProvider()).then((owner) => {
        if (owner && account) {
          if (isAddressEqual(owner, account)) {
            setCanTransfer(true);
          } else {
            setCanTransfer(false);
          }
        }
        setSelectedToken({contractAddress, tokenId});
        setMenuTarget(target);

        menuToggler.set(true);
      });
    },
    [menuToggler, account, getProvider],
  );

  const handleCloseAssetMenu = useCallback(() => {
    menuToggler.set(false);
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
      />
      <NftsFilterDrawer open={filterToggler.show} onClose={handleCloseFilter} />
      <Box mb={4}>
        <Paper>
          <Box
            p={4}
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
            <Box></Box>
          </Box>
        </Paper>
      </Box>
      <Box>
        {paginate(assets, itemsPerPage, page).length > 0 ? (
          <Grid container spacing={4}>
            {paginate(assets, itemsPerPage, page).map(
              (asset: any, index: number) => (
                <Grid key={index} item xs={12} sm={3}>
                  <AssetCardWithMetadata
                    tokenId={asset.tokenId}
                    contractAddress={asset.contractAddress}
                    metadata={asset.metadata}
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
          <Paper>
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
                  <Typography align='center' variant='h5'>
                    <IntlMessages id='nfts.wallet.noItemsFound' />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default NftsTab;
