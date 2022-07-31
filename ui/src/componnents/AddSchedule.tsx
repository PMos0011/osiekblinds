import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BlindScheduleSelector from './BlindScheduleSelector';
import TimePickers from './TimePickers';
import DayPicker from './DayPicker';
import NameInput from './NameInput';
import { initScheduleDto, ScheduleDto } from '../tools/scheduledItem';

const AddContentWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: ${(props) => (props.isOpen ? 90 : 0)}%;
  left: 5px;
  bottom: 5px;
  background-color: whitesmoke;
  transition-duration: 0.5s;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: auto;
  margin-bottom: 8vh;
`;

interface Props {
  onSave: (item: ScheduleDto) => void;
  item?: ScheduleDto;
}

const AddSchedule = ({ onSave, item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDto>(initScheduleDto());

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      setSchedule({ ...item });
    } else setIsOpen(false);
  }, [item]);

  const onValueChange = (newValue: string) => {
    setSchedule({ ...schedule, value: newValue });
  };

  const onBlindClick = (id: number) => {
    const newBlindSelection = schedule.blindSelection.map((blind) => {
      if (blind.id === id)
        return {
          ...blind,
          isAdded: !blind.isAdded
        };
      else return { ...blind };
    });

    setSchedule({ ...schedule, blindSelection: newBlindSelection });
  };

  const onDayClick = (name: string) => {
    const newDaySelection = schedule.daySelection.map((day) => {
      if (day.name === name)
        return {
          ...day,
          isAdded: !day.isAdded
        };
      else return { ...day };
    });

    setSchedule({ ...schedule, daySelection: newDaySelection });
  };

  const onUpSet = (up: Date) => {
    setSchedule({ ...schedule, up: up });
  };

  const onDownSet = (down: Date) => {
    setSchedule({ ...schedule, down: down });
  };

  return (
    <AddContentWrapper isOpen={isOpen}>
      <NameInput value={schedule.value} setValue={onValueChange} />
      <BlindScheduleSelector onBlindClick={onBlindClick} blinds={schedule.blindSelection} />
      <DayPicker onDayClick={onDayClick} weekDays={schedule.daySelection} />
      <TimePickers up={schedule.up} down={schedule.down} setUp={onUpSet} setDown={onDownSet} />
      <IconWrapper>
        <AddTaskIcon
          onClick={() => {
            setIsOpen(false);
            onSave(schedule);
          }}
          style={{ fontSize: '12vw' }}
        />
        <HighlightOffIcon onClick={() => setIsOpen(false)} style={{ fontSize: '12vw' }} />
      </IconWrapper>
    </AddContentWrapper>
  );
};

export default AddSchedule;
