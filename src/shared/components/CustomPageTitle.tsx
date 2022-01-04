import {
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Breadcrumbs,
  Grid,
  Link,
} from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {Link as RouterLink} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface Breadcrumb {
  title: string;
  link?: string;
}

interface Props {
  breadcrumbs: Breadcrumb[];
  title: React.ReactNode | React.ReactNode[];
  onBack?: (e: any) => void;
}

export const CustomPageTitle: React.FC<Props> = ({
  breadcrumbs,
  title,
  onBack,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map((e, index) =>
            e.link ? (
              <Link
                key={index}
                component={RouterLink}
                to={{pathname: e.link}}
                color='inherit'>
                {e.title}
              </Link>
            ) : (
              <Typography key={index} variant='body2' color='inherit'>
                {e.title}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems='center'>
          {onBack ? (
            <Grid item>
              <IconButton onClick={onBack} size='small'>
                <ArrowBackIcon />
              </IconButton>
            </Grid>
          ) : null}

          <Grid item>
            <Typography variant='h5'>{title}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomPageTitle;
