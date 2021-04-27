import React from 'react';
import { GridContainer } from "@crema";
import { Breadcrumbs, Grid, Link, Typography } from "@material-ui/core";

interface Props {
  history: {url: string, name: string}[];
  active: string;
  title: string;
}

const PageTitle: React.FC<Props> = (props) => { 

  return (
    <GridContainer>
      <Grid item xs={12} md={12}>
        <Breadcrumbs aria-label="breadcrumb">
          {
            props.history.map(e => <Link key={e.name} color="inherit" href={e.url}>{e.name}</Link>)
          }
          <Typography color="textPrimary">{props.active}</Typography>
        </Breadcrumbs>
        <Typography variant="h4" color="textPrimary">{props.title}</Typography>
      </Grid>
    </GridContainer>
  );

}

export default PageTitle;