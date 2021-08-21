import React, {ReactNode} from 'react';
import Grid from '@material-ui/core/Grid';
import {useBreakPointDown} from '../../utility/Utils';

interface GridContainerProps {
  children: ReactNode;
  justify?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';
  alignContent?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'stretch';
  alignItems?: 'center' | 'baseline' | 'flex-start' | 'flex-end' | 'stretch';
  [x: string]: any;
}

const GridContainer: React.FC<GridContainerProps> = ({children, ...others}) => {
  return (
    <Grid container spacing={useBreakPointDown('md') ? 4 : 8} {...others}>
      {children}
    </Grid>
  );
};

export default GridContainer;
