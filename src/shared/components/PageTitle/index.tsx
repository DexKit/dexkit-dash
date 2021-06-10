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
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { FORMAT_NETWORK_NAME } from 'shared/constants/Bitquery';
// import {truncateAddress} from 'utils';

interface Props {
  breadcrumbs?: {
    history: {url: string; name: string; hasCopy?: string}[];
    active: {name: string; hasCopy?: string};
  };
  title: {name: string; hasCopy?: string};
  subtitle?: {name: string; hasCopy?: string};
  network?: EthereumNetwork;
  icon?: string;
}

const PageTitle: React.FC<Props> = ({breadcrumbs, title, subtitle, icon, network}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    breadcrumbs: {
      fontSize: '16px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '15px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '13px',
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
        fontSize: '22px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
      },
    },
  }));

  const classes = useStyles();

  return (
    <GridContainer>
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
          {network && <Box mr={5}>
          <Tooltip title="Network">
              <Chip
                label={FORMAT_NETWORK_NAME(network)}   
                color={ 'default'}
              />
              </Tooltip>
            </Box>}

          {icon && <Box mr={2}>{<TokenLogo token0={icon} />}</Box>}

          <Typography className={classes.title} color='textPrimary'>
            {title.name}
            {title.hasCopy !== undefined && (
              <ButtonCopy
                copyText={title.hasCopy}
                titleText='Copied to Clipboard!'
              />
            )}
          </Typography>

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
        </Box>
      </Grid>
    </GridContainer>
  );
};

export default PageTitle;
