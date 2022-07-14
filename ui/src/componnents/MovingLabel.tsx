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
  transition: ${(props) => props.time}s;
  color: #2c2a25;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
  width: 65%;
  text-align: center;
  transform: translateY(${(props) => props.transition}vh);
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
}

const MovingLabel = ({ label, direction }: Props) => {
  const [transitionTime, setTransitionTime] = useState<number>(ANIMATION_TIME);
  const [labelPositions, setLabelPositions] = useState<number>(0);
  const [movingState, setMovingState] = useState<MovingState>(MovingState.LABEL_ON);
  const [infoLabelMessage, setInfoLabelMessage] = useState<string>('OK');
  const [infoTransitionTime, setInfoTransitionTime] = useState<number>(0);
  const [infoLabelPositions, setInfoLabelPositions] = useState<number>(OFFSET);

  useEffect(() => {
    if (direction) beginAnimation();
    else if (movingState === MovingState.BEFORE_RES) {
      setInfoLabelPositions(0);
      setTransitionTime(ANIMATION_TIME);
      setTimeout(() => setMovingState(MovingState.RESULT), 500);
    }
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
      setMovingState(MovingState.BEFORE_RES);
    }
  }, [transitionTime]);

  useEffect(() => {
    switch (movingState) {
      case MovingState.LABEL_ON:
        if (infoTransitionTime) setTimeout(() => setInfoTransitionTime(0), DELAY);
        break;
      case MovingState.LABEL_OFF:
        setTransitionTime(0);
        break;
      case MovingState.BEFORE_RES:
        setInfoTransitionTime(ANIMATION_TIME);
        break;
      case MovingState.RESULT:
        setInfoLabelPositions(labelPositions * -1);
        break;
    }
  }, [movingState]);

  const beginAnimation = () => {
    direction === MoveDirection.UP ? setLabelPositions(-OFFSET) : setLabelPositions(OFFSET);
    setTimeout(() => setMovingState(MovingState.LABEL_OFF), DELAY);
  };

  return (
    <>
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
