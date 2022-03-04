import React, {useCallback, useState} from 'react';
import {useTheme} from '@material-ui/core/styles';

import {
  Dialog,
  DialogProps,
  Typography,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  List,
  Box,
  IconButton,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';

import CloseIcon from '@material-ui/icons/Close';

import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {SelectChampionListItem} from './SelectChampionItem';
import {ChainId} from 'types/blockchain';
import {useMyChampions} from 'modules/CoinLeagues/hooks/champions';
import {
  ChampionMetaItem,
  CoinLeaguesChampion,
} from 'modules/CoinLeagues/utils/types';
import {Link as RouterLink} from 'react-router-dom';

interface Props extends DialogProps {
  title?: string;
  chainId: ChainId.Matic | ChainId.Mumbai | ChainId.Binance;
  selectedChampion?: ChampionMetaItem;
  onSelectChampion: (champion: ChampionMetaItem) => void;
}

export const SelectChampionDialog = (props: Props) => {
  const {onSelectChampion, onClose, chainId} = props;
  // TODO: Change to Mainnet
  const championsQuery = useMyChampions({chainId});
  const championsData = championsQuery.data as Array<
    Required<CoinLeaguesChampion>
  >;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    [],
  );

  const handleSelectChampion = useCallback(
    (champ: ChampionMetaItem) => {
      setFilterText('');
      onSelectChampion(champ);
    },
    [onSelectChampion],
  );

  const handleClose = useCallback(() => {
    setFilterText('');

    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

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
            <Typography variant='body1'>{'Select Champion'}</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={4} p={2}>
          <TextField
            autoComplete='off'
            autoFocus
            id='name'
            placeholder='Search tokens'
            fullWidth
            value={filterText}
            variant='outlined'
            onChange={handleFilterChange}
          />
        </Box>
        {!championsData || championsData.length === 0 ? (
          <Typography variant='body1'>
            No champions found, you must hold an NFT champion to play in the NFT
            games -{' '}
            <Link component={RouterLink} to={'/coin-league/champions/event'}>
              {' '}
              Mint here now.
            </Link>
          </Typography>
        ) : (
          <List>
            <VariableSizeList
              itemData={championsData}
              itemSize={() => 56}
              itemCount={championsData.length}
              width='100%'
              height={250}>
              {({index, data, style}) => (
                <SelectChampionListItem
                  style={style}
                  onClick={handleSelectChampion}
                  champion={data[index]}
                  key={index}
                />
              )}
            </VariableSizeList>
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectChampionDialog;
