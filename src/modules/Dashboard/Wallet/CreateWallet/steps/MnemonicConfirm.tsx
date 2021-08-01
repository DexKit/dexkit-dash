import React, {useState, useEffect} from 'react';

import {ListManager} from 'react-beautiful-dnd-grid';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Breakpoint} from '@material-ui/core/styles/createBreakpoints';

import shuffle from 'utils/shuffleArray';

type ICardContent = {id: string; content: string};

const useStyles = makeStyles((theme) => ({
  mnemonics: {
    [theme.breakpoints.down('sm')]: {
      height: 35,
      width: 70,
    },
    [theme.breakpoints.up('md')]: {
      height: 40,
      width: 80,
    },
    [theme.breakpoints.up('lg')]: {
      height: 50,
      width: 100,
    },
    margin: 5,
    backgroundColor: theme.palette.primary.main,
    fontSize: 14,
  },
}));

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

const MnemonicConfirm: React.FC<any> = ({mnemonics, setAllowStep}) => {
  const width = useWidth();
  const classes = useStyles();

  console.log({width});

  const [valid, setValid] = useState(false);
  const [items, setItems] = useState(
    shuffle<ICardContent>(
      // @ts-ignore
      mnemonics.map((m, i) => ({id: `item-${i}`, content: m})),
    ),
  );

  // function to help  with reordering the result
  const reorder = (list: ICardContent[], start: number, end: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);

    return result;
  };

  const onDragEnd = (sourceIndex: number, destinationIndex: number) => {
    // dropped outside the list
    if (sourceIndex === destinationIndex) return;
    setItems(reorder(items, sourceIndex, destinationIndex));
  };

  useEffect(() => {
    setValid(() => items.map((i) => i.content).join() === mnemonics.join());
  }, [items, mnemonics]);

  useEffect(() => {
    setAllowStep(valid);
  }, [valid, setAllowStep]);

  return (
    <Container>
      <Box style={{width: '100%', textAlign: 'center'}}>
        <Typography variant='subtitle1'>
          Drag the words and place them in the correct order:
        </Typography>
      </Box>

      <Divider style={{margin: 10}} />

      <Box
        style={{
          display: 'table',
          margin: '0 auto',
          border: valid ? 'solid #0f0 2px' : 'solid #f00 2px',
        }}>
        <ListManager
          maxItems={items.length / 3}
          items={items}
          direction='horizontal'
          onDragEnd={onDragEnd}
          render={(item) => (
            <Chip className={classes.mnemonics} label={item.content} />
          )}
        />
      </Box>
    </Container>
  );
};

export default MnemonicConfirm;
