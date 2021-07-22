import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router';
import FeatureButton from '../components/FeatureButton';

export default () => {
  const history = useHistory();

  const handleDeployClick = useCallback(
    (e) => {
      history.push('/wizard/deploy');
    },
    [history],
  );

  const handleInteractClick = useCallback(
    (e) => {
      history.push('/wizard/contract');
    },
    [history],
  );

  return (
    <Box py={{xs: 8}}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FeatureButton
                    header='Deploy'
                    subheader='Smart contract deployment'
                    onClick={handleDeployClick}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FeatureButton
                    header='Interact'
                    subheader='Interact with smart contracts'
                    onClick={handleInteractClick}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
