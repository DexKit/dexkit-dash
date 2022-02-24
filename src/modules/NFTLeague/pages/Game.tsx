import {Grid} from '@material-ui/core';
import React from 'react';
import {useIntl} from 'react-intl';
import {useParams} from 'react-router';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import GameInProgress from '../components/GameInProgress';
import {useGameOnChain} from '../hooks/useGameOnChain';

interface Params {
  id: string;
}

export const NFTLeagueGame = () => {
  const {id} = useParams<Params>();

  const {messages} = useIntl();

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PageHeader
            backUri='/nft-league'
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
          <GameInProgress id={id} />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default NFTLeagueGame;
