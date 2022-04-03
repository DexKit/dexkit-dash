import {Grid} from '@material-ui/core';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import MyGamesTable from 'modules/SquidLeague/components/MyGamesTable';
import React from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

export const MyGames = () => {
  const {formatMessage} = useIntl();
  const account = useDefaultAccount();

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PageHeader
            useBackUriFromRouter={true}
            title={formatMessage({
              id: 'squidLeague.mygames',
              defaultMessage: 'My Games',
            })}
            breadcrumbs={[
              {caption: 'Wallet', uri: '/'},
              {caption: 'Squid League', uri: SQUIDLEAGUE_ROUTE},
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <MyGamesTable account={account} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default MyGames;
