import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  makeStyles,
} from '@material-ui/core';
import {Kit} from './kit';
import clsx from 'clsx';
import {CremaTheme} from 'types/AppContextPropsType';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import ConfirmationDialog from '@crema/core/ConfirmationDialog';
import {WhitelabelTypes} from 'types/myApps';
import {useSufficientBalance} from 'hooks/balance/useSufficientBalance';
import Aggregator from 'assets/images/aggregator.png';
import Marketplace from 'assets/images/marketplace.png';
import Exchange from 'assets/images/exchange.png';
import {blue, indigo, teal} from '@material-ui/core/colors';
import {useSingleBalance} from 'hooks/balance/useSingleBalance';

const useStyles = makeStyles((theme: CremaTheme) => ({
  statsCard: {
    fontFamily: Fonts.MEDIUM,
    fontSize: 20,
    lineHeight: '2rem',
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    padding: '20px 24px',
  },
  cardContent: {
    padding: '0px 24px 20px 24px',
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
  const [amount, setAmount] = useState(0);

  const {data, loading} = useSingleBalance(
    process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN ?? '',
    EthereumNetwork.ethereum,
  );

  const {data: balance} = useSufficientBalance(amount, {
    symbol: 'KIT',
    address: process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN ?? '',
    decimals: 18,
    name: 'DexKit',
    tokenType: 'ERC20',
    __typename: 'Currency',
  });
  const [showDialog, setShowDialog] = useState(false);
  const [urlRedirect, setUrlRedirect] = useState('#');

  // const dispatch = useDispatch();

  // const { kitsData, userKits } = useSelector<AppState, AppState['myApps']>(({myApps}) => myApps);

  // useEffect(() => {
  //   dispatch(onGetAllKits());
  //  // dispatch(onGetUserKits(account ?? '0x000000000000000000000000000000000'));
  // }, [dispatch]);

  const [allKitValues] = useState([
    Number(process.env.REACT_APP_APP_COST_KIT_AGGREGATOR),
    Number(process.env.REACT_APP_APP_COST_KIT_EXCHANGE),
    Number(process.env.REACT_APP_APP_COST_KIT_MARKETPLACE),
  ]);

  const buttonAction = (url: string, type: WhitelabelTypes) => {
    switch (type) {
      case 'AGGREGATOR': {
        setAmount(allKitValues[0]);
        break;
      }
      case 'DEX': {
        setAmount(allKitValues[1]);
        break;
      }
      case 'MARKETPLACE': {
        setAmount(allKitValues[2]);
        break;
      }
    }
    setUrlRedirect(url);
    if (data && data?.value && data?.value < amount) {
      setShowDialog(true);
    } else {
      history.push(url);
    }
  };

  const confimDialog = useCallback(() => {
    history.push(urlRedirect);
    setShowDialog(false);
  }, [setShowDialog, history, urlRedirect]);

  const cancelDialg = useCallback((x: boolean) => setShowDialog(false), [
    setShowDialog,
  ]);

  return (
    <>
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
              icon={Aggregator}
              bgColor={blue[500]}
              color={bgColor}
              value={allKitValues[0]}
              name={'Aggregator'}
              button={{
                color: 'secondary',
                action: (
                  $e: React.MouseEvent<
                    HTMLAnchorElement | HTMLButtonElement,
                    MouseEvent
                  >,
                ) => buttonAction(`/my-apps/wizard/aggregator`, 'AGGREGATOR'),
                title: 'ADD +',
              }}
            />

            {/*  <Kit
              key={'exg'}
              icon={Exchange}
              color={bgColor}
              bgColor={teal[600]}
              value={allKitValues[1]}
              name={'Exchange'}
              button={{
                color: 'secondary',
                action: ($e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => buttonAction(`/my-apps/wizard/exchange`, 'DEX'),
                title: 'ADD +'
              }}
            />*/}

            <Kit
              key={'market'}
              icon={Marketplace}
              color={bgColor}
              bgColor={indigo[700]}
              value={allKitValues[2]}
              name={'Marketplace'}
              button={{
                color: 'secondary',
                action: (
                  $e: React.MouseEvent<
                    HTMLAnchorElement | HTMLButtonElement,
                    MouseEvent
                  >,
                ) => buttonAction(`/my-apps/wizard/marketplace`, 'MARKETPLACE'),
                title: 'ADD +',
              }}
            />
          </List>
        </CardContent>
      </Card>
      <ConfirmationDialog
        title={`You do not have enough kit to perform this functionality. Do you still want to continue?`}
        dialogTitle={'Kit amount insufficient'}
        open={showDialog}
        onConfirm={confimDialog}
        onDeny={cancelDialg}
      />
    </>
  );
};

export default KitMarket;
