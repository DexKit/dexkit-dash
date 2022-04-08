import {Grid} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import React from 'react';
import {useIntl} from 'react-intl';
import {useParams} from 'react-router';
import MainLayout from 'shared/components/layouts/main';
import {NetworkSupportCard} from 'shared/components/NetworkSupportCard';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import GameInProgress from '../components/GameInProgress';
import {NFT_LEAGUE_SUPPORTED_NETWORKS} from '../constants';
import {isSupportedBlockchain} from '../utils/blockchain';

interface Params {
  id: string;
}

export const NFTLeagueGame = () => {
  const {id} = useParams<Params>();
  const {chainId} = useWeb3();

  const {messages} = useIntl();

  return (
    <>
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              useBackUriFromRouter={true}
              title={`${messages['nftLeague.game']} #${id}`}
              breadcrumbs={[
                {caption: messages['app.dashboard.wallet'] as string, uri: '/'},
                {
                  caption: 'NFT League',
                  uri: '/nft-league',
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            {!isSupportedBlockchain(chainId) && (
              <NetworkSupportCard
                supportedChains={NFT_LEAGUE_SUPPORTED_NETWORKS}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {isSupportedBlockchain(chainId) && <GameInProgress id={id} />}
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default NFTLeagueGame;
