import {
  Grid,
  Box,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Typography,
  Tooltip,
  Link,
} from '@material-ui/core';
import Web3 from 'web3';

import React, {useCallback, useState} from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from 'react-router';
import DialogPortal from 'shared/components/Common/DialogPortal';
import ConfirmDialog from './erc721/ConfirmDialog';
import {
  CollectionItemData,
  CollectionSetupSteps,
  ContractStatus,
} from 'modules/Wizard/types';
import {useWeb3} from 'hooks/useWeb3';

import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Contract} from 'web3-eth-contract';
import ItemsStep from './erc721/steps/ItemsStep';
import CollectionStep from './erc721/steps/CollectionStep';
import DeployStep from './erc721/steps/DeployStep';
import {useWizardApi} from 'modules/Wizard/hooks';
import CreatingCollectionDialog from './erc721/dialogs/CreatingCollectionDialog';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';
import {useDispatch} from 'react-redux';
import {addCollection} from 'redux/_wizard/actions';
import {ethers} from 'ethers';
import {Link as RouterLink} from 'react-router-dom';
import axios from 'axios';

import GitHubIcon from '@material-ui/icons/GitHub';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

const ERC721_CONTRACT_DATA_URL =
  'https://raw.githubusercontent.com/DexKit/wizard-contracts/main/artifacts/contracts/ERC721_BASE.sol/COLLECTION.json';

export interface CollectionSetupProps {}

