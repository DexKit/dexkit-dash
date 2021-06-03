import React, { FC, useEffect, useState, useCallback } from 'react';
import {
  Grid,
  TextField,
  makeStyles,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Box,
  Fab
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';
import Loader from '@crema/core/Loader';

import { truncateAddress } from 'utils/text';
import { isAddress } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { error } from '..';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { useTokenList } from 'hooks/useTokenList';
import { useBlokchain } from 'hooks/useBlokchain';
import { Token } from 'types/app';
import { TokenMetaData } from 'types/myApps';
import { ChainId } from 'types/blockchain';
import { InfoComponent } from '../Buttons/infoComponent';

const placeHolder = `${truncateAddress(ZERO_ADDRESS.toString())};${truncateAddress('0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4')};${truncateAddress('0xacaca5b8805636608e14c64b0bfffc2deb2c6cec')};${truncateAddress('0x6b175474e89094c44da98b954eedeac495271d0f')};...`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface TokenListComponentProps {
  update: (_tokens: TokenMetaData[]) => void;
  goBack: React.Dispatch<React.SetStateAction<boolean>>;
  validator: (isValid: boolean) => void;
  chainId: ChainId
}
export const TokenListComponent: FC<TokenListComponentProps> = (props) => {
  const { update, goBack, chainId, validator } = props;
  const classes = useStyles();
  const [value, setValue] = useState<string>();
  const [error, setError] = useState<error>();
  const [valid, setValid] = useState(false);
  const [addresses, setAddress] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const listToken = useTokenList();
  const { onGetToken } = useBlokchain();
  const helpText = 'Enter the addresses of the tokens by secing them through ";"';

  const findToken = useCallback(async (): Promise<(Token | undefined)[]> => {
    if(loading){
      return Promise.resolve([]);
    }
     const r = await Promise.all(addresses.map( async address => {
      let token = listToken.find(t => t.address.toLowerCase() === address.toLowerCase());

      if(token == null){
        token = await onGetToken(address.toLowerCase());
      }
      return token;
    }));
    return r;
  }, [listToken, addresses, onGetToken, loading]);

  const save = (elements: (Token | undefined)[]) => {
    if(elements == null ){
      return;
    }
    const _tokens = elements?.filter( e => e != null);
    update(_tokens?.map( t => {
      return {
        ...t,
        addresses: {
          [Number(chainId)]: t?.address
        }
      } as TokenMetaData;
    }));
    setTimeout(() => goBack(false), 500);
  }

  const validar = () => {
    const str = value?.normalize()?.replace(/\s/g, '')?.toLowerCase();
    if (str) {
      const _addresses = str.split(';');
      console.log('address', _addresses);
      if (_addresses.some(x => !isAddress(x))) {
        setError({ ['0']: 'invalid information or poorly formatted text' } as error);
        return;
      }
      setError({ ['0']: undefined } as error);
      const set = new Set([...addresses, ..._addresses]);
      setAddress([...set.values()]);
      setValue('');
    } else {
      setError({ ['0']: 'invalid information or poorly formatted text' } as error);
    }
  }

  const remove = useCallback((index: number) => {
    if(index >= 0 && index < (addresses?.length ?? 0)){
      addresses.splice(index,1);
      setAddress([...addresses]);
    }
  }, [addresses, setAddress]);

  const checkState = useCallback((): boolean => {
    return loading ? false : addresses != null && addresses.length > 0 && valid;
  }, [loading, addresses, valid])

  useEffect(() => {
    if (error != null && error['0'] != null) {
      setValid(false);
      return;
    }
    setValid(true);
  }, [error]);

  useEffect(() => {
    if(!valid){
      validator(valid)
    }
  }, [valid, validator]);

  return (
    <>
      {
        loading ? (<Loader />):
        (
          <>
          <Grid item xs={10} md={12} sm={12} key={'lote-address'} >
            <Box display="flex">
              <TextField
                type="text"
                value={value}
                helperText={!valid && error != null ? error['0'] : undefined}
                error={(error != null && error['0']) as boolean}
                placeholder={placeHolder}
                onBlur={($e) => {
                  if((value == null || value.length === 0) && addresses != null && addresses.length > 0){
                    setError({ ['0']: undefined } as error);
                  }
                }}
                onChange={
                  ($e) => {
                    setValue($e.target.value);
                  }
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label={<CustomLabel required={true}>Token Addresses</CustomLabel>}
                variant="outlined"
                InputProps={{ endAdornment: (<InfoComponent text={helpText}/>)}}
              />
              <IconButton aria-label="send" color="primary"  onClick={() => validar()}>
                <Icon>send</Icon>
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} sm={12} key={'token-address-list'}>
            <List className={classes.root}>
              {addresses?.map((value, index) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem key={value} role={undefined} dense button>
                    <ListItemText id={labelId} primary={`${value}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments" onClick={() => remove(index)}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          </>
        )
      }
      <Grid item xs={12} key="search-tokens">
        <Box paddingY={10} display="flex">
          <Fab 
          disabled={!checkState()}
          color="primary" 
          aria-label="add" 
          size="medium"
          onClick={() => {
            if(!checkState()){
              return;
            }
            setLoading(true);
            findToken()
            .then(save)
            .finally(() => {
              setLoading(false)
            })
          }}
          style={{ marginLeft: 'auto', marginRight:0}}
          >
            <SaveIcon />
          </Fab>
        </Box>
      </Grid>
    </>
  );
}