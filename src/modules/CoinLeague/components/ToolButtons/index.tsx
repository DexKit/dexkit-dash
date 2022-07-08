import React from 'react';
import Grid from '@material-ui/core/Grid';
import {useCoinToPlay} from 'modules/CoinLeague/hooks/useCoinToPlay';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeague/utils/constants';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';

interface Props {
  shareText: string;
  coin_to_play?: string;
}

export const ToolButtons = (props: Props) => {
  const {shareText, coin_to_play} = props;
  const {chainId} = useLeaguesChainInfo();
  const coinToPlay = useCoinToPlay(chainId, coin_to_play);
  const currencySymbol = coinToPlay?.symbol || '';

  return (
    <Grid container spacing={4} alignItems='center' alignContent='center'>
      <Grid item>
        <ShareButton shareText={shareText} />
      </Grid>
      <Grid item>
        <BuyCryptoButton
          btnMsg={`Buy ${GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}`}
          defaultCurrency={GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
        />
      </Grid>
      <Grid item>
        <BuyCryptoButton
          btnMsg={`Buy ${currencySymbol || 'USDT'}`}
          defaultCurrency={currencySymbol.toUpperCase() || 'USDT'}
        />
      </Grid>
      <Grid item>
        <MaticBridgeButton />
      </Grid>
    </Grid>
  );
};
