import React from 'react';
import styled from 'styled-components';
import { useContent } from './ContentProvider';
import BlindSelector from './BlindSelector';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10vh auto;
  width: 90vw;
  height: 90vh;
`;

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BlindsNavigation = () => {
  const { blinds } = useContent();
  return (
    <Container>
      {blinds.map((blind) => {
        return (
          <SelectorContainer key={blind.id}>
            <BlindSelector label={blind.blindName} id={blind.id} doubleArrow={blind.global} />
          </SelectorContainer>
        );
      })}
    </Container>
  );
};

export default BlindsNavigation;
