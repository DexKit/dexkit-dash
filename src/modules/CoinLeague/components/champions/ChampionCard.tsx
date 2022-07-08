import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {Skeleton} from '@material-ui/lab';
import {getNormalizedUrl} from 'utils/browser';
import {CoinLeaguesChampion} from 'modules/CoinLeague/utils/types';
import {OpenSeaIcon} from 'shared/components/Icons';

import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';

import {
  GET_CHAMPIONS_CONTRACT_ADDR,
  IS_CHAMPIONS_SUPPORTED_NETWORK,
} from 'modules/CoinLeague/utils/champions';
import {getOpenSeaLink} from 'utils/opensea';
import {useIntl} from 'react-intl';

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

  const {messages} = useIntl();

  const classes = useStyles();

  const {chainId} = useLeaguesChainInfo();

  return (
    <Card className={classes.card}>
      {chainId && IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) && !loading ? (
        <Box className={classes.action}>
          <Tooltip title={messages['app.coinLeague.viewOnOpenSea'] as string}>
            <IconButton
              target='_blank'
              href={`${getOpenSeaLink(
                chainId,
                GET_CHAMPIONS_CONTRACT_ADDR(chainId),
                champion?.id,
              )}`}
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
          {loading ? <Skeleton /> : <>{champion?.name}</>}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChampionCard;
