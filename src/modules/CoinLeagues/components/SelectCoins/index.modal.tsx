import React, {useCallback, useState, useMemo} from 'react';
import {useTheme} from '@material-ui/core/styles';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {Divider, DialogActions, Button} from '@material-ui/core';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogProps} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CloseIcon from '@material-ui/icons/Close';

import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import {SelectCoinListItem} from './SelectCoinItem';
import {PriceFeeds} from 'modules/CoinLeagues/constants';
import {ChainId} from 'types/blockchain';

function isSelected(
  item: {
    address: string;
    logo: string;
    base: string;
    baseName: string;
    quote: string;
  },
  selectedCoins?: {
    address: string;
    logo: string;
    base: string;
    baseName: string;
    quote: string;
  }[],
) {
  if (selectedCoins !== undefined && selectedCoins?.length >= 1) {
    return (
      selectedCoins?.findIndex((another) => {
        const addr = item.address.toLowerCase();

        const selectedAddr = another.address.toLowerCase();

        return addr === selectedAddr;
      }) > -1
    );
  }

  return false;
}

interface Props extends DialogProps {
  title?: string;
  chainId: ChainId.Matic | ChainId.Mumbai | ChainId.Binance;
  captainCoin?: CoinFeed;
  selectedCoins?: CoinFeed[];
  onSelectCoin: (coin: CoinFeed, isCaptainCoin: boolean) => void;
  onSelectCoins?: (coins: CoinFeed[]) => void;
  isCaptainCoin: boolean;
  maxSelectedCoins?: number;
}

export const SelectCoinLeagueDialog = (props: Props) => {
  const {
    onSelectCoin,
    onSelectCoins,
    onClose,
    chainId,
    isCaptainCoin,
    selectedCoins,
    maxSelectedCoins,
    captainCoin,
  } = props;
  // TODO: Change to Mainnet

  const [currSelectedCoins, setCurrSelectedCoins] = useState<CoinFeed[]>([]);

  const coins = PriceFeeds[chainId];
  const theme = useTheme();
  const {messages} = useIntl();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const filteredCoins = useMemo(() => {
    return coins
      .filter(
        (coin: CoinFeed) =>
          coin.baseName.toLowerCase().startsWith(filterText?.toLowerCase()) ||
          coin.base.toLowerCase().startsWith(filterText?.toLowerCase()),
      )
      .filter((coin: CoinFeed) => {
        if (isCaptainCoin && selectedCoins) {
          const index = selectedCoins.indexOf(coin);

          console.log('index', index);

          if (index > -1) {
            return false;
          }

          return true;
        }

        return coin !== captainCoin;
      });
    // eslint-disable-next-line
  }, [isCaptainCoin, filterText, String(selectedCoins), coins, captainCoin]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    [],
  );

  const handleSelectCoin = useCallback(
    (coin: CoinFeed) => {
      setFilterText('');

      const index = currSelectedCoins.indexOf(coin);

      if (index > -1) {
        const newArr = [...currSelectedCoins];

        newArr.splice(index, 1);

        setCurrSelectedCoins(newArr);
      } else {
        setCurrSelectedCoins((value) => [...value, coin]);
      }
    }, // eslint-disable-next-line
    [onSelectCoin, String(currSelectedCoins)],
  );

  const handleClose = useCallback(() => {
    setFilterText('');

    setCurrSelectedCoins([]);

    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (onSelectCoins) {
      onSelectCoins(currSelectedCoins);
      setCurrSelectedCoins([]);
    }
    // eslint-disable-next-line
  }, [onSelectCoins, String(currSelectedCoins)]);

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Box display='flex' pr={2}>
              <MoneySendIcon />
            </Box>
            <Typography variant='body1'>
              {isCaptainCoin
                ? messages['app.coinLeagues.selectCaptainCoin']
                : `${messages['app.coinLeagues.selectCoin']} - ${currSelectedCoins.length}/${maxSelectedCoins}`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mb={4} p={2}>
          <TextField
            autoComplete='off'
            autoFocus
            id='name'
            placeholder={messages['app.coinLeagues.searchTokens'] as string}
            fullWidth
            value={filterText}
            variant='outlined'
            onChange={handleFilterChange}
          />
        </Box>
        {filteredCoins.length === 0 ? (
          <Typography variant='body1'>
            <IntlMessages id='app.coinLeagues.noCoinsFound' />
          </Typography>
        ) : (
          <List>
            <VariableSizeList
              itemData={filteredCoins}
              itemSize={() => 56}
              itemCount={filteredCoins.length}
              width='100%'
              height={250}>
              {({index, data, style}) => (
                <SelectCoinListItem
                  style={style}
                  onClick={handleSelectCoin}
                  coin={data[index]}
                  key={index}
                  selected={isSelected(data[index], currSelectedCoins)}
                  disabled={
                    !isSelected(data[index], currSelectedCoins) &&
                    currSelectedCoins?.length === maxSelectedCoins
                  }
                />
              )}
            </VariableSizeList>
          </List>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          disabled={
            maxSelectedCoins !== undefined &&
            currSelectedCoins.length < maxSelectedCoins
          }
          onClick={handleSave}
          variant='contained'
          color='primary'>
          <IntlMessages id='coinLeague.save' defaultMessage='Save' />
        </Button>
        <Button variant='outlined' color='primary' onClick={handleClose}>
          <IntlMessages id='coinLeague.cancel' defaultMessage='Cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCoinLeagueDialog;
