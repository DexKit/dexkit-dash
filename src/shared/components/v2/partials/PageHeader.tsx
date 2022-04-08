import React, {useCallback} from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {WALLET_ROUTE} from 'shared/constants/routes';

export interface PageHeaderProps {
  breadcrumbs?: {caption: string; uri?: string}[];
  title?: string;
  backUri?: string;
  useBackUriFromRouter?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  backUri,
  useBackUriFromRouter,
}) => {
  const history = useHistory();
  const renderBreadcrumbs = () => {
    return breadcrumbs?.map((b, index: number) =>
      b.uri ? (
        <RouterLink key={index} component={Link} to={b.uri} color='inherit'>
          {b.caption}
        </RouterLink>
      ) : (
        <Link key={index} color='inherit'>
          {b.caption}
        </Link>
      ),
    );
  };

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(WALLET_ROUTE);
    }
  }, [history]);

  return (
    <Box>
      <Grid container spacing={2}>
        {breadcrumbs?.length && (
          <Grid item xs={12}>
            <Breadcrumbs>{renderBreadcrumbs()}</Breadcrumbs>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2} alignContent='center' alignItems='center'>
            {backUri && (
              <IconButton component={RouterLink} to={backUri} size='small'>
                <ArrowBackIcon />
              </IconButton>
            )}
            {useBackUriFromRouter && (
              <IconButton onClick={handleBack} size='small'>
                <ArrowBackIcon />
              </IconButton>
            )}

            {title && (
              <Grid item>
                <Typography variant='h5'>{title}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(PageHeader);
