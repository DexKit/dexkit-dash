import React, {useCallback, useContext} from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import {ContentView} from '../../../index';
import {
  Grid,
  Box,
  Hidden,
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
import AppFixedFooter from './AppFixedFooter';
import AppContext from '../../../utility/AppContext';
import clsx from 'clsx';
import {LayoutType} from '../../../../shared/constants/AppEnums';
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
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

interface MiniSidebarToggleProps {
  props?: any;
}

const MiniSidebarToggle: React.FC<MiniSidebarToggleProps> = (props) => {
  const {footer, themeStyle, layoutType, footerType} =
    useContext<AppContextPropsType>(AppContext);
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
  const {messages} = useIntl();
  return (
    <>
      <TransactionConfirmDialog
        open={globalState.showTransactionModal}
        onCancel={globalState.handleTransactionCancel}
        data={globalState.data}
        onConfirm={globalState.handleTransactionConfirm}
      />
      <WelcomeDialog onClose={handleCloseWelcome} open={welcomeModal.show} />
      <Box
        className={clsx(
          classes.appMain,
          layoutType === LayoutType.BOXED ? classes.boxedLayout : '',
          {
            appMainFooter: footer && footerType === 'fluid',
            appMainFixedFooter: footer && footerType === 'fixed',
          },
        )}>
        <AppSidebar />
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
            <CustomDialogTitle
              title={messages['app.appLayout.accounts']}
              icon={<WalletSearchIcon />}
              onClose={handleCloseAccounts}
            />

            <Divider />
            <DialogContent className={classes.accountsDialgContent}>
              <Accounts />
            </DialogContent>
          </Dialog>
        )}

        <Box className={clsx(classes.mainContent, 'main-content')}>
          <Hidden mdDown>
            <Box className={classes.mainContainer}>
              <AppHeader />
              <ContentView />
              <AppFixedFooter />
            </Box>
          </Hidden>
          <Hidden lgUp>
            <Box className={classes.mainContainerFull}>
              <AppHeader />
              <ContentView />
              <AppFixedFooter />
            </Box>
          </Hidden>
        </Box>
      </Box>
    </>
  );
};

export default MiniSidebarToggle;
