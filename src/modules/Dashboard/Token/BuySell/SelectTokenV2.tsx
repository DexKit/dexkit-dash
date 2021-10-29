import React from 'react';

import {useIntl} from 'react-intl';

import {Token} from 'types/app';
import {Button, makeStyles, withStyles} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Logo from 'shared/components/Logo';
import {getLogoSrcs} from 'utils';

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
    padding: theme.spacing(2),
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
  const {messages} = useIntl();

  return selected ? (
    <StyledButton
      fullWidth
      disabled={disabled}
      startIcon={
        <Logo
          srcs={getLogoSrcs(
            selected.address,
            selected.networkName,
            selected.logoURI,
          )}
          className={classes.icon}
        />
      }
      endIcon={<ExpandMoreIcon />}
      variant='outlined'
      onClick={onClick}>
      {selected?.symbol}
    </StyledButton>
  ) : (
    <StyledButton
      fullWidth
      disabled={disabled}
      endIcon={<ExpandMoreIcon />}
      variant='outlined'
      onClick={onClick}>
      {messages['app.choose']}
    </StyledButton>
  );
};

export default SelectTokenV2;
