import React from 'react';
import styled from 'styled-components';
import BlindSelector from './BlindSelector';
import { Blind } from '../tools/blinds';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5vh auto;
  width: 90vw;
  height: 90vh;
`;

interface Props {
  blinds: Blind[];
}

const BlindsNavigation = ({ blinds }: Props) => {
  return (
    <Container>
      {blinds.map((blind) => (
        <BlindSelector
          key={blind.id}
          label={blind.blindName}
          id={blind.id}
          doubleArrow={blind.global}
        />
      ))}
    </Container>
  );
};

export default BlindsNavigation;
