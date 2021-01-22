import React from 'react';
import AppCard from '../../../../@crema/core/AppCard';
import Avatar from '@material-ui/core/Avatar';
import {Box, makeStyles} from '@material-ui/core';
import {CremaTheme} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  topBorder: {
    borderTop: `solid 1px ${theme.palette.grey[200]}`,
  },
  rightBorder: {
    borderRight: `solid 1px ${theme.palette.grey[200]}`,
  },
}));

const ProfileCard = () => {
  const classes = useStyles();
  console.log(classes)
  return (
    <AppCard>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'>
        <Avatar
          style={{height: 40, width: 40}}
          src={'/assets/images/avatar/A10.jpg'}
        />
        <Box p={3} mb={4} mt={2} component='h5'>
          DexKit
        </Box>
        <p >
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur.
      </p>

       
      </Box>
    </AppCard>
  );
};

export default ProfileCard;
