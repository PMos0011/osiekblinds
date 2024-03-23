import React, { useEffect, useState } from 'react';
import ScheduledItem from './ScheduledItem';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { initSchedule, ScheduledAction } from '../tools/blinds';
import AddSchedule from './AddSchedule';
import { useContent } from './ContentProvider';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';

const HeaderWrapper = styled.div`
  font-family: ${fonts.main};
  font-size: 6vw;
  margin-top: 5%;
  margin-bottom: 3vh;
`;

const AddIconWrapper = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: 10%;
`;

const ItemsWrapper = styled.div<{ isOpen: boolean }>`
  margin-left: 5vw;
  width: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 70%;
  transition-duration: 0.3s;
  transition-delay: ${(props) => (props.isOpen ? 0.4 : 0)}s;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
`;

interface Props {
  isOpen: boolean;
}

const Schedule = ({ isOpen }: Props) => {
  const [tempItem, setTempItem] = useState<ScheduledAction | undefined>(undefined);
  const { blinds, days, schedules, toggleSchedule, deleteSchedule, saveSchedule } = useContent();

  useEffect(() => {
    if (isOpen) setTempItem(undefined);
  }, [isOpen]);

  const onEdit = (item: ScheduledAction) => {
    setTempItem(item);
  };

  const onSave = (item: ScheduledAction) => {
    saveSchedule(item);
    setTempItem(undefined);
  };

  return (
    <>
      <HeaderWrapper>{'HARMONOGRAM'}</HeaderWrapper>
      <ItemsWrapper isOpen={isOpen}>
        {schedules.map((item) => (
          <ScheduledItem
            key={item.id}
            item={item}
            toggleActivation={toggleSchedule}
            onEdit={onEdit}
            onDelete={deleteSchedule}
          />
        ))}
      </ItemsWrapper>
      <AddIconWrapper>
        <MoreTimeIcon onClick={() => setTempItem(initSchedule())} style={{ fontSize: '15vw' }} />
      </AddIconWrapper>
      <AddSchedule
        blinds={blinds}
        days={days}
        item={tempItem}
        onSave={onSave}
        onCancel={() => setTempItem(undefined)}
      />
    </>
  );
};

export default Schedule;
