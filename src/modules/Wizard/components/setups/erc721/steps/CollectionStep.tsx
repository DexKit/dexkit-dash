import React, {useCallback} from 'react';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Button,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
} from '@material-ui/core';
import ImageUploadButton from '../ImageUploadButton';

import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {Alert} from '@material-ui/lab';
import {isValidURL} from 'utils/browser';

interface CollectionStepProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (file: File | null) => void;
  onNext: () => void;
  onBack: () => void;
  collectionImage: File | null;
  values: any;
}

export const CollectionStep = (props: CollectionStepProps) => {
  const {onChange, onImageChange, onNext, onBack, values, collectionImage} =
    props;

  const isFormValid = useCallback(() => {
    let hasName = values.name !== '';
    let hasDescription = values.description !== '';
    let hasSymbol = values.symbol !== '';
    let hasImage = collectionImage !== null;

    if (!hasName || !hasDescription || !hasSymbol || !hasImage) {
      return false;
    }

    if (values.url !== '' && !isValidURL(values.url)) {
      return false;
    }

    return true;
  }, [values, collectionImage]);

  return (
    <Grid container spacing={4} justify='center'>
      <Grid item xs={12} sm={10}>
        <Card>
          <CardContent>
            <form>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    py={4}>
                    <ImageUploadButton
                      error={collectionImage === null}
                      onChange={onImageChange}
                      file={collectionImage}
                    />
                  </Box>
                </Grid>

                {!collectionImage ? (
                  <Grid item xs={12}>
                    <Alert severity='warning'>
                      Select an image for your collection
                    </Alert>
                  </Grid>
                ) : null}
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    label='Name'
                    variant='outlined'
                    name='name'
                    value={values.name}
                    error={values.name === ''}
                    helperText=''
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='The name of your collection'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label='Symbol'
                    variant='outlined'
                    name='symbol'
                    value={values.symbol}
                    error={values.symbol === ''}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='Symbol used to identify the collection in the blockchain'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    label='Description'
                    variant='outlined'
                    name='description'
                    value={values.description}
                    error={values.description === ''}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='URL'
                    variant='outlined'
                    name='url'
                    type='url'
                    value={values.url}
                    onChange={onChange}
                    error={values.url !== '' && !isValidURL(values.url)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='URL used by the users to learn more information about the collection.'>
                            <HelpIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Paper>
          <Box p={4}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                variant='outlined'>
                Back
              </Button>
              <Button
                disabled={!isFormValid()}
                startIcon={<ArrowForwardIcon />}
                onClick={onNext}
                variant='contained'
                color='primary'>
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CollectionStep;
