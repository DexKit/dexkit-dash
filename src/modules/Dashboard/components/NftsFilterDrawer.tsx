import React, {useCallback} from 'react';
import {
  Drawer,
  Grid,
  Box,
  Divider,
  Typography,
  Chip,
  IconButton,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import {useCustomNetworkList} from 'hooks/network';

import CloseIcon from '@material-ui/icons/Close';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import {GET_CHAIN_ID_NAME_V2} from 'shared/constants/Blockchain';

export interface Props {
  open: boolean;
  onClose: () => void;
  params?: any;
  onChangeParams: (params: any) => void;
}

export const NftsFilterDrawer: React.FC<Props> = ({
  open,
  onClose,
  onChangeParams,
  params,
}) => {
  const {networks} = useCustomNetworkList();

  const handleChangeNetwork = useCallback(
    (chainId: number) => {
      if (params.chainId === chainId) {
        onChangeParams({...params, chainId: undefined});
      } else {
        onChangeParams({...params, chainId});
      }
    },
    [params, onChangeParams],
  );

  return (
    <Drawer open={open} anchor='right' onClose={onClose}>
      <Box p={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box mb={2}>
              <Grid container justify='space-between' alignItems='center'>
                <Grid item>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <FilterSearchIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>
                        <IntlMessages id='app.dashboard.filter' />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton size='small' onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom variant='body1'>
              <IntlMessages id='app.dashboard.network' />
            </Typography>

            <Box py={4}>
              <Grid container spacing={2}>
                {[...networks.map((n) => n.chainId), 1, 56, 137].map(
                  (chainId: number, index: number) => (
                    <Grid item key={index}>
                      <Chip
                        variant={
                          params.chainId === chainId ? 'default' : 'outlined'
                        }
                        label={GET_CHAIN_ID_NAME_V2(chainId, networks)}
                        onClick={() => handleChangeNetwork(chainId)}
                      />
                    </Grid>
                  ),
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default NftsFilterDrawer;
