import IntlMessages from '@crema/utility/IntlMessages';
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
  DialogProps,
  Select,
  Box,
  InputLabel,
  FormControl,
  MenuItem,
} from '@material-ui/core';

import React, {useEffect, useCallback, useState} from 'react';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import ImageIcon from '@material-ui/icons/Image';
import {useIntl} from 'react-intl';
import {CoinLeaguesChampion} from 'modules/CoinLeagues/utils/types';

import ProfileImageCard from './ProfileImageCard';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {GET_CHAMPIONS_CONTRACT_ADDR} from 'modules/CoinLeagues/utils/champions';
import {Kittygotchi} from 'types/kittygotchi';
import {GET_KITTYGOTCHI_CONTRACT_ADDR} from 'modules/Kittygotchi/constants';
import {useMyChampions} from 'modules/CoinLeagues/hooks/champions';
import {useKittygotchiList} from 'modules/Kittygotchi/hooks';
import {isAddress} from 'web3-utils';
import {useWeb3} from 'hooks/useWeb3';

interface Props {
  dialogProps: DialogProps;
  onSelect?: (params: {
    contractAddress: string;
    tokenId: string;
    image: string;
  }) => void;
  address: string;
}

const LIST_KITTYGOTCHI = 'LIST_KITTYGOTCHI';
const LIST_CHAMPIONS = 'LIST_CHAMPIONS';

