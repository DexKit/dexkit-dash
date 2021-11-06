import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IntlMessages from '@crema/utility/IntlMessages';

import {GridContainer} from '@crema';
import {Chip, makeStyles, Typography} from '@material-ui/core';

import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {ReactComponent as WalletAddIcon} from 'assets/images/icons/wallet-add.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    borderWidth: 'thin',
    border: '1px solid rgba(255,255,255,.2)',
    backgroundColor: '#2E3243',
  },
  kitChip: {},
  usdValue: {},
  buyBtn: {
    borderRadius: 8,
    borderWidth: 'thin',
    border: '1px solid rgba(255,255,255,.2)',
  },
  walletIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    stroke: theme.palette.common.white,
    fill: theme.palette.common.white,
  },
}));

type Props = {value?: number; kit?: number};

const BalanceCard: React.FC<Props> = (props) => {
  const classes = useStyles();

  const {usdFormatter} = useUSDFormatter();

  return (
    <GridContainer className={classes.root} spacing={4}>
      <Grid container style={{padding: 15}} alignItems='center'>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12} className={classes.usdValue}>
              <Typography variant='h4'>
                {usdFormatter.format(props.value || 2300)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Chip
                    size='small'
                    className={classes.kitChip}
                    label={`${props.kit || 500.3432} KIT`}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3} style={{textAlign: 'right'}}>
          <Button
            className={classes.buyBtn}
            startIcon={<WalletAddIcon className={classes.walletIcon} />}>
            <IntlMessages id='app.myApps.buy' />
          </Button>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default BalanceCard;
