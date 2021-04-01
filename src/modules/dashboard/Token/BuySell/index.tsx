import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import {Box, makeStyles} from '@material-ui/core';
import { BigNumber } from '@0x/utils';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {BuySellProps} from '../../../../types/models/Crypto';
import {CremaTheme} from '../../../../types/AppContextPropsType';
import { AppState } from 'redux/store';
import { onGetConfigFile } from 'redux/actions/ConfigFile.actions';
import TabForm from './TabForm';
import { useWeb3 } from 'hooks/useWeb3';


interface Props {
  buySell: BuySellProps;
}

const BuySell: React.FC<Props> = ({buySell}) => {
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
      fontWeight: 'bold',
      minWidth: 10,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        marginLeft: 20,
        marginRight: 20,
      },
    },
  }));

  const classes = useStyles();
  const { chainId } = useWeb3();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetConfigFile());
  }, [ dispatch ]);

  const { configFile } = useSelector<AppState, AppState['configFile']>(
    ({ configFile }) => configFile
  );

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
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height='1' clone>
      <Card>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          
          aria-label='simple tabs example'
          className={classes.muiTabsRoot}>
          <Tab
            className={classes.muiTab}
            label={<IntlMessages id='Market' />}
            {...a11yProps(0)}
          />
           <Tab
            className={classes.muiTab}
            label={<IntlMessages id='Limit' />}
            {...a11yProps(1)}
          />
          <Tab
            className={classes.muiTab}
            label={<IntlMessages id='Stop' />}
            {...a11yProps(1)}
          />
        </Tabs>
        {value === 0 && <TabForm data={buySell.buyData} tokens={configFile?.tokens ?? []} chainId={(new BigNumber(chainId ?? 1)).toNumber()}/>}
        {value === 1 && <TabForm data={buySell.sellData} tokens={configFile?.tokens ?? []} chainId={(new BigNumber(chainId ?? 1)).toNumber()}/>}
      </Card>
    </Box>
  );
};

export default BuySell;
