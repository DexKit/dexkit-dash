import React, {useEffect, useState} from 'react';
import {Grow, makeStyles, Box, Zoom} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AppCard from '@crema/core/AppCard';
import {Fonts} from 'shared/constants/AppEnums';
import {ReportCards} from 'types/models/Ecommerce';
import StaticsGraph from './StaticsGraph';
import {getDexkit} from 'services/rest/coingecko';
import useFetch from 'use-http';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import {COINGECKO_URL} from 'shared/constants/AppConst';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles({
  chartContainer: {
    minWidth: 160,
  },
});

interface Props {
  data: ReportCards | undefined;
  timeout: number;
}

const InfoToken: React.FC<Props> = ({data, timeout}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (data != null) {
      if (timeout != null) {
        const timer = setTimeout(() => {
          setShouldRender(true);
        }, timeout);
        return () => clearTimeout(timer);
      }
    }
  }, [data]);

  const classes = useStyles();

  return (
    <Box className='card-hover'>
      <Grow
        in={shouldRender}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={500}>
        <AppCard>
          <Box display='flex'>
            <Box pr={3}>
              {data ? (
                <>
                  <Box mb={0.5} component='h3' fontSize={20}>
                    {data.value}
                  </Box>
                  <Box component='p' color='#737989'>
                    {data.type}
                  </Box>
                  <Box style={{maxHeight: '25px', maxWidth: '25px'}}>
                    <img
                      src={data.icon}
                      height={'25px'}
                      width={'25px'}
                      alt='currency icon'
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Skeleton
                    variant='text'
                    width={100}
                    style={{marginBottom: 1}}
                  />
                  <Skeleton
                    variant='text'
                    width={100}
                    style={{marginBottom: 2}}
                  />
                  <Skeleton variant='circle' width={25} height={25} />
                </>
              )}
            </Box>
            <Box className={classes.chartContainer} flex={1} pl={1}>
              {data ? (
                <>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    fontWeight={Fonts.BOLD}
                    color={data.strokeColor}>
                    Last 7 days
                  </Box>
                  <StaticsGraph
                    id={data.id}
                    graphData={data.graphData}
                    strokeColor={data.strokeColor}
                  />
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    fontWeight={Fonts.BOLD}
                    color={data.strokeColor}>
                    {data.growth > 0 ? (
                      <ArrowUpwardIcon style={{color: data.strokeColor}} />
                    ) : (
                      <ArrowDownwardIcon style={{color: data.strokeColor}} />
                    )}
                    {data.growth.toFixed(2)}%
                  </Box>
                </>
              ) : (
                <Box display='flex' flexDirection='column' alignItems='center'>
                  <Skeleton
                    variant='text'
                    width={80}
                    style={{marginBottom: 5}}
                  />
                  <Skeleton variant='rect' width='100%' height={50} />
                  <Skeleton variant='text' width={80} style={{marginTop: 5}} />
                </Box>
              )}
            </Box>
          </Box>
        </AppCard>
      </Grow>
    </Box>
  );
};

export default InfoToken;
