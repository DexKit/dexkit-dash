import React, {useCallback, useContext} from 'react';
import {renderRoutes} from 'react-router-config';
import routes from '../../../../modules';
import {Suspense} from '../../../index';
import {
  Grid,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import useStyles from './index.style';
import AppContext from '../../../utility/AppContext';
import AppContextPropsType from '../../../../types/AppContextPropsType';
import {BottomDrawer} from 'shared/components/BottomDrawer';
import Accounts from 'shared/components/Accounts';
import CloseIcon from '@material-ui/icons/Close';

import {ReactComponent as WalletSearchIcon} from 'assets/images/icons/wallet-search.svg';
import {useAccountsModal} from 'hooks/useAccountsModal';
import {useWelcomeModal} from 'hooks/useWelcomeModal';
import {TransactionConfirmDialog} from 'shared/components/TransactionConfirmDialog';

import WelcomeDialog from 'shared/components/WelcomeDialog';
import {useAppGlobalState} from 'hooks/useGlobalState';
import SignDataDialog from 'shared/components/SignDataDialog';
import clsx from 'clsx';

interface EmptyLayoutProps {
  props?: any;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = (props) => {
  const {footer, themeStyle} = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles({footer, themeStyle});

  const accountsModal = useAccountsModal();
  const welcomeModal = useWelcomeModal();

  const handleCloseAccounts = useCallback(() => {
    accountsModal.setShow(false);
  }, [accountsModal]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseWelcome = useCallback(() => {
    welcomeModal.toggle();
  }, [welcomeModal]);

  const globalState = useAppGlobalState();

  return (
    <>
      <TransactionConfirmDialog
        open={globalState.showTransactionModal}
        onCancel={globalState.handleTransactionCancel}
        data={globalState.data}
        onConfirm={globalState.handleTransactionConfirm}
      />
      <SignDataDialog
        dialogProps={{
          open: globalState.showSignDataDialog,
          maxWidth: 'xs',
          fullWidth: true,
        }}
        signData={globalState.signData}
        onConfirm={globalState.handleSignConfirm}
        onCancel={globalState.handleSignCancel}
      />
      <WelcomeDialog onClose={handleCloseWelcome} open={welcomeModal.show} />
      <Box className={clsx(classes.appMain)}>
        {isMobile ? (
          <BottomDrawer open={accountsModal.showAccounts} anchor='bottom'>
            <Box className={isMobile ? classes.accountsFixedHeight : undefined}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    alignContent='center'>
                    <Box>
                      <Grid
                        alignContent='center'
                        container
                        alignItems='center'
                        spacing={2}>
                        <Grid item>
                          <WalletSearchIcon />
                        </Grid>
                        <Grid item>
                          <Typography variant='body1'>Accounts</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <IconButton onClick={handleCloseAccounts} size='small'>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Accounts />
                </Grid>
              </Grid>
            </Box>
          </BottomDrawer>
        ) : (
          <Dialog open={accountsModal.showAccounts}>
            <DialogTitle>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'>
                <Box>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item>
                      <WalletSearchIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>Accounts</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <IconButton onClick={handleCloseAccounts} size='small'>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent className={classes.accountsDialgContent}>
              <Accounts />
            </DialogContent>
          </Dialog>
        )}

        <Suspense>{renderRoutes(routes)}</Suspense>
      </Box>
    </>
  );
};

export default EmptyLayout;
