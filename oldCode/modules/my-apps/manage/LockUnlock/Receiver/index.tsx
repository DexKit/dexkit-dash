import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReceiverForm from './ReceiverForm';
import Card from '@material-ui/core/Card';
import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Dialog, makeStyles} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  open: boolean,
  onClose: () => void,
}

const Receiver: React.FC<Props> = (props) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    muiTabsRoot: {
      position: 'relative',
      marginTop: -8,
      marginLeft: -8,
      marginBottom: 16,
      [theme.breakpoints.up('xl')]: {
        marginLeft: -20,
        marginBottom: 32,
      },
      '& .Mui-selected': {
        fontFamily: Fonts.LIGHT,
      },
    },
    muiTab: {
      fontSize: 16,
      textTransform: 'capitalize',
      padding: 0,
      marginLeft: 8,
      marginRight: 8,
      minWidth: 10,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        marginLeft: 20,
        marginRight: 20,
      },
    },
  }));

  const classes = useStyles();

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <div>
      <Dialog fullWidth maxWidth="xs"  open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">

        <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} clone>
          <Card >
            <Tabs
              indicatorColor='primary'
              textColor='primary'
              aria-label='simple tabs example'
              className={classes.muiTabsRoot}>
              <Tab
                className={classes.muiTab}
                style={{fontWeight: 'bold'}}
                label={<IntlMessages id='Receive' />}
                {...a11yProps(0)}
              />
            </Tabs>

            <ReceiverForm  />
          
          </Card>
        </Box>

      </Dialog>
    </div>
  );
};

export default Receiver;
