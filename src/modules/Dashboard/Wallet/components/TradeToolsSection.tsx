import React, {useCallback} from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import {makeStyles, useTheme} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

import {ReactComponent as BitcoinConvertWhiteIcon} from 'assets/images/icons/bitcoin-convert-white.svg';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {ReactComponent as ExportWhiteIcon} from 'assets/images/icons/export-white.svg';
import {ReactComponent as ImportWhiteIcon} from 'assets/images/icons/import-white.svg';
import {ReactComponent as AddCircleIcon} from 'assets/images/icons/add-circle.svg';

import {ReactComponent as ArrowRedoOutlinedIcon} from 'assets/images/icons/arrow-redo-outline.svg';
import {ReactComponent as HeartPurpleIcon} from 'assets/images/icons/heart-purple.svg';
import {ReactComponent as HeartEmptyIcon} from 'assets/images/icons/heart-empty.svg';
import {ReactComponent as WalletSearchIcon} from 'assets/images/icons/wallet-search.svg';

import {useAccountsModal} from 'hooks/useAccountsModal';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

interface TradeToolsSectionProps {
  onSend: () => void;
  onReceive: () => void;
  onSwap: () => void;
  onTrade: () => void;
  onBuyCrypto: () => void;
  onShare?: () => void;
  onMakeFavorite?: () => void;
  isFavorite?: boolean;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  item: {
    marginRight: theme.spacing(4),
    objectFit: 'contain',
  },
  itemText: {
    whiteSpace: 'nowrap',
  },
}));

export const TradeToolsSection = (props: TradeToolsSectionProps) => {
  const {
    onSend,
    onReceive,
    onSwap,
    onTrade,
    onBuyCrypto,
    onShare,
    onMakeFavorite,
    isFavorite,
  } = props;

  const accountsModal = useAccountsModal();

  const handleShowAccounts = useCallback(() => {
    accountsModal.setShow(true);
  }, [accountsModal]);

  const classes = useStyles();

  const {messages} = useIntl();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box py={4}>
      {isMobile ? (
        <Box mb={2}>
          <Typography variant='h6'>
            <IntlMessages id='app.dashboard.tradeTools' />
          </Typography>
        </Box>
      ) : null}
      <Box className={classes.container}>
        {onMakeFavorite ? (
          <Box className={classes.item}>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <RoundedIconButton
                style={isFavorite ? {borderColor: '#F76F8E'} : undefined}
                onClick={onMakeFavorite}>
                {isFavorite ? (
                  <HeartPurpleIcon className={classes.icon} />
                ) : (
                  <HeartEmptyIcon className={classes.icon} />
                )}
              </RoundedIconButton>
              <Typography variant='caption'>
                <IntlMessages id='app.dashboard.favorite' />
              </Typography>
            </Box>
          </Box>
        ) : null}

        {onShare ? (
          <Box className={classes.item}>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <RoundedIconButton onClick={onShare}>
                <ArrowRedoOutlinedIcon className={classes.icon} />
              </RoundedIconButton>
              <Typography variant='caption'>
                <IntlMessages id='app.dashboard.share' />
              </Typography>
            </Box>
          </Box>
        ) : null}
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onTrade}>
              <BitcoinConvertWhiteIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption'>
              <IntlMessages id='app.dashboard.trade' />
            </Typography>
          </Box>
        </Box>
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onSwap}>
              <MoneySendIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption' className={classes.itemText}>
              <IntlMessages id='app.dashboard.swap' />
            </Typography>
          </Box>
        </Box>
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={handleShowAccounts}>
              <WalletSearchIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption' className={classes.itemText}>
              <IntlMessages id='app.dashboard.accounts' />
            </Typography>
          </Box>
        </Box>
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onSend}>
              <ExportWhiteIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption' className={classes.itemText}>
              <IntlMessages id='app.dashboard.send' />
            </Typography>
          </Box>
        </Box>
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onReceive}>
              <ImportWhiteIcon className={classes.icon} />
            </RoundedIconButton>

            <Typography variant='caption' className={classes.itemText}>
              <IntlMessages id='app.dashboard.receive' />
            </Typography>
          </Box>
        </Box>
        <Box className={classes.item}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onBuyCrypto}>
              <AddCircleIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption' className={classes.itemText}>
              <IntlMessages id='app.dashboard.buyCrypto' />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
