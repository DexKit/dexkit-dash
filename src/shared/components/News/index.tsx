import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import NewsList from './NewsList';
import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Fade, makeStyles} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import useNews from 'hooks/useNews';
import ErrorView from 'modules/Common/ErrorView';
import LoadingView from 'modules/Common/LoadingView';



const News = () => {
  
  const {loading, error, data} = useNews({limit: 3});

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error.message} />
      ) : (
        <Box className='card-hover'>
          <Fade in={shouldRender} timeout={1000}>
            <Box
              py={{xs: 5, sm: 5, xl: 5}}
              px={{xs: 6, sm: 6, xl: 6}}
              height='1'
              clone>
              <Card>
                <Box mb={1} display='flex' alignItems='center'>
                  <Box
                    component='h3'
                    fontFamily={Fonts.LIGHT}
                    fontSize={{xs: 18, sm: 20, xl: 22}}>
                    <IntlMessages id='dashboard.latestNews' />
                  </Box>
                  {/* <Box component='span' ml='auto'>
                <Link
                  color='secondary'
                  component='button'
                  className={classes.textRes}
                  underline='none'>
                  <IntlMessages id='common.viewAll' />
                </Link>
              </Box> */}
                </Box>
                <NewsList data={data} />
              </Card>
            </Box>
          </Fade>
        </Box>
      )}
    </>
  );
};

export default News;
