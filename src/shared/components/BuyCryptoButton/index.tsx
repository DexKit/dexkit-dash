import React, {useCallback} from 'react';
import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';
import {Box, Typography, makeStyles} from '@material-ui/core';
import {useTransak} from 'hooks/useTransak';
import {useRamp} from 'hooks/useRamp';
import {ReactComponent as CardIcon} from 'assets/images/icons/card-white.svg';
import {withStyles} from '@material-ui/core/styles';
import Menu, {MenuProps} from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  itemText: {
    whiteSpace: 'nowrap',
  },
}));
type Props = {
  btnMsg?: string;
  defaultCurrency?: string;
};

const BuyCryptoButton = (props: Props) => {
  const {btnMsg, defaultCurrency} = props;
  const classes = useStyles();
  const {init} = useTransak({defaultCurrency});
  const {initRamp} = useRamp({defaultCurrency});

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /* eslint-disable */
  const handleBuyCryptoTransak = useCallback(() => {
    handleClose();
    init();
  }, [init]);

  /* eslint-disable */
  const handleBuyCryptoRamp = useCallback(() => {
    handleClose();
    initRamp();
  }, [initRamp]);

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <RoundedIconButton onClick={handleClick}>
        <CardIcon className={classes.icon} />
      </RoundedIconButton>
      <Typography variant='caption' className={classes.itemText}>
        {btnMsg || 'Buy Crypto'}
      </Typography>
      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <StyledMenuItem onClick={handleBuyCryptoRamp}>Ramp</StyledMenuItem>
        <StyledMenuItem onClick={handleBuyCryptoTransak}>
          Transak
        </StyledMenuItem>
      </StyledMenu>
    </Box>
  );
};

export default BuyCryptoButton;
