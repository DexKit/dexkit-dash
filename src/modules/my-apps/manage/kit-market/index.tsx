import { useWeb3 } from 'hooks/useWeb3';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onGetAllKits, onGetUserKits } from 'redux/actions/MyApps';
import { AppState } from 'redux/store';
import { Card, CardContent, CardHeader, IconButton, List, makeStyles } from '@material-ui/core';
import { Kit } from './kit';
import { Kit as KytType } from 'types/models/Kit';
import clsx from 'clsx';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import { BigNumber } from "@0x/utils";
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme: CremaTheme) => ({
  statsCard: {
    fontFamily: Fonts.MEDIUM,
    fontSize: 20,
    lineHeight: "2rem",
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    padding: "20px 24px"
  },
  cardContent:{
    padding: "0px 24px 20px 24px"
  },
  root: {
    height: 30,
    width: 30,
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    backgroundColor: (props: {bgColor: string}) => props.bgColor,
    [theme.breakpoints.up('md')]: {
      height: 45,
      width: 45,
    },
    [theme.breakpoints.up('xl')]: {
      height: 70,
      width: 70,
    },
  },
}));

interface KitMarketProps {
  icon: string;
  bgColor: string;
  data: {
    price: number;
    increment: number;
  };
  heading: any;
}

function generate(element: any) {
  const { data, icon, color }: { data: { kitsData: KytType[], userkits: KytType[] }, icon: any, color: string} = element;
  return (data?.kitsData ?? []).map((element) => {
    // React.cloneElement(element, {
    //   key: value,
    // }),
    const value  = element.price_usd != null && typeof element.price_usd === 'string' ? 
      parseFloat((element.price_usd as string)).toFixed(4) : 
      parseFloat((element.price_usd as BigNumber | number).toFixed(4));
    const exist = (data.userkits ?? []).findIndex( _u => _u.name === element.name) >= 0 ;
    const button = {
      color: exist ?  'secondary' : 'primary' as "inherit" | "primary" | "secondary" | "default" | undefined,
      action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => console.log(`clicou; ${$e}`),
      title: exist ? 'REMOVE -': 'ADD +'
    }
    return (<Kit
      key={element.c_id}
      icon={element.icon ?? icon}
      color={color}
      value={value ?? 0.0}
      name={element.name}
      button={button}
    />);
  });
}
const KitMarket: React.FC<KitMarketProps> = ({
  // data,
  icon,
  bgColor,
  heading
}) => {

  const { account } = useWeb3();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetAllKits());
    dispatch(onGetUserKits(account ?? '0x000000000000000000000000000000000'));
  }, [dispatch]);


  const {
    kitsData, 
    userkits, 
    // tokenData
  } = useSelector<AppState, AppState['myApps']>(
    ({myApps}) => myApps
  );

  console.log('userkits', userkits);

  
  const classes = useStyles({bgColor});
  return (
    // <AppCard 
    // title={heading}
    <Card>
      <CardHeader
        className={clsx(classes.statsCard, 'card-hover')}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={heading}
      />
      <CardContent className={classes.cardContent}>
        <List dense={true}>
          {generate({ data: { kitsData, userkits}, icon, bgColor})}
        </List>
      </CardContent>
    </Card>
    
    // </AppCard>
  );
}

export default KitMarket;
