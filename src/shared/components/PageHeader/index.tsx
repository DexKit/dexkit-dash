import React from 'react';
import {GridContainer} from '@crema';
import {Link as RouterLink} from 'react-router-dom';
import {
  Breadcrumbs,
  Grid,
  Box,
  Chip,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import {CremaTheme} from 'types/AppContextPropsType';
import ButtonCopy from '../ButtonCopy';
import TokenLogo from '../TokenLogo';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {FORMAT_NETWORK_NAME} from 'shared/constants/Bitquery';
import NetworkSwitcher from '../NetworkSwitcher';
import {ShareButton} from '../ShareButton';

// import {truncateAddress} from 'utils';

interface Props {
  breadcrumbs?: {
    history: {url: string; name: string; hasCopy?: string}[];
    active: {name: string; hasCopy?: string};
  };
  title: {name?: string; hasCopy?: string; component?: React.ReactNode};
  subtitle?: {name: string; hasCopy?: string};
  network?: EthereumNetwork;
  networkSwitcher?: {
    networkName: EthereumNetwork;
    onClick: (network: EthereumNetwork) => any;
  };
  icon?: string;
  shareButton?: boolean;
}

const PageHeader: React.FC<Props> = ({
  breadcrumbs,
  title,
  subtitle,
  icon,
  network,
  networkSwitcher,
  shareButton,
}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    breadcrumbs: {
      fontSize: '16px',

      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
      },
    },
    boxTitle: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    title: {
      marginTop: '5px',
      fontSize: '24px',
      fontWeight: 600,
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
      },
    },
    container: {
      [theme.breakpoints.down('sm')]: {
        marginTop: '5px',
      },
    },
  }));

  const classes = useStyles();

  return (
    <GridContainer className={classes.container}>
      <Grid item xs={12} md={12}>
        {breadcrumbs && (
          <Breadcrumbs className={classes.breadcrumbs} aria-label='breadcrumb'>
            {breadcrumbs.history.map((e) => (
              <Link
                key={e.name}
                color='inherit'
                to={e.url}
                component={RouterLink}>
                {e.name}
                {e.hasCopy !== undefined && (
                  <ButtonCopy
                    copyText={e.hasCopy}
                    titleText='Copied to clipboard!'></ButtonCopy>
                )}
              </Link>
            ))}

            {breadcrumbs.active && (
              <Typography className={classes.breadcrumbs} color='textPrimary'>
                {breadcrumbs.active.name}
                {breadcrumbs.active.hasCopy !== undefined && (
                  <ButtonCopy
                    copyText={breadcrumbs.active.hasCopy}
                    titleText='Copied to clipboard!'></ButtonCopy>
                )}
              </Typography>
            )}
          </Breadcrumbs>
        )}

        <Box className={classes.boxTitle}>
          {networkSwitcher && (
            <Box mr={3}>
              <NetworkSwitcher />
            </Box>
          )}

          {network && (
            <Box mr={5}>
              <Tooltip title='Network'>
                <Chip label={FORMAT_NETWORK_NAME(network)} color={'default'} />
              </Tooltip>
            </Box>
          )}

          {icon && (
            <Box mr={2}>
              {<TokenLogo token0={icon} networkName={network as any} />}
            </Box>
          )}

          {!title.component && title.name && (
            <Typography className={classes.title} color='textPrimary'>
              {title.name}
              {title.hasCopy !== undefined && (
                <ButtonCopy
                  copyText={title.hasCopy}
                  titleText='Copied to Clipboard!'
                />
              )}
            </Typography>
          )}

          {title.component && title.component}

          {subtitle && (
            <Typography className={classes.title} color='textPrimary'>
              &nbsp;-&nbsp;{subtitle.name}
              {subtitle.hasCopy !== undefined && (
                <ButtonCopy
                  copyText={subtitle.hasCopy}
                  titleText='Copied to clipboard !'></ButtonCopy>
              )}
            </Typography>
          )}
          {shareButton && <ShareButton />}
        </Box>
      </Grid>
    </GridContainer>
  );
};

export default PageHeader;