export const CollectionSetup = (props: CollectionSetupProps) => {
  const history = useHistory();
  const [createError, setCreateError] = useState<string>();
  const [mintError, setMintError] = useState<string>();

  const dispatch = useDispatch();

  const userDefaultAcount = useDefaultAccount();
  const {getWeb3, getProvider, chainId} = useWeb3();

  const [step, setStep] = useState<CollectionSetupSteps>(
    CollectionSetupSteps.Collection,
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [values, setValues] = useState({
    name: '',
    symbol: '',
    description: '',
    url: '',
  });

  const [collectionImage, setCollectionImage] = useState<File | null>(null);

  const [transactionHash, setTransactionHash] = useState('');
  const [mintTransactionHash, setMintTransactionHash] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const [items, setItems] = useState<CollectionItemData[]>([]);

  const wizardApi = useWizardApi();

  const createContract = useCallback(
    async (contractURI: string) => {
      let promise = new Promise<string>(async (resolve, reject) => {
        if (userDefaultAcount) {
          let web3 = new Web3(getProvider());
          if (web3) {
            let response = await axios.get(ERC721_CONTRACT_DATA_URL);

            let contractData = response.data;

            let contract = new web3.eth.Contract(contractData.abi);

            let contractDeploy = contract.deploy({
              data: contractData.bytecode,
              arguments: [values.name, values.symbol, contractURI],
            });

            await contractDeploy
              .send({
                from: userDefaultAcount,
              })
              .on('transactionHash', (transactionHash: string) => {
                setTransactionHash(transactionHash);
              })
              .on('confirmation', () => {})
              .on('error', (reason) => {
                reject(reason);
              })
              .then((contract: Contract) => {
                resolve(contract.options.address);
              });
          }
        }
      });
      return promise;
    },
    [userDefaultAcount, getWeb3, values, items, getProvider, wizardApi],
  );

  const handleBack = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  const handleDialogCancel = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleItemChange = useCallback(
    (item: CollectionItemData) => {
      let newItems = [...items];

      let index = newItems.findIndex((i) => i.id === item.id);

      newItems[index] = item;

      setItems(newItems);
    },
    [items],
  );

  const handleRemove = useCallback(
    (item: CollectionItemData) => {
      let newItems = [...items];

      let index = newItems.findIndex((i) => i.id === item.id);

      newItems.splice(index, 1);

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values, [e.target.name]: e.target.value});
    },
    [values],
  );

  const handleImageChange = useCallback((file: File | null) => {
    setCollectionImage(file);
  }, []);

  const handleGoItems = useCallback(() => {
    setStep(CollectionSetupSteps.Items);
  }, []);

  const handleGoCollection = useCallback(() => {
    setStep(CollectionSetupSteps.Collection);
  }, []);

  const handleGoDeploy = useCallback(() => {
    setStep(CollectionSetupSteps.Deploy);
  }, []);

  const handleFinalize = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const [uploadId, setUploadId] = useState('');

  const [creatingCollection, setCreatingCollection] = useState(false);

  const [contractStatus, setContractStatus] = useState(
    ContractStatus.UploadImages,
  );

  const uploadImages = useCallback(async (): Promise<any> => {
    let images: any = {};

    for (let item of items) {
      if (item.image) {
        setUploadId(item.id);
        let response = await wizardApi.uploadImage(item.image);

        images[item.id] = response.data.hash;
      }
    }

    setUploadId('');

    return images;
  }, [items, handleItemChange, wizardApi]);

  const uploadCollectionImage = useCallback(async (): Promise<
    string | null
  > => {
    if (collectionImage) {
      let response = await wizardApi.uploadImage(collectionImage);

      return response.data.hash;
    }

    return null;
  }, [collectionImage, wizardApi]);

  const sendCollectionMetadata = useCallback(
    async (imageHash: string): Promise<string | null> => {
      if (userDefaultAcount) {
        let response = await wizardApi.sendCollectionMetadata({
          description: values.description,
          external_link: values.url,
          image: `ipfs://${imageHash}`,
          name: values.name,
          fee_recipient: userDefaultAcount,
          seller_fee_basis_points: 100,
        });

        return response.data.hash;
      }

      return null;
    },
    [values, userDefaultAcount, wizardApi],
  );

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

  // TODO: remove duplace
  const mintItems = useCallback(
    async (contractAddress: string, hashes: string[]) => {
      if (userDefaultAcount) {
        let provider = new ethers.providers.Web3Provider(getProvider());

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

        let result = await contract.multiSafeMint(paramItems);

        setMintTransactionHash(result.hash);

        await result.wait();
      }
    },
    [userDefaultAcount, getProvider],
  );

  const [tempItemsHashes, setTempItemsHashes] = useState<any>();
  const [tempCollectionMetaData, setTempCollectionMetadata] = useState<any>();
  const [tempCollectionImagehash, setCollectionImagehash] = useState<string>();
  const [tempAddress, setTempAddress] = useState<string>();

  // const clearCreateTryAgain = useCallback(() => {
  //   setTempItemsHashes(undefined);
  //   setTempCollectionMetadata(undefined);
  //   setCollectionImagehash(undefined);
  // }, []);

  const handleCreateTryAgain = useCallback(() => {
    setCreateError(undefined);

    createContract(tempCollectionMetaData)
      .then((address) => {
        setTempAddress(address);

        dispatch(
          addCollection({
            name: values.name,
            description: values.description,
            address,
            abi: ERC721Abi,
            imageUrl: `https://ipfs.io/ipfs/${tempCollectionImagehash}`,
            chainId: chainId,
          }),
        );

        setContractAddress(address);

        if (items.length > 0) {
          setContractStatus(ContractStatus.Minting);
          mintItems(address, tempItemsHashes)
            .then(() => {
              setContractStatus(ContractStatus.Finalized);
            })
            .catch((err) => {
              setMintError(err.message);
            });
        } else {
          setContractStatus(ContractStatus.Finalized);
        }
      })
      .catch((err) => {
        setCreateError(err.message);
      });
  }, [
    chainId,
    items,
    tempItemsHashes,
    tempCollectionImagehash,
    tempCollectionMetaData,
  ]);

  const handleMintItemsTryAgain = useCallback(() => {
    setMintError(undefined);

    if (items.length > 0 && tempAddress) {
      setContractStatus(ContractStatus.Minting);
      mintItems(tempAddress, tempItemsHashes)
        .then(() => {
          setContractStatus(ContractStatus.Finalized);
        })
        .catch((err) => {
          setMintError(err.message);
        });
    } else {
      setContractStatus(ContractStatus.Finalized);
    }
  }, [items, tempAddress, tempItemsHashes]);

  const handleConfirmFinalize = useCallback(async () => {
    setShowConfirmDialog(false);
    setCreatingCollection(true);

    let collectionImagehash = await uploadCollectionImage();

    let itemImagesHashes = await uploadImages();

    setContractStatus(ContractStatus.UploadMetadata);

    if (collectionImagehash) {
      let collectionMetadataHash = await sendCollectionMetadata(
        collectionImagehash,
      );

      setCollectionImagehash(collectionImagehash);

      setTempCollectionMetadata(collectionMetadataHash);

      let itemsHashes = await sendItemsMetadata(itemImagesHashes);

      setTempItemsHashes(itemsHashes);

      setContractStatus(ContractStatus.CreateCollection);

      if (collectionMetadataHash) {
        await createContract(collectionMetadataHash)
          .then((address) => {
            setTempAddress(address);

            dispatch(
              addCollection({
                name: values.name,
                description: values.description,
                address,
                abi: ERC721Abi,
                imageUrl: `https://ipfs.io/ipfs/${collectionImagehash}`,
                chainId: chainId,
              }),
            );

            setContractAddress(address);

            if (items.length > 0) {
              setContractStatus(ContractStatus.Minting);
              mintItems(address, itemsHashes)
                .then(() => {
                  setContractStatus(ContractStatus.Finalized);
                })
                .catch((err) => {
                  setMintError(err.message);
                });
            } else {
              setContractStatus(ContractStatus.Finalized);
            }
          })
          .catch((err) => {
            setCreateError(err.message);
          });
      }
    }
  }, [
    chainId,
    values,
    items,
    dispatch,
    createContract,
    uploadCollectionImage,
    uploadImages,
  ]);

  const handleOpenGithub = useCallback(() => {
    window.open('https://github.com/DexKit/wizard-contracts', '_blank');
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    history.push('/wizard');
  }, [history]);

  return (
    <>
      <DialogPortal>
        <ConfirmDialog
          open={showConfirmDialog}
          onConfirm={handleConfirmFinalize}
          onCancel={handleDialogCancel}
        />
        <CreatingCollectionDialog
          step={contractStatus}
          open={creatingCollection}
          contractAddress={contractAddress}
          contractTransaction={transactionHash}
          mintTransaction={mintTransactionHash}
          maxWidth='sm'
          fullWidth
          onClose={handleCloseCreateDialog}
          skipMinting={items.length === 0}
          createError={createError}
          mintError={mintError}
          onTryCreateCollectionAgain={handleCreateTryAgain}
          onTryMintAgain={handleMintItemsTryAgain}
        />
      </DialogPortal>
      <Grid container spacing={4} justify='center'>
        <Grid item xs={12} sm={10}>
          <Grid
            container
            justify='space-between'
            alignItems='center'
            alignContent='center'>
            <Grid item>
              <Box mb={2}>
                <Breadcrumbs>
                  <Link color='inherit' to='/' component={RouterLink}>
                    <Typography variant='body1'>Dashboard</Typography>
                  </Link>
                  <Link color='inherit' to='/wizard' component={RouterLink}>
                    <Typography variant='body1'>Wizard</Typography>
                  </Link>
                </Breadcrumbs>
              </Box>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  mr={2}
                  display='flex'
                  alignItems='center'
                  alignContent='center'>
                  <IconButton to='/wizard' component={RouterLink} size='small'>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography color='inherit' variant='h5'>
                  Create collection
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Tooltip title='View source on GitHub'>
                <RoundedIconButton onClick={handleOpenGithub}>
                  <GitHubIcon />
                </RoundedIconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Paper>
            <Stepper activeStep={step} alternativeLabel>
              <Step>
                <StepLabel>Collection description</StepLabel>
              </Step>
              <Step>
                <StepLabel>Add items</StepLabel>
              </Step>
              <Step>
                <StepLabel>Create collection</StepLabel>
              </Step>
            </Stepper>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {step === CollectionSetupSteps.Collection ? (
            <CollectionStep
              values={values}
              collectionImage={collectionImage}
              onBack={handleBack}
              onNext={handleGoItems}
              onChange={handleChange}
              onImageChange={handleImageChange}
            />
          ) : null}
          {step === CollectionSetupSteps.Items ? (
            <ItemsStep
              values={values}
              items={items}
              onChange={handleItemChange}
              onRemove={handleRemove}
              onAddItem={handleAddItem}
              onBack={handleGoCollection}
              onNext={handleGoDeploy}
            />
          ) : null}
          {step == CollectionSetupSteps.Deploy ? (
            <DeployStep
              values={values}
              onBack={handleGoItems}
              onFinalize={handleFinalize}
              items={items}
              uploadId={uploadId}
            />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default CollectionSetup;
