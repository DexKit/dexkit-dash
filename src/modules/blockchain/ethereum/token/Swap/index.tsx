import React from 'react';



import { BuySellProps } from 'types/models/Crypto';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import { makeStyles, Box, Card, Tabs, Tab } from '@material-ui/core';
import TabFormSwap from './TabFormSwap';
import TabFormLimit from './TabFormLimit';

interface Props {
  buySell: BuySellProps;
}

const Swap: React.FC<Props> = ({buySell}) => {

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

  const [value, setValue] = React.useState(0);

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
            label={'Swap'}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.muiTab}
            label={'Limit'}
            {...a11yProps(1)}
          />
        </Tabs>
        {value === 0 && <TabFormSwap data={buySell.buyData} />}
        {value === 1 && <TabFormLimit data={buySell.sellData} />}
      </Card>
    </Box>
  );
};

export default Swap;
