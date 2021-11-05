import {
  Avatar,
  MenuItem,
  Select,
  useTheme,
  Grid,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import {OpenSeaToken} from 'modules/NFTWallet/types';
import React, {useCallback, useState} from 'react';

interface Props {
  tokens: OpenSeaToken[];
  onSelect: (token: OpenSeaToken) => void;
}

export default (props: Props) => {
  const {tokens, onSelect} = props;
  const [tokenIndex, setTokenIndex] = useState<number>(0);
  const theme = useTheme();

  const handleSelect = useCallback(
    (e) => {
      setTokenIndex(parseInt(e.target.value));
      onSelect(tokens[parseInt(e.target.value)]);
    },
    [onSelect, tokens],
  );

  return (
    <FormControl variant='outlined' fullWidth>
      <InputLabel>Token</InputLabel>
      <Select
        label='Token'
        value={tokenIndex}
        fullWidth
        variant='outlined'
        onChange={handleSelect}>
        {tokens?.map((token: OpenSeaToken, index: number) => (
          <MenuItem key={index} value={index}>
            <Grid alignItems='center' container spacing={2}>
              <Grid item>
                <Avatar
                  style={{height: theme.spacing(4), width: theme.spacing(4)}}>
                  <img src={token.image_url} alt={token.name} />
                </Avatar>
              </Grid>
              <Grid item>{token.symbol}</Grid>
            </Grid>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
