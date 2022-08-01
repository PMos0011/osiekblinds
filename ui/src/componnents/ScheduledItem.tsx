import React from 'react';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import {
  dateJoin,
  resolveSelectedBlinds,
  resolveSelectedDays,
  textLimit
} from '../tools/textTools';
import ScheduleSwitch from './ScheduleSwitch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ScheduledAction } from '../tools/blinds';

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Container = styled(ColumnWrapper)`
  margin-top: 2vh;
  width: 90%;
`;

const NameWrapper = styled(RowWrapper)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-family: ${fonts.main};
  font-size: 4.5vw;
`;

const TextWrapper = styled.div`
  font-family: ${fonts.main};
  font-size: 3vw;
`;

const IconsWrapper = styled(RowWrapper)`
  justify-content: space-around;
  width: 40%;
`;

const SecWrapper = styled.div`
  margin-top: 2vh;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const StyledHR = styled.hr`
  width: 100%;
`;

interface Props {
  item: ScheduledAction;
  toggleActivation: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (item: ScheduledAction) => void;
}

const ScheduledItem = ({ item, toggleActivation, onDelete, onEdit }: Props) => {
  return (
    <Container>
      <NameWrapper>
        <ColumnWrapper>
          {textLimit(item.planName, 20)}
          <TextWrapper>{textLimit(resolveSelectedBlinds(item.blinds), 40)}</TextWrapper>
        </ColumnWrapper>
        <ScheduleSwitch isEnabled={item.active} toggleEnabled={() => toggleActivation(item.id!)} />
      </NameWrapper>
      <SecWrapper>
        <ColumnWrapper>
          <TextWrapper>{resolveSelectedDays(item.days)}</TextWrapper>
          <TextWrapper>{dateJoin(item.up, item.down)}</TextWrapper>
        </ColumnWrapper>
        <IconsWrapper>
          <EditIcon onClick={() => onEdit(item)} />
          <DeleteForeverIcon onClick={() => onDelete(item.id!)} />
        </IconsWrapper>
      </SecWrapper>
      <StyledHR />
    </Container>
  );
};

export default ScheduledItem;
