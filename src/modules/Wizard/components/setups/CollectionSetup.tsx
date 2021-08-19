import {
  Button,
  Grid,
  Card,
  Paper,
  CardContent,
  TextField,
  InputAdornment,
  Tooltip,
  Box,
  Accordion,
  AccordionSummary,
  IconButton,
  FormControlLabel,
  Typography,
  Switch,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import React, {useCallback, useState, useEffect} from 'react';
import MainLayout from 'shared/components/layouts/main';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from 'react-router';
import DialogPortal from 'shared/components/Common/DialogPortal';
import ConfirmDialog from './erc721/ConfirmDialog';
import {useFormik} from 'formik';
import {
  CollectionItemData,
  CollectionSetupSteps,
  ContractStatus,
  Erc721Data,
} from 'modules/Wizard/types';
import {useWeb3} from 'hooks/useWeb3';
import DeployingDialog from './erc721/DeployingDialog';
import DeployErrorDialog from './erc721/DeployErrorDialog';
import DeploySuccessDialog from './erc721/DeploySuccessDialog';

import SolcWorker from 'worker-loader!../../solc.worker'; // eslint-disable-line
import Web3 from 'web3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Contract} from 'web3-eth-contract';
import CollectionItem from './erc721/CollecttionItem';
import ImageUploadButton from './erc721/ImageUploadButton';
import ItemsStep from './erc721/steps/ItemsStep';
import CollectionStep from './erc721/steps/CollectionStep';
import DeployStep from './erc721/steps/DeployStep';
import {useWizardApi} from 'modules/Wizard/hooks';
import CreatingCollectionDialog from './erc721/dialogs/CreatingCollectionDialog';
import {String} from 'lodash';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';
import {useDispatch} from 'react-redux';
import {addCollection} from 'redux/_wizard/actions';

export interface CollectionSetupProps {}

export const CollectionSetup = (props: CollectionSetupProps) => {
  const history = useHistory();

  const dispatch = useDispatch();

  const userDefaultAcount = useDefaultAccount();
  const {getWeb3} = useWeb3();

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
      let web3 = getWeb3();

      let promise = new Promise<string>((resolve, reject) => {
        if (userDefaultAcount) {
          let worker: Worker = new SolcWorker();

          worker.postMessage({
            action: 'compile',
            contract: 'erc721',
          });

          worker.addEventListener('message', async (event) => {
            if (event.data.cmd === 'compiled') {
              if (web3) {
                let contract = new web3.eth.Contract(event.data.abi);

                console.log(event.data.abi);

                let contractDeploy = contract.deploy({
                  data: event.data.bytecode,
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
        }
      });

      return promise;
    },
    [userDefaultAcount, getWeb3, values, items],
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
  }, [items, handleItemChange]);

  const uploadCollectionImage = useCallback(async (): Promise<
    string | null
  > => {
    if (collectionImage) {
      let response = await wizardApi.uploadImage(collectionImage);

      return response.data.hash;
    }

    return null;
  }, [collectionImage]);

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
    [values, userDefaultAcount],
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

  const mintItems = useCallback(
    async (contractAddress: string, hashes: string[]) => {
      let web3 = getWeb3();

      if (web3 && userDefaultAcount) {
        let contract = new web3.eth.Contract(ERC721Abi, contractAddress);
        debugger;

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
          .on('receipt', (receipt: any) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber: number, receipt: any) => {})
          .then(function (newContractInstance: any) {
            console.log(newContractInstance);
          });
      }
    },
    [userDefaultAcount, getWeb3, items],
  );

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

      let itemsHashes = await sendItemsMetadata(itemImagesHashes);

      setContractStatus(ContractStatus.CreateCollection);

      if (collectionMetadataHash) {
        let address = await createContract(collectionMetadataHash);

        dispatch(
          addCollection({
            name: values.name,
            description: values.description,
            address,
            abi: ERC721Abi,
            imageUrl: `https://ipfs.io/ipfs/${collectionImagehash}`,
          }),
        );

        setContractAddress(address);

        setContractStatus(ContractStatus.Minting);

        await mintItems(address, itemsHashes);

        setContractStatus(ContractStatus.Finalized);
      }
    }
  }, [
    values,
    items,
    dispatch,
    createContract,
    uploadCollectionImage,
    uploadImages,
  ]);

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
        />
      </DialogPortal>
      <Grid container spacing={4} justify='center'>
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
