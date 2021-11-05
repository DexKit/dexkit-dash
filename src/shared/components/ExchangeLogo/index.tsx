import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {EXCHANGE} from 'shared/constants/AppEnums';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  icon: {
    width: '20px',
    height: '20px',
  },
}));

interface Props {
  exchange: string;
}

const ExchangeLogo = (props: Props) => {
  const classes = useStyles();
  switch (props.exchange) {
    case EXCHANGE.UNISWAP:
    case EXCHANGE.UNISWAP_V2_BRACKET:
      return (
        <Tooltip title='Trade on Uniswap' placement='top'>
          <Icon color='action' className={clsx('nav-item-icon', {})}>
            <img
              alt=''
              className={classes.icon}
              src={require(`assets/images/uniswap.png`)}
            />
          </Icon>
        </Tooltip>
      );
    case EXCHANGE.ZEROX:
    case EXCHANGE.ZEROX_V2:
    case EXCHANGE.ZEROX_V3:
    case EXCHANGE.MATCHA:
    case EXCHANGE.BAMBOO_RELAY:
      return (
        <Tooltip title='Trade on ZRX Protocol' placement='top'>
          <Icon color='action' className={clsx('nav-item-icon', {})}>
            <img
              alt=''
              className={classes.icon}
              src={require(`assets/images/0x.svg`)}
            />
          </Icon>
        </Tooltip>
      );
    case EXCHANGE.BALANCER:
      return (
        <Tooltip title='Trade on Balancer' placement='top'>
          <Icon color='action' className={clsx('nav-item-icon', {})}>
            <img
              alt=''
              className={classes.icon}
              src={require(`assets/images/balancer.svg`)}
            />
          </Icon>
        </Tooltip>
      );
    case EXCHANGE.MOONISWAP:
      return (
        <Tooltip title='Trade on Mooniswap' placement='top'>
          <Icon color='action' className={clsx('nav-item-icon', {})}>
            <img
              alt=''
              className={classes.icon}
              src={require(`assets/images/mooniswap.svg`)}
            />
          </Icon>
        </Tooltip>
      );
    case EXCHANGE.SUSHISWAP:
      return (
        <Tooltip title='Trade on SushiSwap' placement='top'>
          <Icon color='action' className={clsx('nav-item-icon', {})}>
            <img
              alt=''
              className={classes.icon}
              src={require(`assets/images/sushiswap.svg`)}
            />
          </Icon>
        </Tooltip>
      );

    default:
      return <>{props.exchange}</>;
  }
};

export default ExchangeLogo;
