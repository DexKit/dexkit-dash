import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid,
  IconButton,
  Divider,
  withStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { TokenFeeProgramConfig } from 'types/myApps';
import { WizardData, WizardProps } from '..';
import { TokenComponent } from './tokenComponent';

const CustomGrid = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} !important;`,
    margin: theme.spacing(1, 0)
  }
}))(Grid);

interface TokensFormProps {
  title: string
  data?: TokenFeeProgramConfig[]
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
  const { changeIssuerForm, data: initData } = props;
  const [tokens, setTokens] = useState<TokenFeeProgramConfig[]>(initData ?? []);
  useEffect(() => {
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
  const addToken = useCallback((index?: number) => {
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
  }, [tokens, setTokens]);

  useEffect(() => {
    changeIssuerForm(WizardData.TOKENS, { ...tokens });
  }, [tokens, changeIssuerForm])

  const remToken = useCallback((index: number) => {
    if (index >= 0 && index < tokens?.length) {
      tokens.splice(index, 1);
      setTokens([...tokens]);
    }
  }, [tokens, setTokens]);

  return (
    <GridContainer>

      {
        tokens != null ? tokens.map((token: TokenFeeProgramConfig, i: number) => (
          <>
            {
              i > 0 && (
                <CustomGrid item xs={12} md={12} sm={12}>
                  <Divider></Divider>
                </CustomGrid>
              )
            }
            <Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
              <IconButton aria-label="add" onClick={() => addToken(i)}>
                <AddCircleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
              {
                i > 0 && (
                  <IconButton aria-label="delete">
                    <DeleteOutlinedIcon onClick={() => remToken(i)} fontSize="small" />
                  </IconButton>
                )
              }
            </Grid>
            <TokenComponent
              key={Math.round(Math.random() * 1000 + i)}
              index={i}
              data={token}
              onChange={onChange}
            />
          </>
        )) : null
      }
    </GridContainer>
  );
}

export default TokensForm;