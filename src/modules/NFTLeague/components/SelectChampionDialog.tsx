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
  Box,
} from '@material-ui/core';

import React, {useCallback, useState} from 'react';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import ImageIcon from '@material-ui/icons/Image';
import {useIntl} from 'react-intl';
import {CoinLeaguesChampion} from 'modules/CoinLeagues/utils/types';

import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {GET_CHAMPIONS_CONTRACT_ADDR} from 'modules/CoinLeagues/utils/champions';
import {useMyChampions} from 'modules/CoinLeagues/hooks/champions';

import ChampionCard from './ChampionCard';

interface Props {
  dialogProps: DialogProps;
  onSelect?: (params: {
    contractAddress: string;
    tokenId: string;
    image: string;
    rarity?: number;
  }) => void;
  address: string;
}

export const SelectChampionDialog: React.FC<Props> = ({
  dialogProps,
  onSelect,
  address,
}) => {
  const {chainId} = useLeaguesChainInfo();

  const myChampions = useMyChampions({chainId});

  const {messages} = useIntl();

  const [selectedAsset, setSelectedAsset] = useState<{
    contractAddress: string;
    tokenId: string;
    image: string;
    rarity?: number;
  }>();

  const {onClose} = dialogProps;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setSelectedAsset(undefined);
    }
  }, [onClose]);

  const handleSelectAsset = useCallback(
    (asset: {
      contractAddress: string;
      tokenId: string;
      image: string;
      rarity?: number;
    }) => {
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
          <ChampionCard />
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
                <IntlMessages id='nftLeague.noChampionsYet' />
              </Typography>
              <Typography align='center' variant='body1' color='textSecondary'>
                <IntlMessages id='nftLeague.youDontHaveAnyChampionsYou' />
              </Typography>
            </Grid>
            <Grid item>
              <Button
                href='/coin-league/champions/event'
                target='_blank'
                rel='noopener noreferrer'
                variant='outlined'
                color='primary'>
                <IntlMessages id='nftLeague.mintChampion' />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return myChampions.data?.map(
        (champion: CoinLeaguesChampion, index: number) => (
          <Grid item xs={6} sm={3} key={index}>
            <ChampionCard
              selected={selectedAsset?.tokenId === champion.id}
              onClick={handleSelectAsset}
              image={champion.image}
              name={champion.name}
              tokenId={champion.id}
              rarity={champion.rarity}
              contractAddress={GET_CHAMPIONS_CONTRACT_ADDR(chainId)}
            />
          </Grid>
        ),
      );
    }
    // eslint-disable-next-line
  }, [String(myChampions.data), selectedAsset, chainId, handleSelectAsset]);

  const handleConfirm = useCallback(() => {
    if (onSelect && selectedAsset) {
      onSelect(selectedAsset);
    }
  }, [onSelect, selectedAsset]);

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        icon={<ImageIcon />}
        title={messages['nftLeague.selectChampion'] as string}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Box py={4}>
          <Grid container spacing={4}>
            {renderChampions()}
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
          <IntlMessages id='nftLeague.confirm' />
        </Button>
        <Button onClick={handleClose}>
          <IntlMessages id='nftLeague.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(SelectChampionDialog);
