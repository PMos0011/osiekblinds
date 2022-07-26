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
      <BlindSelector label={'całość'} id={0} doubleArrow={true} />
      <BlindSelector label={'salon lewa'} id={1} />
      <BlindSelector label={'salon prawa'} id={2} />
      <BlindSelector label={'kuchnia'} id={3} />
      <BlindSelector label={'kotłownia'} id={4} />
      <BlindSelector label={'sypialnia'} id={5} />
      <BlindSelector label={'garderoba'} id={6} />
      <BlindSelector label={'łazienka'} id={7} />
      <BlindSelector label={'gabinet'} id={8} />
      <BlindSelector label={'pokój'} id={9} />
    </Container>
  );
};

export default BlindsNavigation;
