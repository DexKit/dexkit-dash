import React, {useState, useCallback} from 'react';
import {
  Box,
  CircularProgress,
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Typography,
  useTheme,
} from '@material-ui/core';
import CollectionItem from '../CollecttionItem';
import {CollectionItemData} from 'modules/Wizard/types';
import {useWeb3} from 'hooks/useWeb3';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';
import {useWizardApi} from 'modules/Wizard/hooks';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {getTransactionScannerUrl} from 'utils/blockchain';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {ethers} from 'ethers';
import IntlMessages from '@crema/utility/IntlMessages';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import { useIntl } from 'react-intl';

interface MintItemsDialogProps extends DialogProps {
  contractAddress: string;
  onFinish: () => void;
}

export const MintItemsDialog = (props: MintItemsDialogProps) => {
  const {contractAddress, onClose, onFinish} = props;
  const userDefaultAcount = useDefaultAccount();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const wizardApi = useWizardApi();

  const {getProvider, chainId} = useWeb3();

  const [mintTransactionHash, setMintTransactionHash] = useState('');
  const [items, setItems] = useState<CollectionItemData[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleItemChange = useCallback(
    (item: CollectionItemData) => {
      let newItems = [...items];

      let index = newItems.findIndex((i) => i.id === item.id);

      newItems[index] = item;

      setItems(newItems);
    },
    [items],
  );

  const handleAddItem = useCallback(() => {
    let newId = (items.length + 1).toString();

    setItems([
      ...items,
      {
        id: newId,
        name: '',
        description: '',
        image: null,
        attributes: [],
      },
    ]);
  }, [items]);

  const handleRemove = useCallback(
    (item: CollectionItemData) => {
      let newItems = [...items];

      let index = newItems.findIndex((i) => i.id === item.id);

      newItems.splice(index, 1);

      setItems(newItems);
    },
    [items],
  );

  const uploadImages = useCallback(async (): Promise<any> => {
    let images: any = {};

    for (let item of items) {
      if (item.image) {
        let response = await wizardApi.uploadImage(item.image);

        images[item.id] = response.data.hash;
      }
    }

    return images;
  }, [wizardApi, items]);

  const sendItemsMetadata = useCallback(
    async (sendItemsMetadata: any): Promise<string[]> => {
      let response = await wizardApi.sendItemsMetadata(
        items.map((item: CollectionItemData) => ({
          attributes: item.attributes,
          image: `ipfs://${sendItemsMetadata[item.id]}`,
          external_link: '',
          name: item.name,
          description: item.description,
        })),
      );

      return response.data.hashes;
    },
    [wizardApi, items],
  );

  const [errorMessage, setErrorMessage] = useState<string>();

  // TODO: remove duplace
  const mintItems = useCallback(
    async (contractAddress: string, hashes: string[]) => {
      return new Promise((resolve, reject) => {
        setErrorMessage(undefined);
        if (userDefaultAcount) {
          let wrappedProvider = getProvider();

          let provider = new ethers.providers.Web3Provider(wrappedProvider);

          var contract = new ethers.Contract(
            contractAddress,
            ERC721Abi,
            provider.getSigner(),
          );

          let paramItems = hashes.map((hash: string) => {
            return {
              to: userDefaultAcount,
              tokenURI: hash,
            };
          });

          contract
            .multiSafeMint(paramItems)
            .then(async (result: any) => {
              setMintTransactionHash(result.hash);

              await result.wait();
              resolve(undefined);
            })
            .catch((err: any) => {
              setErrorMessage(err.message);
              reject();
            });
        }
      });
    },
    [userDefaultAcount, getProvider],
  );

  const handleConfirm = useCallback(async () => {
    setLoading(true);

    let itemImagesHashes = await uploadImages();

    let itemsHashes = await sendItemsMetadata(itemImagesHashes);

    await mintItems(contractAddress, itemsHashes);

    onFinish();
    setShowSuccess(true);
    setLoading(false);
  }, [mintItems, sendItemsMetadata, contractAddress, onFinish, uploadImages]);

  const handleCancel = useCallback(
    (e) => {
      if (onClose) {
        onClose({}, 'backdropClick');
      }
      setMintTransactionHash('');
      setItems([]);
    },
    [onClose],
  );

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

  const handleTryAgain = useCallback(async () => {
    setLoading(true);

    let itemImagesHashes = await uploadImages();

    let itemsHashes = await sendItemsMetadata(itemImagesHashes);

    await mintItems(contractAddress, itemsHashes);

    onFinish();
    setShowSuccess(true);
    setLoading(false);
  }, [mintItems, sendItemsMetadata, contractAddress, onFinish, uploadImages]);
  const { messages } = useIntl();
  return (
    <Dialog {...props} disableBackdropClick>
      {!loading && !showSuccess ? (
        <CustomDialogTitle title={messages['app.wizard.mintItems']} />
        
      ) : null}
      {showSuccess ? (
        <DialogContent>
          <Box py={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <CheckCircleIcon style={{fontSize: theme.spacing(18)}} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5' align='center'>
                  <IntlMessages id='app.wizard.itemsMinted' />
                </Typography>
                <Typography variant='body1' align='center'>
                  <IntlMessages id='app.wizard.itemsMintedSuccessfully' />
                </Typography>
              </Grid>
              {mintTransactionHash && chainId ? (
                <Grid item xs={12}>
                  <Button
                    target='_blank'
                    href={getTransactionScannerUrl(
                      chainId,
                      mintTransactionHash,
                    )}
                    color='primary'
                    variant='outlined'
                    fullWidth>
                    <IntlMessages id='app.wizard.viewTransaction' />
                  </Button>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Button onClick={handleCancel} color='primary' fullWidth>
                  <IntlMessages id='app.wizard.close' />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      ) : null}
      {loading ? (
        <DialogContent>
          <Box py={4}>
            <Grid container spacing={4}>
              <Grid xs={12}>
                <Box display='flex' justifyContent='center'>
                  <CircularProgress size={theme.spacing(18)} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5' align='center'>
                  <IntlMessages id='app.wizard.mintingItems' />
                </Typography>
                <Typography variant='body1' align='center'>
                  <IntlMessages id='app.wizard.pleaseSignTheTransactionInYourWalletAndWait' />
                </Typography>
              </Grid>
              {errorMessage ? (
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    alignContent='center'
                    flexDirection='column'>
                    <Box mb={2}>
                      <Typography gutterBottom variant='body1' color='error'>
                        {errorMessage}
                      </Typography>
                    </Box>
                    <Button onClick={handleTryAgain} color='primary'>
                      <IntlMessages id='app.wizard.tryAgain' />
                    </Button>
                  </Box>
                </Grid>
              ) : null}
              {mintTransactionHash && chainId ? (
                <Grid item xs={12}>
                  <Button
                    target='_blank'
                    href={getTransactionScannerUrl(
                      chainId,
                      mintTransactionHash,
                    )}
                    color='primary'
                    variant='outlined'
                    fullWidth>
                    <IntlMessages id='app.wizard.viewTransaction' />
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        </DialogContent>
      ) : null}

      {!showSuccess && !loading ? (
        <>
          <DialogContent dividers>
            <Grid container spacing={4}>
              {items.map((item: CollectionItemData, index: number) => (
                <Grid item xs={12} key={index}>
                  <CollectionItem
                    variant='outlined'
                    item={item}
                    onChange={handleItemChange}
                    onRemove={handleRemove}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  onClick={handleAddItem}
                  variant='outlined'
                  color='primary'>
                  <IntlMessages id='app.wizard.addItem' />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={hasInvalidItems()}
              onClick={handleConfirm}
              variant='contained'
              color='primary'>
              <IntlMessages id='app.wizard.mintItems' />
            </Button>
            <Button onClick={handleCancel} variant='contained'>
              <IntlMessages id='app.wizard.cancel' />
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};
