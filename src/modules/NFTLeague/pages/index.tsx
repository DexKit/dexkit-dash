import {Grid} from '@material-ui/core';
import React from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';

export const NFTLeagueIndex = () => {
  const {messages} = useIntl();

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PageHeader
            backUri='/'
            title={messages['nftLeague.games'] as string}
            breadcrumbs={[
              {caption: 'Wallet', uri: '/'},
              {caption: 'NFT League', uri: '/nft-league'},
            ]}
          />
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </MainLayout>
  );
};

export default NFTLeagueIndex;
