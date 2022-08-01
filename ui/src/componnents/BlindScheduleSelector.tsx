import React from 'react';
import BlockIcon from '@mui/icons-material/Block';
import AdjustIcon from '@mui/icons-material/Adjust';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import { Blind, ScheduledAction } from '../tools/blinds';

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
  blinds: Blind[];
  item: ScheduledAction;
  onBlindClick: (blind: Blind) => void;
}

const BlindScheduleSelector = ({ blinds, item, onBlindClick }: Props) => {
  return (
    <>
      {blinds
        .filter((blind) => !blind.global)
        .map((blind) => (
          <NameWrapper key={blind.id} onClick={() => onBlindClick(blind)}>
            <NameLabel> {blind.blindName.toUpperCase()} </NameLabel>
            {item.blinds.filter((itemBlind) => itemBlind.id === blind.id).length ? (
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
