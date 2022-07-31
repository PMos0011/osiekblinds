import React from 'react';
import BlockIcon from '@mui/icons-material/Block';
import AdjustIcon from '@mui/icons-material/Adjust';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import { BlindSelection } from '../tools/blindsInitState';

const NameLabel = styled.div`
  font-family: ${fonts.main};
  font-size: 4vw;
  margin: 0.9vh;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
`;

interface Props {
  blinds: BlindSelection[];
  onBlindClick: (id: number) => void;
}

const BlindScheduleSelector = ({ blinds, onBlindClick }: Props) => {
  return (
    <>
      {blinds.map((blind) => (
        <NameWrapper key={blind.id} onClick={() => onBlindClick(blind.id)}>
          <NameLabel> {blind.name.toUpperCase()} </NameLabel>
          {blind.isAdded ? (
            <AdjustIcon style={{ color: 'green' }} />
          ) : (
            <BlockIcon style={{ color: 'red' }} />
          )}
        </NameWrapper>
      ))}
    </>
  );
};

export default BlindScheduleSelector;
