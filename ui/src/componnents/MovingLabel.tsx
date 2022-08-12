import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import { MoveDirection } from './BlindSelector';

const ANIMATION_TIME = 0.35;
const DELAY = ANIMATION_TIME * 1000;
const OFFSET = 5;

const LabelContainer = styled.div<{ time: number; transition: number }>`
  font-family: ${fonts.main};
  position: absolute;
  transition: transform ${(props) => props.time}s ease-in-out;
  color: #2c2a25;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
  width: 65%;
  text-align: center;
  opacity: ${(props) => (props.time !== 0 ? 1 : 0)};
  transform: translateY(${(props) => props.transition}vh);
`;

const Overlay = styled.div<{ isError?: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: 0.5s;
  background-color: ${(props) =>
    props.isError === undefined ? 'floralwhite' : props.isError ? 'red' : '#c5ff00'};
  z-index: 1;
`;

enum MovingState {
  LABEL_ON,
  LABEL_OFF,
  BEFORE_RES,
  RESULT
}

interface Props {
  label: string;
  direction: MoveDirection;
  isError?: boolean;
  clearError: () => void;
}

const MovingLabel = ({ label, direction, isError, clearError }: Props) => {
  const [transitionTime, setTransitionTime] = useState<number>(ANIMATION_TIME);
  const [labelPositions, setLabelPositions] = useState<number>(0);
  const [movingState, setMovingState] = useState<MovingState>(MovingState.LABEL_ON);
  const [infoLabelMessage, setInfoLabelMessage] = useState<string>('OK');
  const [infoTransitionTime, setInfoTransitionTime] = useState<number>(0);
  const [infoLabelPositions, setInfoLabelPositions] = useState<number>(OFFSET);

  useEffect(() => {
    if (isError !== undefined) isError ? setInfoLabelMessage('ERROR') : setInfoLabelMessage('OK');
  }, [isError]);

  useEffect(() => {
    if (direction) beginAnimation();
    else if (movingState === MovingState.BEFORE_RES) endAnimation();
  }, [direction]);

  useEffect(() => {
    if (labelPositions && !movingState) setInfoLabelPositions(labelPositions * -1);
  }, [labelPositions]);

  useEffect(() => {
    if (infoLabelPositions && movingState === MovingState.RESULT) {
      setLabelPositions(0);
      setMovingState(MovingState.LABEL_ON);
    }
  }, [infoLabelPositions]);

  useEffect(() => {
    if (!transitionTime) {
      setLabelPositions(labelPositions * -1);
      setTimeout(() => setMovingState(MovingState.BEFORE_RES), 50);
    }
  }, [transitionTime]);

  useEffect(() => {
    switch (movingState) {
      case MovingState.LABEL_ON:
        if (infoTransitionTime) setTimeout(() => setInfoTransitionTime(0), DELAY);
        if (isError !== undefined) setTimeout(() => clearError(), isError ? 3000 : 700);
        break;
      case MovingState.LABEL_OFF:
        setTransitionTime(0);
        break;
      case MovingState.BEFORE_RES:
        setInfoTransitionTime(ANIMATION_TIME);
        if (!direction) endAnimation();
        break;
      case MovingState.RESULT:
        setInfoLabelPositions(labelPositions * -1);
        break;
    }
  }, [movingState]);

  const beginAnimation = () => {
    clearError();
    direction === MoveDirection.UP ? setLabelPositions(-OFFSET) : setLabelPositions(OFFSET);
    setTimeout(() => setMovingState(MovingState.LABEL_OFF), DELAY);
  };

  const endAnimation = () => {
    setInfoLabelPositions(0);
    setTransitionTime(ANIMATION_TIME);
    setTimeout(() => setMovingState(MovingState.RESULT), DELAY);
  };

  return (
    <>
      <Overlay isError={isError} />
      <LabelContainer time={transitionTime} transition={labelPositions}>
        {label}
      </LabelContainer>
      <LabelContainer transition={infoLabelPositions} time={infoTransitionTime}>
        {infoLabelMessage}
      </LabelContainer>
    </>
  );
};

export default MovingLabel;
