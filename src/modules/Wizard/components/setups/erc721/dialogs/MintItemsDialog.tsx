import React, {useState, useEffect, useCallback} from 'react';
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

  const {getWeb3, chainId} = useWeb3();

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
  }, [items]);

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
    [items],
  );

  const mintItems = useCallback(
    async (contractAddress: string, hashes: string[]) => {
      let web3 = getWeb3();

      if (web3 && userDefaultAcount) {
        let contract = new web3.eth.Contract(ERC721Abi, contractAddress);

        let paramItems = hashes.map((hash: string) => {
          return {
            to: userDefaultAcount,
            tokenURI: hash,
          };
        });

        await contract.methods
          .multiSafeMint(paramItems)
          .send({
            from: userDefaultAcount,
          })
          .on('error', (err: any) => {})
          .on('transactionHash', (transactionHash: string) => {
            setMintTransactionHash(transactionHash);
          })
          .on('receipt', (receipt: any) => {})
          .on('confirmation', (confirmationNumber: number, receipt: any) => {})
          .then(function (result: any) {
            console.log(result);
          });
      }
    },
    [userDefaultAcount, getWeb3, items],
  );

  const handleConfirm = useCallback(async () => {
    setLoading(true);

    let itemImagesHashes = await uploadImages();

    let itemsHashes = await sendItemsMetadata(itemImagesHashes);

    await mintItems(contractAddress, itemsHashes);

    setShowSuccess(true);
    setLoading(false);
  }, [contractAddress, getWeb3, items, onFinish]);

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

  return (
    <Dialog {...props}>
      <DialogTitle>Mint items</DialogTitle>
      {showSuccess ? (
        <DialogContent>
          <Box py={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box py={4} display='flex' justifyContent='center'>
                  <CheckCircleIcon style={{fontSize: theme.spacing(18)}} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5' align='center'>
                  Items minted
                </Typography>
                <Typography variant='body1' align='center'>
                  Items minted successfully
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
                    View transaction
                  </Button>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Button onClick={handleCancel} color='primary' fullWidth>
                  Close
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
                <Box py={4} display='flex' justifyContent='center'>
                  <CircularProgress size={theme.spacing(18)} />
                </Box>
              </Grid>
              <Grid xs={12}>
                <Typography variant='h5' align='center'>
                  Minting items
                </Typography>
                <Typography variant='body1' align='center'>
                  Please, sign the transaction in your wallet and wait for
                  confirmation.
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
                    View transaction
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
                  Add item
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
              Mint items
            </Button>
            <Button onClick={handleCancel} variant='contained'>
              Cancel
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};
