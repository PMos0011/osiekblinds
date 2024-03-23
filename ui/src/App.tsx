import React, { useState } from 'react';
import './App.css';
import BlindsNavigation from './componnents/BlindsNavigation';
import styled from 'styled-components';
import fancy from './assets/bg.jpg';
import SideSlider from './componnents/SideSlider';
import { ContentProvider } from './componnents/ContentProvider';
import Schedule from './componnents/Schedule';
import AC from './componnents/AC';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: url(${fancy});
`;

const App = () => {
  const [isOpenSchedule, setIsOpenSchedule] = useState(false);
  const [isOpenAC, setIsOpenAC] = useState(false);

  const toggleSchedule = () => {
    if (isOpenAC && !isOpenSchedule) setIsOpenAC(false);

    setIsOpenSchedule(!isOpenSchedule);
  };

  const toggleAC = () => {
    if (!isOpenAC && isOpenSchedule) setIsOpenSchedule(false);

    setIsOpenAC(!isOpenAC);
  };

  return (
    <ContentProvider>
      <Container>
        <BlindsNavigation />
        <SideSlider
          isOpen={isOpenSchedule}
          secondOpen={isOpenAC}
          toggleSidebar={toggleSchedule}
          type={'SCHEDULE'}>
          <Schedule isOpen={isOpenSchedule} />
        </SideSlider>
        <SideSlider
          isOpen={isOpenAC}
          secondOpen={isOpenSchedule}
          toggleSidebar={toggleAC}
          type={'AC'}>
          {<AC isOpen={isOpenAC} />}
        </SideSlider>
      </Container>
    </ContentProvider>
  );
};

export default App;
