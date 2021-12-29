import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  Typography,
  TableCell,
  Grid,
} from '@material-ui/core';
import moment from 'moment';
import TransactionTableRow from 'modules/Dashboard/components/TransactionTableRow';
import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import IntlMessages from '@crema/utility/IntlMessages';
import {WalletEmptyImage} from 'shared/components/Icons';

export interface Props {}

export const TransactionsTab: React.FC<Props> = () => {
  const {notifications} = useSelector<AppState, AppState['notification']>(
    ({notification}) => ({
      notifications: notification.notifications.filter(
        (n) => n.type === NotificationType.TRANSACTION,
      ),
    }),
  );

  if (notifications.length > 0) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>
              <IntlMessages id='app.wallet.transactionHash' />
            </TableCell>
            <TableCell>
              <IntlMessages id='app.wallet.date' />
            </TableCell>
            <TableCell>
              <IntlMessages id='app.wallet.status' />
            </TableCell>
            <TableCell></TableCell>
          </TableHead>
          <TableBody>
            {notifications.map((notification, index: number) => (
              <TransactionTableRow
                chainId={
                  (notification.metadata as TxNotificationMetadata).chainId
                }
                date={
                  notification?.timestamp
                    ? moment(notification?.timestamp).format(
                        'DD/MM/YYYY hh:mm:ss',
                      )
                    : ''
                }
                hash={
                  (notification.metadata as TxNotificationMetadata)
                    .transactionHash
                }
                status={
                  (notification.metadata as TxNotificationMetadata).status
                }
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <Box>
        <Grid
          container
          spacing={4}
          alignItems='center'
          alignContent='center'
          justifyContent='center'
          direction='column'>
          <Grid item>
            <WalletEmptyImage />
          </Grid>
          <Grid item>
            <Typography variant='h5' align='center' color='primary'>
              <IntlMessages id='app.wallet.noTransactionsYet' />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

export default TransactionsTab;
