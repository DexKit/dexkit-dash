import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  Accordion,
  AccordionDetails,
  AccordionActions,
  Typography,
  makeStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AccordionSummary } from '../../shared/Accordion';
import { CustomIconButton } from '../../shared/Buttons';
import { TokenMetaData } from 'types/myApps';
import { WizardProps } from '..';
import { useTokenList } from 'hooks/useTokenList';
import { ChainId } from 'types/blockchain';
import { TokenComponent } from './tokenComponent';
import { truncateAddress } from 'utils/text';
import { Token } from 'types/app';

const useStyle = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'center',
    display: 'inline-flex',
    alignSelf: 'center'
  },
}));

interface TokensFormProps {
  title: string;
  chainId: ChainId;
  tokens?: TokenMetaData[];
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, validator, isValid: startValidation, chainId, editable } = props;
  const classes = useStyle();
  const [tokens, setTokens] = useState(props.tokens ?? []);
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

  return (
    <GridContainer>
      {
        tokens != null ? tokens.map((token: TokenMetaData, i: number) => (
          <>
            <Grid item xs={12} md={12} sm={12}>
              <Accordion defaultExpanded={!Boolean(token?.address)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls={`accordion-summary-${i}`}
                  id={`accordion-summary-${i}`}
                >
                  <Typography className={classes.heading} variant="subtitle2" component="h2">
                    {`${token?.name} ${truncateAddress(token?.address)}`}
                  </Typography>
                  <AccordionActions>
                    <CustomIconButton aria-label={`add(${i})`} onClick={($e) => addToken($e, i)} disabled={Boolean(editable) ? !startValidation : true}>
                      <AddCircleOutlineOutlinedIcon fontSize="small" />
                    </CustomIconButton>
                    {
                      i > 0 ? (
                        <>
                          <CustomIconButton
                            key={`delete(${(new Date()).getTime()})`}
                            aria-label={`delete(${i})`}
                            disabled={!Boolean(editable)}
                            onClick={($e) => remToken(i, $e)}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </CustomIconButton>
                          <CustomIconButton
                            key={`up(${i})`}
                            aria-label={`up(${i})`}
                            onClick={($e) => sortToken(i, 'UP', $e)}
                            disabled={!Boolean(editable)}
                          >
                            <ArrowUpwardOutlinedIcon fontSize="small" />
                          </CustomIconButton>
                          <CustomIconButton
                            key={`down(${i})`} aria-label={`down(${i})`}
                            disabled={Boolean(editable) ? Boolean(i >= tokens?.length - 1) : true}
                            onClick={($e) => sortToken(i, 'DOWN', $e)}
                          >
                            <ArrowDownwardOutlinedIcon fontSize="small" />
                          </CustomIconButton>
                        </>

                      ) :
                        (
                          <>
                            <CustomIconButton
                              key={`up(${i})`}
                              aria-label={`up(${i})`}
                              disabled={true}
                            >
                              <ArrowUpwardOutlinedIcon fontSize="small" />
                            </CustomIconButton>
                            <CustomIconButton
                              key={`down(${i})`} aria-label={`down(${i})`}
                              disabled={Boolean(editable) ? Boolean(i >= tokens?.length - 1) : true}
                              onClick={($e) => sortToken(i, 'DOWN', $e)}
                            >
                              <ArrowDownwardOutlinedIcon fontSize="small" />
                            </CustomIconButton>
                          </>
                        )
                    }
                  </AccordionActions>
                </AccordionSummary>
                <AccordionDetails>
                  <GridContainer>
                    <TokenComponent
                      key={Math.round(Math.random() * 1000 + i)}
                      index={i}
                      data={token}
                      onChange={onChange}
                      validator={validator}
                      isValid={startValidation}
                      chainId={chainId}
                      tokens={listToken}
                      editable={editable}
                      uniqueCheck={uniqueCheck}
                    />
                  </GridContainer>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default TokensForm;