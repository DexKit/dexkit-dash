import React, {ReactNode} from 'react';
import Box from '@material-ui/core/Box';
import {ReactComponent as LeagueLogoImage} from 'assets/images/dashboard/league-logo.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Typography} from '@material-ui/core';
interface SuspenseProps {
  children: ReactNode;
}

const Suspense: React.FC<SuspenseProps> = ({children}) => {
  return (
    <React.Suspense
      fallback={
        <Box
          height='100%'
          display='flex'
          flex={1}
          alignItems='center'
          justifyContent='center'
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}>
       
              <LeagueLogoImage />

              <CircularProgress color={'primary'} />
        
    
        
   
        </Box>
      }>
      {children}
    </React.Suspense>
  );
  // return <React.Suspense fallback={<></>}>{children}</React.Suspense>;
};

export default Suspense;
