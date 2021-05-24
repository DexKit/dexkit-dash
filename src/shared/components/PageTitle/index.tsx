import React from 'react';
import {GridContainer} from '@crema';
import {
  Breadcrumbs,
  Grid,
  Box,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import ButtonCopy from '../ButtonCopy';
import { truncateAddress } from 'utils';

interface Props {
  history: {url: string; name: string}[];
  active: string;
  title: string;
  address?: string;
}

const PageTitle: React.FC<Props> = (props) => {
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
      alignItems: 'baseline'
    },
    title: {
      marginTop: '10px',
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
        <Breadcrumbs className={classes.breadcrumbs} aria-label='breadcrumb'>
          {props.history.map((e) => (
            <Link key={e.name} color='inherit' href={e.url}>
              {e.name}
            </Link>
          ))}
          <Typography className={classes.breadcrumbs} color='textPrimary'>
            {props.active}
          </Typography>
        </Breadcrumbs>

        <Box className={classes.boxTitle}>
          <Typography className={classes.title} color='textPrimary'>
            {props.title}
          </Typography>
          {
            props.address ? (
              <>
                <Typography className={classes.title} color='textPrimary'>
                  &nbsp;{`${truncateAddress(props.address)}`}
                </Typography>
                <ButtonCopy copyText={props.address} titleText='Copied to clipbord !' />
              </>
            ) : null 
          }
        </Box>
      </Grid>
    </GridContainer>
  );
};

export default PageTitle;
