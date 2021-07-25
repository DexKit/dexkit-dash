import React, {useState, useEffect} from 'react';

import {DropResult} from 'react-beautiful-dnd';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import shuffle from 'utils/shuffleArray';

const GRID = 10;

type ICardContent = {id: string; content: string};

const MnemonicConfirm: React.FC<any> = ({mnemonics, setAllowStep}) => {
  const [valid, setValid] = useState(false);
  const [items, setItems] = useState(
    shuffle<ICardContent>(
      // @ts-ignore
      mnemonics.map((m, i) => ({id: `item-${i}`, content: m})),
    ),
  );

  const getListStyle = () => ({
    background: '#1D2125',
    display: 'flex',
    padding: GRID,
    overflow: 'auto',
    border: valid ? 'solid #0f0 2px' : 'solid #f00 2px',
  });

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to the items
    userSelect: 'none',
    padding: GRID * 2,
    margin: `0 ${GRID}px 0 0`,
    borderRadius: '6px',
    height: 50,

    // change background colour if dragging
    background: isDragging ? '#1f2126' : '#181A1F',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  // function to help  with reordering the result
  const reorder = (list: ICardContent[], start: number, end: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);

    return result;
  };

  useEffect(() => {
    setValid(() => items.map((i) => i.content).join() === mnemonics.join());
  }, [items, mnemonics]);

  useEffect(() => {
    setAllowStep(valid);
  }, [valid, setAllowStep]);

  function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) return;
    setItems(reorder(items, result.source.index, result.destination.index));
  }

  return (
    <Container maxWidth='lg'>
      <Box style={{width: '100%', textAlign: 'center'}}>
        <Typography variant='subtitle1'>
          Drag the words and place them in the correct order:
        </Typography>
      </Box>
      <Divider style={{margin: 10}} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' direction='horizontal'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={getListStyle()}
              {...provided.droppableProps}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Chip
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                      )}
                      clickable
                      label={item.content}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default MnemonicConfirm;
