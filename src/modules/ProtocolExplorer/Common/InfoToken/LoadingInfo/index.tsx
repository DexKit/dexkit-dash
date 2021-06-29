import React from 'react';
import {Box} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

interface Props {}

const LoadingInfo: React.FC<Props> = (props) => {
  return (
    <Box>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Skeleton variant='circle' width={40} height={40} />
          <Skeleton
            variant='circle'
            width={40}
            height={40}
            style={{marginLeft: -10}}
          />
          <Box component='h3' fontSize={20} mx={3}>
            <Skeleton variant='text' width={120} />
          </Box>
        </Box>
        <Box display='flex'>
          <Box mr={3}>
            <Skeleton variant='circle' width={34} height={34} />
          </Box>

          <Box mr={3}>
            <Skeleton variant='circle' width={34} height={34} />
          </Box>
        </Box>
      </Box>

      <Box display='flex' alignItems='center'>
        <Box component='h2' fontSize={24}>
          <Skeleton variant='text' width={120} />
        </Box>
      </Box>
      <Box display='flex'>
        <Box component='h3' fontSize={13}>
          <Skeleton variant='text' width={200} />
        </Box>
      </Box>

      <Box pt={{md: 2, lg: 3, xl: 6}}>
        <Box
          mx={-2}
          mb={{xl: 1}}
          display='flex'
          flexWrap='wrap'
          justifyContent='space-between'>
          <Box
            flexGrow={1}
            flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
            mt={3}
            px={2}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              <Skeleton variant='text' width={120} />
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}}>
              <Skeleton variant='text' width={120} />
            </Box>
          </Box>
          <Box
            flexGrow={1}
            flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
            mt={3}
            px={2}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              <Skeleton variant='text' width={120} />
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}}>
              <Skeleton variant='text' width={120} />
            </Box>
          </Box>
          <Box
            flexGrow={1}
            flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
            mt={3}
            px={2}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              <Skeleton variant='text' width={120} />
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}}>
              <Skeleton variant='text' width={120} />
            </Box>
          </Box>
          <Box
            flexGrow={1}
            flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
            mt={3}
            px={2}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              <Skeleton variant='text' width={120} />
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}}>
              <Skeleton variant='text' width={120} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingInfo;
