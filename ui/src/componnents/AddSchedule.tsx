import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BlindScheduleSelector from './BlindScheduleSelector';
import TimePickers from './TimePickers';
import DayPicker from './DayPicker';
import NameInput from './NameInput';
import { Blind, Day, initSchedule, ScheduledAction } from '../tools/blinds';

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

const AcceptIconWrapper = styled.div<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? 'black' : 'lightgray')};
  transition-duration: 0.5s;
`;

interface Props {
  blinds: Blind[];
  days: Day[];
  onSave: (item: ScheduledAction) => void;
  onCancel: () => void;
  item?: ScheduledAction;
}

const AddSchedule = ({ blinds, days, onSave, onCancel, item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledAction>(initSchedule());

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      setSchedule({ ...item });
    } else setIsOpen(false);
  }, [item]);

  const canSave = () => {
    return !!(
      schedule.days.length &&
      schedule.blinds.length &&
      schedule.planName.length &&
      new Date(schedule.up).toISOString() !== new Date(schedule.down).toISOString()
    );
  };

  const onValueChange = (newValue: string) => {
    setSchedule({
      ...schedule,
      planName: newValue.length > 254 ? newValue.substring(0, 254) : newValue
    });
  };

  const onBlindClick = (selectedBlind: Blind) => {
    const newBlinds = schedule.blinds.filter((blind) => blind.id !== selectedBlind.id);
    if (newBlinds.length === schedule.blinds.length) newBlinds.push(selectedBlind);
    setSchedule({ ...schedule, blinds: newBlinds });
  };

  const onDayClick = (selectedDay: Day) => {
    const newDays = schedule.days.filter((day) => day.shortName !== selectedDay.shortName);
    if (newDays.length === schedule.days.length) newDays.push(selectedDay);

    setSchedule({ ...schedule, days: newDays });
  };

  const onUpSet = (up: Date) => {
    setSchedule({ ...schedule, up: up });
  };

  const onDownSet = (down: Date) => {
    setSchedule({ ...schedule, down: down });
  };

  const onSaveClick = () => {
    if (canSave()) {
      setIsOpen(false);
      onSave(schedule);
    }
  };

  return (
    <AddContentWrapper isOpen={isOpen}>
      <NameInput value={schedule.planName} setValue={onValueChange} />

      <BlindScheduleSelector onBlindClick={onBlindClick} blinds={blinds} item={schedule} />
      <DayPicker onDayClick={onDayClick} weekDays={days} item={schedule} />

      <TimePickers up={schedule.up} down={schedule.down} setUp={onUpSet} setDown={onDownSet} />
      <IconWrapper>
        <AcceptIconWrapper isActive={canSave()}>
          <AddTaskIcon onClick={onSaveClick} style={{ fontSize: '12vw' }} />
        </AcceptIconWrapper>
        <HighlightOffIcon onClick={onCancel} style={{ fontSize: '12vw' }} />
      </IconWrapper>
    </AddContentWrapper>
  );
};

export default AddSchedule;
