import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Dialog, Tabs, Tab, Card, makeStyles} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import SenderForm from './SenderForm';
import { GetMyBalance_ethereum_address_balances } from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

interface Props {
  open: boolean;
  balances: GetMyBalance_ethereum_address_balances[];
  onClose: () => void;
}

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

const Sender: React.FC<Props> = (props) => {
  const classes = useStyles();

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <div>
      <Dialog fullWidth maxWidth="xs" open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">

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
                label={<IntlMessages id='Send' />}
                {...a11yProps(0)}
                // disabled={address != null && address.length > 0}
              />
            </Tabs>

            <SenderForm balances={props.balances} />

          </Card>
        </Box>

      </Dialog>
    </div>
  );
};

export default Sender;
