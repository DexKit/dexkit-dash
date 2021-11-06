import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import WizardList from 'modules/Wizard/components/WizardList';
import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router';
import MainLayout from 'shared/components/layouts/main';

interface Props {}

export default (props: Props) => {
  const history = useHistory();

  const [selectedSlug, setSelectedSlug] = useState('');

  const handleNext = useCallback(() => {
    history.push(`/wizard/deploy/${selectedSlug}`);
  }, [selectedSlug, history]);

  const handleCancel = useCallback(() => {
    history.push(`/wizard`);
  }, [history]);

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  return (
    <MainLayout>
      <Grid container justify='center' spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Typography align='center' variant='h5'>
                    What type of smart contract do you need?
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <WizardList slug={selectedSlug} onSelect={handleSelect} />
            <CardContent>
              <Box display='flex' justifyContent='space-between'>
                <Button onClick={handleCancel} variant='outlined'>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  disabled={selectedSlug === ''}
                  onClick={handleNext}
                  variant='contained'>
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};
