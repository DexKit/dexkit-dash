import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  Accordion,
  AccordionDetails,
  AccordionActions,
  Typography,
  makeStyles,
} from '@material-ui/core';

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TokenFeeProgramConfig } from 'types/myApps';
import { WizardData, WizardProps } from '..';
import { TokenComponent } from './tokenComponent';
import { AccordionSummary } from '../../shared/Accordion';
import { CustomIconButton } from '../../shared/Buttons';
import { truncateAddress } from 'utils/text';

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
  title: string
  data?: TokenFeeProgramConfig[];
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, data: initData, editable, isValid: startValidation } = props;
  const [tokens, setTokens] = useState<TokenFeeProgramConfig[]>(initData ?? []);
  const classes = useStyle();
  useEffect(() => {
    console.log('TokensForm loaded');
    if (tokens == null || tokens?.length === 0) {
      addToken();
    }
  }, []);

  const onChange = useCallback(
    ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      token: TokenFeeProgramConfig,
      index: number
    ) => {
      if (index >= 0 && tokens != null && index < tokens.length) {
        tokens[index] = token;
        changeIssuerForm(WizardData.TOKENS, tokens);
      }
    }, [tokens, changeIssuerForm]);
  const addToken = useCallback((index?: number, $e?: SyntheticEvent) => {
    if ($e != null) {
      $e.preventDefault();
      $e.stopPropagation();
    }
    if (!Boolean(editable) && tokens?.length > 0) {
      return;
    }
    const newItem = {
      buyTokenPercentage: '0',
      token_address: '',
      token_amount: '0'
    } as TokenFeeProgramConfig;
    if (index != null && index > 0 && index < (tokens?.length ?? 0)) {
      tokens.splice(index, 0, newItem);
      setTokens([...tokens]);
      return;
    }
    setTokens([...(tokens ?? []), newItem]);
  }, [tokens, setTokens, editable]);

  useEffect(() => {
    if (Boolean(editable)) {
      changeIssuerForm(WizardData.TOKENS, [...tokens]);
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
      setTokens([...tokens]);
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
    const r = tokens.filter(t => t.token_address?.toLowerCase() === address?.toLowerCase());
    return r?.length === 1;
  }, [tokens])

  return (
    <GridContainer>
      {
        tokens != null ? tokens.map((token: TokenFeeProgramConfig, i: number) => (
          <>
            <Grid item xs={12} md={12} sm={12}>
              <Accordion defaultExpanded={!Boolean(token?.token_address)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls={`accordion-summary-${i}`}
                  id={`accordion-summary-${i}`}
                >
                  <Typography className={classes.heading} variant="subtitle2" component="h2">
                    {`${truncateAddress(token?.token_address)}`}
                  </Typography>
                  <AccordionActions>
                    <CustomIconButton aria-label={`add(${i})`} onClick={($e) => addToken(i, $e)} disabled={Boolean(editable) ? !startValidation : true}>
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