import React from 'react';
import './App.css';
import BlindsNavigation from './componnents/BlindsNavigation';
import styled from 'styled-components';
import fancy from './assets/bg.jpg';
import SideSlider from './componnents/SideSlider';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: url(${fancy});
`;

const App = () => {
  return (
    <Container>
      <BlindsNavigation />
      <SideSlider />
    </Container>
  );
};

export default App;
