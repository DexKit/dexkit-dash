import React, {useContext} from 'react';

import {useIntl} from 'react-intl';

import styled from 'styled-components';
import {Box} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import {useStyles} from './index.style';
import {AppContext} from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';
import {Steps} from 'types/app';

interface Props {
  steps: Steps[];
  currentStepIndex: number;
}

const Circle = styled.div<{isDone: boolean; backgroundColor: string}>`
  min-width: 30px;
  height: 30px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Rect = styled.div<{isDone: boolean; backgroundColor: string}>`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 2px;
`;

const ProgressBar: React.FC<Props> = (props) => {
  const {steps, currentStepIndex} = props;
  const {messages} = useIntl();

  const classes = useStyles();

  const {theme} = useContext<AppContextPropsType>(AppContext);

  const dynamicProgressBar = [];
  dynamicProgressBar.push(
    <Circle
      key={0}
      isDone={true}
      backgroundColor={theme.palette.primary.main}
    />,
  );

  for (let i = 0; i < steps.length; i++) {
    const isDone = i < currentStepIndex;

    const backgroundColor = isDone
      ? theme.palette.primary.main
      : theme.palette.background.default;

    const iconColor = theme.palette.background.default;

    const step =
      steps[i] === Steps.MARKET || steps[i] === Steps.LIMIT
        ? (messages['app.order'] as string)
        : steps[i].toString();

    dynamicProgressBar.push(
      <Rect
        key={'rect1' + i}
        isDone={isDone}
        backgroundColor={backgroundColor}
      />,
    );

    dynamicProgressBar.push(<span key={'step' + i}>{step}</span>);

    dynamicProgressBar.push(
      <Rect
        key={'react2' + i}
        isDone={isDone}
        backgroundColor={backgroundColor}
      />,
    );

    dynamicProgressBar.push(
      <Circle
        key={'circle' + i}
        isDone={isDone}
        backgroundColor={backgroundColor}>
        {isDone && <DoneIcon style={{color: iconColor}} fontSize='small' />}
      </Circle>,
    );
  }

  return (
    <>
      <Box className={classes.progressBar}>{dynamicProgressBar}</Box>
    </>
  );
};

export default ProgressBar;
