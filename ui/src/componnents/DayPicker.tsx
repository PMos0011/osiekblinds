import React from 'react';
import styled from 'styled-components';
import { WeekDaySelection } from '../tools/weekDays';

const Container = styled.div`
  margin-top: 2vh;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const DayWrapper = styled.div<{ isAdded: boolean }>`
  display: flex;
  border: solid 1px gray;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  width: 9vw;
  height: 9vw;
  background-color: ${(props) => (props.isAdded ? '#16a811' : 'transparent')};
  transition-duration: 0.3s;
`;

interface Props {
  weekDays: WeekDaySelection[];
  onDayClick: (name: string) => void;
}

const DayPicker = ({ weekDays, onDayClick }: Props) => {
  return (
    <Container>
      {weekDays.map((day) => (
        <DayWrapper onClick={() => onDayClick(day.name)} key={day.name} isAdded={day.isAdded}>
          {day.name}
        </DayWrapper>
      ))}
    </Container>
  );
};

export default DayPicker;
