import React, { FC, SyntheticEvent } from 'react';
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
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AccordionSummary } from '../../shared/Accordion';
import { CustomIconButton } from '../../shared/Buttons';
import { TokenComponent } from './tokenComponent';
import { truncateAddress } from 'utils/text';
import { TokenMetaData } from 'types/myApps';
import { Token } from 'types/app';
import { ChainId } from 'types/blockchain';

const useStyle = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'center',
    display: 'inline-flex',
    alignSelf: 'center'
  },
}));

interface ColpaseTokenComponentProps {
  tokens: TokenMetaData[];
  listToken: Token[];
  editable?: boolean;
  addToken: ($e?: SyntheticEvent, index?: number) => void;
  remToken: (index: number, $e?: SyntheticEvent) => void;
  sortToken: (index: number, action: 'UP' | 'DOWN', $e?: SyntheticEvent) => void;
  uniqueCheck: (address: string) => boolean
  isValid: boolean;
  chainId: ChainId;
  validator: (isValid: boolean) => void;
  onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    token: TokenMetaData,
    index: number
  ) => void;
}
export const ColpaseTokenComponent: FC<ColpaseTokenComponentProps> = (props) => {
  const { 
    tokens, 
    listToken, 
    editable, 
    addToken, 
    remToken, 
    sortToken, 
    uniqueCheck, 
    isValid: startValidation, 
    chainId, 
    validator, 
    onChange 
  } = props;
  const classes = useStyle();
  return (
    <>
      {
        tokens != null ? tokens.map((token: TokenMetaData, i: number) => (
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
        )) : null
      }
    </>
  );
}
