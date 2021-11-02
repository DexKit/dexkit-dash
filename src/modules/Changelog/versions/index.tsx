import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import {Fonts} from 'shared/constants/AppEnums';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    item: {
      marginBottom: '4px',
      marginLeft: '2px',
    },
  }),
);

const Changelog = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Box
        component='h3'
        color='text.primary'
        fontWeight={Fonts.BOLD}
        ml={2}
        mb={2}>
        Changelog
      </Box>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.6.5'
          id='panelv0.0.6.5-header'>
          <Typography className={classes.heading}>
            v0.0.6-5 - 01-11-2021{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
             <Typography className={classes.item}>
                Fix's on Coinleagues
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>


      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.6'
          id='panelv0.0.6-header'>
          <Typography className={classes.heading}>
            v0.0.6 - 15-10-2021{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
             <Typography className={classes.item}>
                Major Rebrand
            </Typography>
            <Typography className={classes.item}>
              CoinLeagues:
              <br />
              1. Added CoinLeagues on Beta
              <br />
            </Typography>
            <Typography className={classes.item}>
              Added Polygon support
            </Typography>
            <Typography className={classes.item}>
              Added Wizard:
              <br />
              1. Create Collections
              <br />
              <br />
              1. Create Tokens
              <br />
            </Typography>
            
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.5'
          id='panelv0.0.5-header'>
          <Typography className={classes.heading}>
            v0.0.5 - 30-07-2021{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography className={classes.item}>
              SWAP:
              <br />
              1. Added Multichain Swaps
              <br />
            </Typography>
            <Typography className={classes.item}>Added Support</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.4'
          id='panelv0.0.4-header'>
          <Typography className={classes.heading}>
            v0.0.4 - 19-07-2021{' '}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography className={classes.item}>
              NFT WALLET:
              <br />
              1. List wallet assets.
              <br />
              2. View details from assets
              <br />
              * Asset info like: Name, image, description, collection name
              <br />
              * Listings, Offers and Trading history
              <br />
              3. Transfer assets to another addresses
              <br />
              4. Make and accept offers to assets.
              <br />
              5. Accept offers from users
              <br />
              6. Create listings from assets
              <br />
              * Schedule listing
              <br />
              * Set an ending price
              <br />* Wait for highest bid (English Auction)
            </Typography>
            <Typography className={classes.item}>
              MANAGE
              <br />* Added Aggregator Whitelabel
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.3'
          id='panelv0.0.3-header'>
          <Typography className={classes.heading}>
            v0.0.3 - 2-07-2021
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography className={classes.item}>
              Added Transfer, Accept and make Offer on NFT wallets using OPEN
              Sea, Orders on Open Sea will show in
            </Typography>
            <Typography className={classes.item}>
              Major Design/Refactor simplicity changes to integrate in a easy
              way BSC and ETH tokens in one place, and upcoming blockchains
            </Typography>
            <Typography className={classes.item}>
              Add Label support to accounts
            </Typography>
            <Typography className={classes.item}>
              Added Charts for all BSC tokens
            </Typography>
            <Typography className={classes.item}>
              Change on the header
            </Typography>
            <Typography className={classes.item}>
              Added Info Dialogs in all pages
            </Typography>
            <Typography className={classes.item}>Several bugs fix’s</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.2'
          id='panelv0.0.2-header'>
          <Typography className={classes.heading}>v0.0.2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography className={classes.item}>
              Trade: User can swap or place limit orders, check trades history
              and current active orders, see Decentralized Protocols Chart or
              Binance Chart (Only Binance listed tokens are supported), do
              reasearch about the project, favorite tokens. User can check
              history and trade analytics with support for Profit/Loss, average
              buy/sell price
            </Typography>
            <Typography className={classes.item}>
              Wallet: User can check their BSC and Ethereum tokens, check their
              trade history and transfers, see DeFi assets, chart with 7, 30,
              180 Days of the asset history. DexKit supports multiaccount and
              easy switch between account and networks, can receive and send
              tokens
            </Typography>
            <Typography className={classes.item}>
              Favorites: User can see their favorite tokens, and go to trade
              page. Favorite is detected on BSC or Ethereum
            </Typography>
            <Typography className={classes.item}>
              NFT wallet: User can see their cards and check details on it, User
              can easily switch between accounts
            </Typography>
            <Typography className={classes.item}>
              Protocol Explorer: User can investigate their tokens and check
              last trades, charts, liquidity across the most used protocols,
              filter by trade amount and dates. NOTE: This Module will be
              refactored to be per chain instead of per protocol
            </Typography>
            <Typography className={classes.item}>
              My APPs: User can manage their whitelabels here, with support at
              the moment for NFT marketplace
            </Typography>
            <Typography className={classes.item}>
              Affiliate: User can generate affiliate link for BSC and Ethereum,
              and check all transfers received to their affiliate wallet
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panelv0.0.1'
          id='panelv0.0.1-header'>
          <Typography className={classes.heading}>v0.0.1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className={classes.item}>Basic Skeleton</Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default Changelog;
