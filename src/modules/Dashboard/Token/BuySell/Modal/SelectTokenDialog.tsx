import React, {useCallback, useState, useMemo, useRef, useEffect} from 'react';
import {useTheme} from '@material-ui/core/styles';

import {
  Grid,
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
  Chip,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import SelectTokenListItem from '../../components/SelectTokenListItem';
import {Token} from 'types/app';
import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {useMobile} from 'hooks/useMobile';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useNetwork} from 'hooks/useNetwork';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';

interface Props extends DialogProps {
  title?: string;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  enableFilters?: boolean;
}

export const SelectTokenDialog = (props: Props) => {
  const {onSelectToken, tokens, onClose, title, enableFilters} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const isMobile = useMobile();
  const contentRef = useRef<HTMLElement>();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    [],
  );

  const filteredTokens = useMemo(() => {
    return tokens.filter(
      (coin: Token) =>
        coin.name.toLowerCase().startsWith(filterText.toLowerCase()) ||
        coin.symbol.toLowerCase().startsWith(filterText.toLowerCase()),
    );
  }, [tokens, filterText]);

  const handleSelectToken = useCallback(
    (token: Token) => {
      onSelectToken(token);
    },
    [onSelectToken],
  );

  const [selectedNetwork, setSelectedNetwork] = useState<EthereumNetwork>();

  const handleClose = useCallback(() => {
    setFilterText('');

    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  const network = useNetwork();

  useEffect(() => {
    setSelectedNetwork(network);
  }, [network]);

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
        <CustomDialogTitle title={title || 'Select a token'} icon={<MoneySendIcon />} onClose={handleClose}/>
    
      <DialogContent style={{padding: 0}} ref={contentRef}>
        <div ref={searchBoxRef}>
          <Box mb={2} p={4}>
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
        </div>
        <Box mb={2} px={4}>
          {enableFilters ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip
                    clickable
                    size='small'
                    label='All'
                    variant={
                      selectedNetwork === undefined ? 'default' : 'outlined'
                    }
                    onClick={() => {
                      setSelectedNetwork(undefined);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    size='small'
                    label='ETH'
                    variant={
                      selectedNetwork === EthereumNetwork.ethereum
                        ? 'default'
                        : 'outlined'
                    }
                    onClick={() => {
                      setSelectedNetwork(EthereumNetwork.ethereum);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    size='small'
                    label='BSC'
                    variant={
                      selectedNetwork === EthereumNetwork.bsc
                        ? 'default'
                        : 'outlined'
                    }
                    onClick={() => {
                      setSelectedNetwork(EthereumNetwork.bsc);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    size='small'
                    label='Polygon'
                    variant={
                      selectedNetwork === EthereumNetwork.matic
                        ? 'default'
                        : 'outlined'
                    }
                    onClick={() => {
                      setSelectedNetwork(EthereumNetwork.matic);
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </Box>
        {filteredTokens.length === 0 ? (
          <Typography variant='body1'>No tokens found</Typography>
        ) : (
          <List disablePadding>
            <VariableSizeList
              itemData={filteredTokens.filter((t) => {
                if (!selectedNetwork) {
                  return true;
                }

                if (t.networkName) {
                  return t.networkName === selectedNetwork;
                }

                return true;
              })}
              itemSize={() => 56}
              itemCount={filteredTokens.length}
              width='100%'
              height={
                isMobile
                  ? (contentRef.current?.clientHeight || 0) -
                    (searchBoxRef.current?.clientHeight || 0) -
                    theme.spacing(4)
                  : 250
              }>
              {({index, data, style}) => (
                <SelectTokenListItem
                  style={style}
                  onClick={handleSelectToken}
                  token={data[index]}
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

export default SelectTokenDialog;
