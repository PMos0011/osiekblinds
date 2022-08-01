import React from 'react';
import styled from 'styled-components';
import { Day, ScheduledAction } from '../tools/blinds';

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
  weekDays: Day[];
  item: ScheduledAction;
  onDayClick: (day: Day) => void;
}

const DayPicker = ({ weekDays, item, onDayClick }: Props) => {
  return (
    <Container>
      {weekDays.map((weekDay) => (
        <DayWrapper
          onClick={() => onDayClick(weekDay)}
          key={weekDay.shortName}
          isAdded={item.days.some((day) => day.shortName === weekDay.shortName)}>
          {weekDay.shortName}
        </DayWrapper>
      ))}
    </Container>
  );
};

export default DayPicker;
