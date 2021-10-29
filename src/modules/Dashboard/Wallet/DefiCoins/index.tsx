import React, {useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import {GridContainer} from '@crema';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';
import {CoinData} from 'types/models/Crypto';
import {matchCoinSymbol} from 'utils/constants';
import CoinStats from './CoinStats';

export interface CoinProps {
  token: string;
  coinsDataProps: CoinData;
}

export interface Assets {
  address: string;
  coinsData: CoinProps[];
}

export interface CoinsProps {
  assets: Assets[] | undefined;
}

const useStyles = makeStyles(() => ({
  toolbar: {
    padding: '0 24px',
  },
}));

const DefiCoins: React.FC<CoinsProps> = ({assets}) => {
  const [defiData, setDefiData] = useState<CoinProps[]>([]);

  useEffect(() => {
    if (assets) {
      const defis: CoinProps[] = [];

      for (const asset of assets) {
        for (const coin of asset?.coinsData || []) {
          defis.push(coin);
        }
      }

      setDefiData(defis);
    }
  }, [assets]);

  const classes = useStyles();
  const {messages} = useIntl();

  return (
    <Box className='card-hover'>
      <Fade timeout={1000}>
        <Paper>
          <Box key='defi-assets'>
            <Toolbar className={classes.toolbar}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                style={{width: '100%'}}>
                <Box>
                  <Typography variant='h5'>
                    {messages['app.defiAssets']}
                  </Typography>
                </Box>
              </Box>
            </Toolbar>

            <GridContainer>
              {defiData.length > 0 ? (
                defiData
                  .slice(0, defiData.length > 9 ? 9 : defiData.length)
                  .map(({token, coinsDataProps: coin}: CoinProps, index) => (
                    <Grid item xs={4} sm={4}>
                      <CoinStats
                        key={index}
                        token={token}
                        icon={matchCoinSymbol(coin.symbol ?? '')}
                        bgColor={blue[500]}
                        data={coin}
                        heading={coin.name}
                      />
                    </Grid>
                  ))
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 0px',
                  }}>
                  <Typography>
                    {messages['app.youDontHaveDefiAssets']}
                  </Typography>
                </Grid>
              )}
            </GridContainer>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default DefiCoins;
