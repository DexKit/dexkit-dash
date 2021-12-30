import React, {useCallback} from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import {Box, IconButton, makeStyles} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import IntlMessages from '@crema/utility/IntlMessages';
import {useWeb3} from 'hooks/useWeb3';
import {getScannerUrl} from 'utils/blockchain';

const useStyles = makeStyles((theme) => ({
  media: {
    height: theme.spacing(50),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(60),
    },
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: theme.spacing(50),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(60),
    },
  },
  card: {
    position: 'relative',
  },
  button: {
    background: 'rgba(255,255,255, 0.1)',
    '&:hover': {
      background: 'rgba(255,255,255, 0.5)',
      boxShadow: theme.shadows[3],
    },
  },
  icon: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  action: {
    right: theme.spacing(3),
    top: theme.spacing(3),
    position: 'absolute',
  },
}));

export interface AssetCardProps {
  imageUrl?: string;
  caption?: string;
  onClick?: (e: any) => void;
  onMenu: (target: any) => void;
  loading?: boolean;
  contractAddress?: string;
  tokenId?: string;
  collectionName?: string;
  error?: any;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  caption,
  imageUrl,
  onClick,
  loading,
  contractAddress,
  collectionName,
  error,
  onMenu,
}) => {
  const classes = useStyles();
  const {chainId} = useWeb3();

  const handleMenu = useCallback(
    (e) => {
      onMenu(e.target);
    },
    [onMenu],
  );

  return (
    <Card className={classes.card}>
      {error ? (
        <>
          <Box className={classes.error}>
            <Box>
              <Typography variant='body1'>
                <IntlMessages id='app.wallet.errorWhileLoadingData' />
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      ) : loading ? (
        <Skeleton variant='rect' className={classes.media} />
      ) : (
        <CardActionArea onClick={onClick}>
          <CardMedia image={imageUrl} className={classes.media} />
        </CardActionArea>
      )}
      <CardContent>
        <Typography gutterBottom variant='caption'>
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <Link
                href={
                  chainId && contractAddress
                    ? `${getScannerUrl(chainId)}/address/${contractAddress}`
                    : ''
                }
                target='_blank'
                rel='noopener noreferrer'>
                {collectionName}
              </Link>
            </>
          )}
        </Typography>
        <Typography style={{fontWeight: 600}} variant='body1'>
          <Link color='inherit' href='#' onClick={onClick}>
            {loading ? <Skeleton /> : caption}
          </Link>
        </Typography>
      </CardContent>
      <Box className={classes.action}>
        {loading && !error ? null : (
          <IconButton
            size='small'
            className={classes.button}
            onClick={handleMenu}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default AssetCard;
