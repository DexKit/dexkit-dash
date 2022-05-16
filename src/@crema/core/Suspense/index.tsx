import React, {ReactNode} from 'react';
import {Player} from '@lottiefiles/react-lottie-player';
import Box from '@material-ui/core/Box';
import {useTheme} from '@material-ui/core';

interface SuspenseProps {
  children: ReactNode;
}

const Suspense: React.FC<SuspenseProps> = ({children}) => {
  const theme = useTheme();

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
          <Player
            autoplay
            loop
            src='https://assets7.lottiefiles.com/packages/lf20_bdqop5la.json'
            style={{width: '100%', height: '100%'}}
            background={theme.palette.background.default}
          />
        </Box>
      }>
      {children}
    </React.Suspense>
  );
  // return <React.Suspense fallback={<></>}>{children}</React.Suspense>;
};

export default Suspense;
