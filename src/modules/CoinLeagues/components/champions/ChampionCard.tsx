import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


import {ChainId} from 'types/blockchain';

import {Skeleton} from '@material-ui/lab';
import {getNormalizedUrl} from 'utils/browser';
import {CoinLeaguesChampion} from 'modules/CoinLeagues/utils/types';
import {OpenSeaIcon} from 'shared/components/Icons';

import {useWeb3} from 'hooks/useWeb3';
import {CHAMPIONS} from 'modules/CoinLeagues/constants';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  media: {
    height: theme.spacing(44),
  },
  card: {
    position: 'relative',
  },
  action: {
    right: theme.spacing(2),
    top: theme.spacing(2),
    position: 'absolute',
  },
  button: {
    background: theme.palette.grey[800],
    boxShadow: theme.shadows[3],
    '&:hover': {
      background: theme.palette.grey[900],
    },
  },
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface ChampionCardProps {
  champion?: CoinLeaguesChampion;
  loading?: boolean;
}

export const ChampionCard = (props: ChampionCardProps) => {
  const {loading, champion} = props;

  const classes = useStyles();

  const {chainId} = useWeb3();

  return (
    <Card className={classes.card}>
      {chainId &&
      (chainId === ChainId.Matic || chainId === ChainId.Mumbai) &&
      !loading ? (
        <Box className={classes.action}>
          <Tooltip title='view on OpenSea'>
            <IconButton
              target='_blank'
              href={`${
                chainId === ChainId.Matic ? 'https://' : 'https://testnets.'
              }opensea.io/assets/${
                chainId === ChainId.Matic ? 'matic' : 'mumbai'
              }/${CHAMPIONS[chainId]}/${champion?.id}`}
              className={classes.button}>
              <OpenSeaIcon className={classes.icon} />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null}
      {loading ? (
        <Skeleton variant='rect' className={classes.media} />
      ) : (
        <CardMedia
          image={
            champion?.image ? getNormalizedUrl(champion?.image) : undefined
          }
          className={classes.media}
        />
      )}
      <CardContent>
        <Typography variant='body1'>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <IntlMessages id='app.coinLeagues.champion' /> #{champion?.id}
            </>
          )}
          {loading ? <Skeleton /> : <>{champion?.name}</>}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChampionCard;
