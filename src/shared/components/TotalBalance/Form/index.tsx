import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabForm from './TabForm';
import Card from '@material-ui/core/Card';
import IntlMessages from '@crema/utility/IntlMessages';
import {Box, makeStyles} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {BuySellProps} from 'types/models/Crypto';
import {CremaTheme} from 'types/AppContextPropsType';
import { MyBalance } from 'types/bitquery/myBalance.interface';
interface Props {
  buySell: BuySellProps;
  balances: MyBalance[];
  onSend: ($e: React.MouseEvent<HTMLButtonElement, MouseEvent>, buySell: BuySellProps) => Promise<void> | void;
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
const BuySell: React.FC<Props> = ({buySell, balances, onSend}) => {

  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [address, setAddress] = useState('');

  if(buySell.address != null && buySell.address.length > 0){
    setAddress(buySell.address);
  }

  // @ts-ignore
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <Box  py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} clone>
      <Card >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          aria-label='simple tabs example'
          className={classes.muiTabsRoot}>
          <Tab
            className={classes.muiTab}
            style={{fontWeight: 'bold'}}
            label={<IntlMessages id='Send' />}
            {...a11yProps(0)}
            disabled={address != null && address.length > 0}
            onClick={($e) => onSend($e, { ...buySell, address })}
          />
          
        </Tabs>
        {value === 0 && <TabForm balances={balances} data={buySell.buyData} onSend={onSend} />}
      </Card>
    </Box>
  );
};

export default BuySell;
