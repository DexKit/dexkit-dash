import {useMediaQuery, useTheme} from '@material-ui/core';

export function useMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile;
}
