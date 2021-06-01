import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  Accordion,
  AccordionDetails,
  AccordionActions,
  Typography,
  FormControlLabel,
  makeStyles
} from '@material-ui/core';
import { TokenMetaData } from 'types/myApps';
import { WizardProps } from '..';
import { useTokenList } from 'hooks/useTokenList';
import { ChainId } from 'types/blockchain';
import { TokenComponent } from './tokenComponent';
import { truncateAddress } from 'utils/text';
import { Token } from 'types/app';
import { IOSSwitchComponent } from 'shared/components/Inputs/iOsSwitchComponent';
import { ColpaseTokenComponent } from './colapseTokenComponent';
import { TokenListComponent } from './tokenListComponent';

interface TokensFormProps {
  title: string;
  chainId: ChainId;
  tokens?: TokenMetaData[];
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation, chainId, editable } = props;
  
  const [tokens, setTokens] = useState(props.tokens ?? []);
  const [multipleTokens, setMultipleTokens] = useState(false);
  const listToken = useTokenList();
  useEffect(() => {
    if (tokens == null || tokens?.length === 0) {
      addToken();
    }
  }, []);

  const onChange = useCallback(
    ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      token: TokenMetaData,
      index: number
    ) => {
      if (!Boolean(editable)) {
        return;
      }
      if (index >= 0 && tokens != null && index < tokens.length) {
        tokens[index] = token;
        changeIssuerForm('tokens', tokens);
      }
    }, [tokens, changeIssuerForm, editable]);

  const addToken = useCallback(($e?: SyntheticEvent, index?: number) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable) && tokens?.length > 0) {
      return;
    }
    const newItem = {
      name: '',
      symbol: '',
      decimals: 0,
      address: '',
      addresses: {}
    };

    if (index != null && index > 0 && index < (tokens?.length ?? 0)) {
      tokens.splice(index, 0, newItem);
      setTokens([...tokens]);
      return;
    }
    setTokens([...(tokens ?? []), newItem]);
  }, [tokens, setTokens, editable]);

  useEffect(() => {
    if (Boolean(editable)) {
      changeIssuerForm('tokens', [...tokens]);
    }
  }, [tokens, changeIssuerForm, editable])

  const remToken = useCallback((index: number, $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable)) {
      return;
    }
    if (index >= 0 && index < tokens?.length) {
      tokens.splice(index, 1);
      const _tokens = [...tokens];
      setTokens(_tokens);
    }
  }, [tokens, setTokens, editable]);

  const sortToken = useCallback((index: number, action: 'UP' | 'DOWN', $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable)) {
      return;
    }
    const direction = action === 'UP' ? -1 : 0;
    const removed = tokens.splice(index + direction, 1);
    if (action === 'UP') {
      tokens.splice(index, 0, ...removed);
    } else {
      tokens.splice(index + 1, 0, ...removed);
    }
    const _tokens = [...tokens];
    setTokens(_tokens);
  }, [tokens, setTokens, editable]);

  const uniqueCheck = useCallback((address: string): boolean => {
    const r = tokens.filter(t => t.address?.toLowerCase() === address?.toLowerCase() || 
      t.addresses[Number(chainId)]?.toLowerCase() === address?.toLowerCase());
    return r?.length === 1;
  }, [tokens, chainId])

  const switchOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setMultipleTokens(checked);
  }

  return (
    <GridContainer>
      <Grid item xs={6} key={'multiple'}>
      <FormControlLabel
        control={<IOSSwitchComponent checked={multipleTokens} onChange={switchOnChange} name="multiple" />}
        label="Include by Address List"
      />
      </Grid>
      {
        multipleTokens ? ( 
          <TokenListComponent 
            update={setTokens}
            goBack={setMultipleTokens}
            chainId={chainId}
          />
        ) : 
        (
          <ColpaseTokenComponent 
          tokens={tokens}
          listToken={listToken}
          editable={editable}
          addToken={addToken}
          remToken={remToken}
          sortToken={sortToken}
          uniqueCheck={uniqueCheck}
          isValid={startValidation}
          chainId={chainId}
          validator={validator}
          onChange={onChange}
          />
        )
      }
    </GridContainer>
  );
}

export default TokensForm;