import React from 'react';
import styled from 'styled-components';
import { useContent } from './ContentProvider';
import BlindSelector from './BlindSelector';
import Spinner from './Spinner';

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
  const { blinds, blindsState } = useContent();
  return (
    <Container>
      {blinds.map((blind) => {
        const state = blindsState.filter((state) => state.id === blind.id).at(0)!;
        return (
          <SelectorContainer key={blind.id}>
            <Spinner moving={false} />
            <BlindSelector
              label={blind.blindName}
              id={blind.id}
              doubleArrow={blind.global}
              progress={state.position}
            />
          </SelectorContainer>
        );
      })}
    </Container>
  );
};

export default BlindsNavigation;
