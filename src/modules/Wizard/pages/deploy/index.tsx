import IntlMessages from '@crema/utility/IntlMessages';
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
                  <IntlMessages id="app.wizard.typeOfSmartContract" />
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <WizardList slug={selectedSlug} onSelect={handleSelect} />
            <CardContent>
              <Box display='flex' justifyContent='space-between'>
                <Button onClick={handleCancel} variant='outlined'>
                <IntlMessages id="app.wizard.cancel" />
                </Button>
                <Button
                  color='primary'
                  disabled={selectedSlug === ''}
                  onClick={handleNext}
                  variant='contained'>
                  <IntlMessages id="app.wizard.next" />
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};
