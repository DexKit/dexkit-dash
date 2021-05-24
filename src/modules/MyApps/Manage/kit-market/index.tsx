import { useWeb3 } from 'hooks/useWeb3';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { AppState } from 'redux/store';
import { Card, CardContent, CardHeader,  List, makeStyles } from '@material-ui/core';
import { Kit } from './kit';
import { Kit as KytType } from 'types/models/Kit';
import clsx from 'clsx';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import { BigNumber } from "@0x/utils";
import { onGetAllKits, onGetUserKits } from 'redux/_myapps/thunks';



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

// function generate(element: any) {
//   const { data, icon, color, history }: { data: { kitsData: KytType[], userkits: KytType[] }, icon: any, color: string, history: any} = element;

//   return (data?.kitsData ?? []).map((element) => {
//     // React.cloneElement(element, {
//     //   key: value,
//     // }),
//     const value  = element.price_usd != null && typeof element.price_usd === 'string' ? 
//       parseFloat((element.price_usd as string)).toFixed(4) : 
//       parseFloat((element.price_usd as BigNumber | number).toFixed(4));
//     const exist = (data.userkits ?? []).findIndex( _u => _u.name === element.name) >= 0 ;
//     const button = {
//       color: exist ?  'secondary' : 'primary' as "inherit" | "primary" | "secondary" | "default" | undefined,
//       action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => history.push(`/my-apps/wizard/${element.name.toLowerCase()}`),
//       title: exist ? 'REMOVE -': 'ADD +'
//     }

//     return (<Kit
//       key={element.c_id}
//       icon={element.icon ?? icon}
//       color={color}
//       // value={value ?? 0.0}
//       value={''}
//       name={element.name}
//       button={button}
//     />);
//   });
// }


const KitMarket: React.FC<KitMarketProps> = ({icon, bgColor, heading}) => {
  const classes = useStyles({bgColor});

  // const { account } = useWeb3();
  const history = useHistory();

  // const dispatch = useDispatch();

  // const { kitsData, userKits } = useSelector<AppState, AppState['myApps']>(({myApps}) => myApps);

  // useEffect(() => {
  //   dispatch(onGetAllKits());
  //  // dispatch(onGetUserKits(account ?? '0x000000000000000000000000000000000'));
  // }, [dispatch]);

  return (
    <Card>
      
      <CardHeader
        className={clsx(classes.statsCard, 'card-hover')}
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={heading}
      />

      <CardContent className={classes.cardContent}>
        <List dense={true}>
          {/* {generate({ data: { kitsData, userKits}, icon, bgColor, history})} */}

          <Kit
            key={'agg'}
            icon={icon}
            color={bgColor}
            value={'Aggregator'}
            name={'Aggregator'}
            button={{
              color: 'secondary',
              action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => history.push(`/my-apps/wizard/aggregator`),
              title: 'ADD +'
            }}
          />
          
          <Kit
            key={'exg'}
            icon={icon}
            color={bgColor}
            value={'Exchange'}
            name={'Exchange'}
            button={{
              color: 'secondary',
              action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => history.push(`/my-apps/wizard/exchange`),
              title: 'ADD +'
            }}
          />
          
          <Kit
            key={'market'}
            icon={icon}
            color={bgColor}
            value={'Marketplace'}
            name={'Marketplace'}
            button={{
              color: 'secondary',
              action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => history.push(`/my-apps/wizard/marketplace`),
              title: 'ADD +'
            }}
          />
          
        </List>
      </CardContent>
    
    </Card>
  );
}

export default KitMarket;
