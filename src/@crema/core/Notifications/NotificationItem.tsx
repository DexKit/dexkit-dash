import React, {useCallback, useMemo, useRef} from 'react';
import {
  Divider,
  CircularProgress,
  Grid,
  IconButton,
  Box,
  Typography,
  useTheme,
  Link,
} from '@material-ui/core';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {Notification} from 'types/models/Notification';
import {useSelector} from 'react-redux';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import {AppState} from 'redux/store';
import {TransactionStatus} from 'redux/_transactions/types';

interface NotificationItemProps {
  item: Notification;
  onClick?: (item: Notification) => void;
  onMenu?: (index: number, anchor: HTMLElement | null) => void;
  id: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onClick,
  onMenu,
  id,
}) => {
  const theme = useTheme();

  const {transactions} = useSelector<AppState, AppState['transactions']>(
    ({transactions}) => transactions,
  );

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [item, onClick]);

  const isTransaction = item?.type === NotificationType.TRANSACTION;

  const transaction = useMemo(() => {
    if (transactions !== undefined && isTransaction) {
      const metadata: TxNotificationMetadata =
        item.metadata as TxNotificationMetadata;

      const txIndex = transactions.findIndex(
        (tx) => tx.hash === metadata.transactionHash,
      );

      return transactions[txIndex];
    }

    return undefined; // eslint-disable-next-line
  }, [String(transactions), item, isTransaction]);

  const isTransactionPending =
    transaction?.status === TransactionStatus.Pending;

  const isTransactionDone = transaction?.status === TransactionStatus.Confirmed;
  const isTransactionFailed = transaction?.status === TransactionStatus.Failed;

  const anchor = useRef<HTMLButtonElement | null>(null);

  return (
    <Box onClick={handleClick}>
      <Box p={4}>
        <Grid container spacing={2}>
          <Grid item xs>
            <Box display='flex' alignContent='center' alignItems='center'>
              <Box
                display='flex'
                alignContent='center'
                alignItems='center'
                mr={1}>
                {isTransaction && (
                  <>
                    {isTransactionPending ? (
                      <CircularProgress size='1rem' />
                    ) : isTransactionDone ? (
                      <CheckCircleOutlineIcon
                        style={{
                          color: theme.palette.success.main,
                          fontSize: '1rem',
                        }}
                      />
                    ) : isTransactionFailed ? (
                      <HighlightOffIcon
                        style={{
                          color: theme.palette.error.main,
                          fontSize: '1rem',
                        }}
                        fontSize='inherit'
                      />
                    ) : null}
                  </>
                )}
              </Box>
              <Typography variant='body1'>{item?.title || ''}</Typography>
            </Box>

            <Typography variant='caption' color='textSecondary'>
              {item?.body || ''}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              ref={(ref) => (anchor.current = ref)}
              size='small'
              onClick={() => onMenu!(id, anchor.current)}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Grid>

          {item.url !== undefined && (
            <Grid item xs={12}>
              <Link href={item.url} target='_blank'>
                {item.urlCaption}
              </Link>
            </Grid>
          )}
        </Grid>
        <Box mt={4}>
          <Divider />
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationItem;
