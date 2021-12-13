import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {CremaTheme} from 'types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  expansionPanel: {
    borderRadius: theme.overrides.MuiCard.root.borderRadius,
    color: theme.palette.text.secondary,
    marginBottom: 2,
    padding: '10px 20px',

    '&:before': {
      display: 'none',
    },

    '&:first-child, &:last-child': {
      borderRadius: theme.overrides.MuiCard.root.borderRadius,
    },
  },
  expansionPanelSummary: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: 16,
    padding: 0,
  },
  expansionPanelDetailsRoot: {
    padding: '0 0 10px',
  },
}));

const faqList = [
  {
    id: 1,
    ques: 'What is a Wallet?',
    ans: 'To interact with blockchain to do swaps or transfers you need a wallet that can connect to the blockchain network. Examples of blockchain networks are Ethereum and Binance Smart Chain. As wallet users normally use Metamask or Wallet Connect',
  },
  {
    id: 2,
    ques: 'I only want to check my portfolio, can I do it?',
    ans: 'Yes, you can add accounts manually in the manage accounts page, and you can check your portfolio without need to connect a Wallet',
  },
];

const FaqList = () => {
  const classes = useStyles();
  return (
    <Box height='100%'>
      {faqList.map((item) => {
        return (
          <Accordion className={classes.expansionPanel} key={item.id}>
            <AccordionSummary
              className={classes.expansionPanelSummary}
              expandIcon={<ExpandMoreIcon />}>
              <Box>{item.ques}</Box>
            </AccordionSummary>
            <AccordionDetails className={classes.expansionPanelDetailsRoot}>
              <Box>{item.ans}</Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default FaqList;
