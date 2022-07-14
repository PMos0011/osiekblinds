import React from 'react';
import './App.css';
import BlindsNavigation from './componnents/BlindsNavigation';
import styled from 'styled-components';
import fancy from './assets/bg.jpg';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: url(${fancy});
`;

const App = () => {
  return (
    <Container>
      <BlindsNavigation />
    </Container>
  );
};

export default App;
