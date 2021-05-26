import React from 'react';
import {GridContainer} from '@crema';
import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Link as MaterialLink,
  Typography,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import { Link } from 'react-router-dom';


import ButtonCopy from '../ButtonCopy';

interface Props {
  history: {url: string; name: string, symbol?: string}[];
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
        marginTop: '20px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '13px',
      },
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
            <Link key={e.name} color='inherit' to={e.url} component={MaterialLink}>
              {e.name}
            </Link>
          ))}
          <Typography  color='textPrimary'>
            {props.active}
          </Typography>
        </Breadcrumbs>

        <Typography className={classes.title} color='textPrimary'>
          {props.title}
          {props.address ? <ButtonCopy copyText={props.address}  titleText='Copied to clipbord !'></ButtonCopy> : null  }
        </Typography>
      </Grid>
    </GridContainer>
  );
};

export default PageTitle;
