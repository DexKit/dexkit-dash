import React, {useCallback, useState} from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import {RouteComponentProps, useHistory} from 'react-router-dom';
import {useWeb3} from 'hooks/useWeb3';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {Token} from 'types/app';

import {useDispatch} from 'react-redux';

import {useDefaultAccount} from 'hooks/useDefaultAccount';

import {ReactComponent as ArrowLeftIcon} from '../../../../../assets/images/icons/arrow-left.svg';
import {useCollectionIds} from 'hooks/balance/useCollectionIds';
import {useNFTMetadataURI} from 'hooks/nfts/useNFTMetadataURI';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const WalletOverviewCollectionPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
  const {getProvider} = useWeb3();

  const dispatch = useDispatch();
  const {messages} = useIntl();

  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account: string | undefined = defaultAccount || web3Account || '';

  const tokenIdsQuery = useCollectionIds(address, networkName);

  const metadataQuery = useNFTMetadataURI(
    address,
    networkName,
    tokenIdsQuery.data,
  );

  const [token, setToken] = useState<Token>();

  const history = useHistory();

  const handleBack = useCallback(() => history.push(`/wallet/`), []);

  const [showSelectTokens, setShowSelectTokens] = useState(false);

  return (
    <Box py={4}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid
            container
            justify='space-between'
            alignItems='center'
            spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs aria-label='breadcrumb'>
                <Typography variant='body2' color='textSecondary'>
                  <IntlMessages id='app.dashboard.wallet' />
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <IntlMessages id='app.dashboard.overview' />
                </Typography>
                <Typography variant='body2' color='textSecondary' />
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <IconButton onClick={handleBack} size='small'>
                    <ArrowLeftIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {metadataQuery?.data?.map((d) => (
              <p>{d.image} </p>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WalletOverviewCollectionPage;
