import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import MovingLabel from './MovingLabel';
import ProgressBar from './ProgressBar';
import { useContent } from './ContentProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  justify-items: center;
`;

const Row = styled.div<{ left?: boolean }>`
  margin: 1vh auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 60%;
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
  cursor: pointer;
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
  id: number;
  doubleArrow?: boolean;
  progress: number;
}

const BlindSelector = ({ label, id, doubleArrow, progress }: Props) => {
  const [left, setLeft] = useState<boolean | undefined>(undefined);
  const [timeout, setButtonTimeout] = useState<any>();
  const [direction, setDirection] = useState<MoveDirection>(MoveDirection.WAITING);
  const [isError, setIsError] = useState<boolean | undefined>(undefined);
  const { enableBlind } = useContent();

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
    sendRequest('UP');
  };

  const onDown = () => {
    sendRequest('DOWN');
    buttonAnimation(false);
  };

  const sendRequest = (direction: string) => {
    enableBlind({ direction: direction, id: id });
    setIsError(false);
    setDirection(MoveDirection.WAITING);
  };

  const onAction = (selectedDirection: MoveDirection) => {
    if (direction === MoveDirection.WAITING && isError === undefined) {
      setDirection(selectedDirection);
    }
  };

  return (
    <Container>
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
      <ProgressBar progress={progress} />
    </Container>
  );
};

export default BlindSelector;
