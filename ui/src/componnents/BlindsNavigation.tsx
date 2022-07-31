import React from 'react';
import styled from 'styled-components';
import BlindSelector from './BlindSelector';
import blinds from '../tools/blinds';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5vh auto;
  width: 90vw;
  height: 90vh;
`;

const BlindsNavigation = () => {
  return (
    <Container>
      {blinds.map((blind) => (
        <BlindSelector
          key={blind.id}
          label={blind.name}
          id={blind.id}
          doubleArrow={blind.doubleArrow}
        />
      ))}
    </Container>
  );
};

export default BlindsNavigation;
