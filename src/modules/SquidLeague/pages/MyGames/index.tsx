import {Grid} from '@material-ui/core';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import MyGamesTable from 'modules/SquidLeague/components/MyGamesTable';
import {SQUID_LEAGUE_SUPPORTED_NETWORKS} from 'modules/SquidLeague/constants';
import {isSupportedBlockchain} from 'modules/SquidLeague/utils/blockchain';
import React from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import NetworkSupportCard from 'shared/components/NetworkSupportCard';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

export const MyGames = () => {
  const {formatMessage} = useIntl();
  const {chainId} = useWeb3();
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
        {!isSupportedBlockchain(chainId) && (
          <Grid item xs={12}>
            <NetworkSupportCard
              supportedChains={SQUID_LEAGUE_SUPPORTED_NETWORKS}
            />
          </Grid>
        )}
        {isSupportedBlockchain(chainId) && (
          <Grid item xs={12}>
            <MyGamesTable account={account} />
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
};

export default MyGames;
