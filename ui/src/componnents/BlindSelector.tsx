import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import MovingLabel from './MovingLabel';

const Row = styled.div<{ left?: boolean }>`
  margin: 1vh auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  height: 9%;
  align-items: center;
  padding: 4px;
  border: solid 1px gray;
  border-radius: 8px;
  box-shadow: 0 20px 20px -14px rgba(0, 0, 0, 0.46);
  transition: 0.2s;
  overflow: hidden;

  transform: perspective(130px)
    rotateY(${(props) => (props.left === undefined ? '0deg' : props.left ? '-1.5deg' : '1.5deg')});
`;

const ArrowContainer = styled.div`
  display: flex;
  padding: 4px;
  border: solid 1px dimgray;
  background-color: whitesmoke;
  border-radius: 5px;
  z-index: 2;
`;

const ArrowUp = styled(ArrowBackIosIcon)`
  transform: rotate(90deg);
`;

const ArrowDown = styled(ArrowBackIosIcon)`
  transform: rotate(-90deg);
`;

const DoubleArrowUp = styled(DoubleArrowIcon)`
  transform: rotate(-90deg);
`;

const DoubleArrowDown = styled(DoubleArrowIcon)`
  transform: rotate(90deg);
`;

export enum MoveDirection {
  WAITING,
  UP,
  DOWN
}

interface Props {
  label: string;
  doubleArrow?: boolean;
}

const BlindSelector = ({ label, doubleArrow }: Props) => {
  const [left, setLeft] = useState<boolean | undefined>(undefined);
  const [timeout, setButtonTimeout] = useState<any>();
  const [direction, setDirection] = useState<MoveDirection>(MoveDirection.WAITING);
  const [isError, setIsError] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (direction) direction === MoveDirection.UP ? onUp() : onDown();
  }, [direction]);

  const buttonAnimation = (isLeft: boolean) => {
    clearTimeout(timeout);
    setLeft(isLeft);
    setButtonTimeout(setTimeout(() => setLeft(undefined), 500));
  };

  const onUp = () => {
    buttonAnimation(true);
  };

  const onDown = () => {
    buttonAnimation(false);
  };

  const onAction = (selectedDirection: MoveDirection) => {
    if (direction === MoveDirection.WAITING && isError === undefined) {
      setDirection(selectedDirection);
      // todo delete on request
      setTimeout(() => {
        setDirection(MoveDirection.WAITING);
        setIsError(false);
      }, 300);
    }
  };

  return (
    <Row left={left}>
      <ArrowContainer onClick={() => onAction(MoveDirection.UP)}>
        {doubleArrow ? <DoubleArrowUp /> : <ArrowUp />}
      </ArrowContainer>
      <MovingLabel
        direction={direction}
        label={label.toUpperCase()}
        isError={isError}
        clearError={() => setIsError(undefined)}
      />
      <ArrowContainer onClick={() => onAction(MoveDirection.DOWN)}>
        {doubleArrow ? <DoubleArrowDown /> : <ArrowDown />}
      </ArrowContainer>
    </Row>
  );
};

export default BlindSelector;
