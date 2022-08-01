import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { fonts } from '../assets/fonts';
import AddSchedule from './AddSchedule';
import ScheduledItem from './ScheduledItem';
import { Blind, Day, initSchedule, ScheduledAction } from '../tools/blinds';

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => (props.isOpen ? 90 : 1)}%;
  height: 100%;
  background-color: whitesmoke;
  z-index: 10;
  border-radius: 0 6px 6px 0;
  box-shadow: 8px 8px 24px 0 rgba(0, 0, 0, 0.6);
  transition-duration: 0.5s;
  transition-delay: ${(props) => (props.isOpen ? 0 : 0.3)}s;
`;

const ManageIconWrapper = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: -20px;
  display: flex;
  z-index: 11;
  width: fit-content;
  height: fit-content;
  justify-content: right;
  border-radius: 0 8px 8px 0;
  background-color: whitesmoke;
  box-shadow: 8px 8px 24px 0 rgba(0, 0, 0, 0.8);

  &:before {
    border-radius: 0 6px 6px 0;
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;

    width: calc(100% + 1px);
    height: 100%;
    background-color: whitesmoke;
  }
`;

const ContentWrapper = styled.div`
  z-index: 15;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
  blinds: Blind[];
  days: Day[];
}

const SideSlider = ({ blinds, days }: Props) => {
  const [tempItem, setTempItem] = useState<ScheduledAction | undefined>(undefined);
  const [schedules, setSchedules] = useState<ScheduledAction[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get('/schedules').then((response) => setSchedules(response.data));
  }, []);

  const toggleSidebar = () => {
    if (isOpen) setTempItem(undefined);
    setIsOpen(!isOpen);
  };

  const toggleActivate = (id: number) => {
    axios.put('/toggle/' + id).then((response) => setSchedules(response.data));
  };

  const deleteAction = (id: number) => {
    axios.delete('/delete/' + id).then((response) => setSchedules(response.data));
  };

  const onEdit = (item: ScheduledAction) => {
    setTempItem(item);
  };

  const onSave = (item: ScheduledAction) => {
    axios.post('/add', item).then((response) => setSchedules(response.data));
    setTempItem(undefined);
  };

  return (
    <Container isOpen={isOpen}>
      <ContentWrapper>
        <HeaderWrapper>{'HARMONOGRAM'}</HeaderWrapper>
        <ItemsWrapper isOpen={isOpen}>
          {schedules.map((item) => (
            <ScheduledItem
              key={item.id}
              item={item}
              toggleActivation={toggleActivate}
              onEdit={onEdit}
              onDelete={deleteAction}
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
      </ContentWrapper>
      <ManageIconWrapper>
        <ManageHistoryIcon
          onClick={toggleSidebar}
          style={{ margin: '8px', zIndex: 25, cursor: 'pointer' }}
        />
      </ManageIconWrapper>
    </Container>
  );
};

export default SideSlider;