export const ProfileSelectImageDialog: React.FC<Props> = ({
  dialogProps,
  onSelect,
  address,
}) => {
  const {chainId} = useLeaguesChainInfo();

  const myChampions = useMyChampions({chainId});

  const {account} = useWeb3();

  const kittygotchiList = useKittygotchiList(account?.toLowerCase());

  const {messages} = useIntl();

  const [selectedAsset, setSelectedAsset] =
    useState<{contractAddress: string; tokenId: string; image: string}>();
  const [listOption, setListOption] = useState(LIST_CHAMPIONS);

  const {onClose} = dialogProps;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSelectedAsset(undefined);
    }
  }, [onClose]);

  const handleChangeListOption = useCallback((e) => {
    setListOption(e.target.value);
  }, []);

  const handleSelectAsset = useCallback(
    (asset: {contractAddress: string; tokenId: string; image: string}) => {
      if (
        asset.contractAddress === selectedAsset?.contractAddress &&
        asset.tokenId === selectedAsset?.tokenId
      ) {
        setSelectedAsset(undefined);
      } else {
        setSelectedAsset(asset);
      }
    },
    [selectedAsset],
  );

  const renderChampions = useCallback(() => {
    if (!myChampions.data) {
      return new Array(8).fill(null).map((_, index: number) => (
        <Grid item xs={6} sm={3} key={index}>
          <ProfileImageCard />
        </Grid>
      ));
    } else if (myChampions.data?.length === 0) {
      return (
        <Grid item xs={12}>
          <Grid
            container
            direction='column'
            alignItems='center'
            alignContent='center'
            spacing={4}>
            <Grid item xs={12}></Grid>
            <Grid item>
              <Typography align='center' variant='h5'>
                <IntlMessages id='app.coinLeague.noChampionsYet' />
              </Typography>
              <Typography align='center' variant='body1' color='textSecondary'>
                <IntlMessages id='app.coinLeague.youDontHaveAnyChampionsYou' />
              </Typography>
            </Grid>
            {/* <Grid item>
              <Button
                href='/coin-league/champions/event'
                target='_blank'
                rel='noopener noreferrer'
                variant='outlined'
                color='primary'>
                <IntlMessages id='app.coinLeauge.mintChampion' />
              </Button>
           </Grid>*/}
            <Grid item>
              <Box
                display='flex'
                justifyContent='center'
                alignContent='center'
                alignItems='center'>
                <Button
                  href='https://opensea.io/collection/coinleaguechampions'
                  target='_blank'
                  rel='noopener noreferrer'
                  variant='outlined'
                  color='primary'>
                  <IntlMessages
                    id='app.coinLeague.buyOnOpenSea'
                    defaultMessage={'Buy Champion on OpenSea'}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return myChampions.data?.map(
        (champion: CoinLeaguesChampion, index: number) => (
          <Grid item xs={6} sm={3} key={index}>
            <ProfileImageCard
              selected={selectedAsset?.tokenId === champion.id}
              onClick={handleSelectAsset}
              image={champion.image}
              name={champion.name}
              tokenId={champion.id}
              contractAddress={GET_CHAMPIONS_CONTRACT_ADDR(chainId)}
            />
          </Grid>
        ),
      );
    }
    // eslint-disable-next-line
  }, [String(myChampions.data), selectedAsset, chainId, handleSelectAsset]);

  const renderKitties = useCallback(() => {
    if (!kittygotchiList.data) {
      return new Array(8).fill(null).map((_, index: number) => (
        <Grid item xs={6} sm={3} key={index}>
          <ProfileImageCard />
        </Grid>
      ));
    }
    if (kittygotchiList.data.length === 0) {
      return (
        <Grid item xs={12}>
          <Grid
            container
            direction='column'
            alignItems='center'
            alignContent='center'
            spacing={4}>
            <Grid item xs={12}></Grid>
            <Grid item>
              <Typography align='center' variant='h5'>
                <IntlMessages id='app.coinLeague.noKittygotchiYet' />
              </Typography>
              <Typography align='center' variant='body1' color='textSecondary'>
                <IntlMessages id='app.coinLeague.youDontHaveAnyKittygotchi' />
              </Typography>
            </Grid>
            <Grid item>
              <Button
                href='/kittygotchi'
                target='_blank'
                rel='noopener noreferrer'
                variant='outlined'
                color='primary'>
                <IntlMessages id='app.coinLeauge.mintKittygotchi' />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return kittygotchiList.data?.map(
        (kittygotchi: Kittygotchi, index: number) => (
          <Grid item xs={6} sm={3} key={index}>
            <ProfileImageCard
              selected={selectedAsset?.tokenId === kittygotchi.id}
              onClick={handleSelectAsset}
              image={kittygotchi.image}
              name={kittygotchi.name}
              tokenId={kittygotchi.id}
              contractAddress={GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}
            />
          </Grid>
        ),
      );
    }
    // eslint-disable-next-line
  }, [String(kittygotchiList.data), chainId, selectedAsset, handleSelectAsset]);

  const handleConfirm = useCallback(() => {
    if (onSelect && selectedAsset) {
      onSelect(selectedAsset);
    }
  }, [onSelect, selectedAsset]);

  useEffect(() => {
    if (isAddress(address) && listOption === LIST_KITTYGOTCHI) {
      kittygotchiList.get(address);
    }

    // eslint-disable-next-line
  }, [address, listOption]);

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        icon={<ImageIcon />}
        title={messages['app.coinLeague.selectImage'] as string}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Box py={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>
                  <IntlMessages id='app.coinLeague.collection' />
                </InputLabel>
                <Select
                  fullWidth
                  label={<IntlMessages id='app.coinLeague.collection' />}
                  onChange={handleChangeListOption}
                  variant='outlined'
                  value={listOption}>
                  <MenuItem value={LIST_CHAMPIONS}>Champions</MenuItem>
                  <MenuItem value={LIST_KITTYGOTCHI}>Kittygotchi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {listOption === LIST_CHAMPIONS
              ? renderChampions()
              : renderKitties()}
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          disabled={!selectedAsset}
          onClick={handleConfirm}
          color='primary'
          variant='contained'>
          <IntlMessages id='app.coinLeague.confirm' />
        </Button>
        <Button onClick={handleClose}>
          <IntlMessages id='app.coinLeague.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ProfileSelectImageDialog);
