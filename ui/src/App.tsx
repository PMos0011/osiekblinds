import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import BlindsNavigation from './componnents/BlindsNavigation';
import styled from 'styled-components';
import fancy from './assets/bg.jpg';
import SideSlider from './componnents/SideSlider';
import { Blind, Day } from './tools/blinds';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: url(${fancy});
`;

const App = () => {
  const [blinds, setBlinds] = useState<Blind[]>([]);
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    axios.get('/blinds').then((response) => setBlinds(response.data));
    axios.get('/days').then((response) => setDays(response.data));
  }, []);

  return (
    <Container>
      <BlindsNavigation blinds={blinds} />
      <SideSlider blinds={blinds} days={days} />
    </Container>
  );
};

export default App;
