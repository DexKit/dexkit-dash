import React, {useEffect} from 'react';
import {
  Autocomplete,
  createFilterOptions,
  FilterOptionsState,
} from '@material-ui/lab';
import {Token} from 'types/app';
import {
  Chip,
  makeStyles,
  TextField,
  Box,
  Grid,
  Button,
  withStyles,
} from '@material-ui/core';
import TokenLogo from 'shared/components/TokenLogo';
import styled from 'styled-components';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';

import {VariableSizeList, ListChildComponentProps} from 'react-window';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import {filterTokensInfoByString} from 'utils/tokens';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props {
  id: string;
  selected: Token | undefined;
  disabled?: boolean;
  limitCoins?: boolean;
  label?: string;
  onClick: () => void;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    minHeight: '100%',
  },
}))(Button);

const SelectTokenV2: React.FC<Props> = ({
  id,
  selected,
  disabled,
  onClick,
  label,
}) => {
  const classes = useStyles();

  return (
    <StyledButton
      fullWidth
      disabled={disabled}
      startIcon={<img src={selected?.logoURI} className={classes.icon} />}
      endIcon={<ExpandMoreIcon />}
      variant='outlined'
      onClick={onClick}>
      {selected?.symbol}
    </StyledButton>
  );
};

export default SelectTokenV2;
