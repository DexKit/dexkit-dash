import React from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink} from 'react-router-dom';

export interface PageHeaderProps {
  breadcrumbs?: {caption: string; uri?: string}[];
  title?: string;
  backUri?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  backUri,
}) => {
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
