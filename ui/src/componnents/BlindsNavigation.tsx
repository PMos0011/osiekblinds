import React from 'react';
import styled from 'styled-components';
import BlindSelector from './BlindSelector';

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
      <BlindSelector label={'całość'} doubleArrow={true} />
      <BlindSelector label={'salon lewa'} />
      <BlindSelector label={'salon prawa'} />
      <BlindSelector label={'kuchnia'} />
      <BlindSelector label={'kotłownia'} />
      <BlindSelector label={'sypialnia'} />
      <BlindSelector label={'garderoba'} />
      <BlindSelector label={'łazienka'} />
      <BlindSelector label={'gabinet'} />
      <BlindSelector label={'pokój'} />
    </Container>
  );
};

export default BlindsNavigation;
