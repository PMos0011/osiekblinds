import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import { Slider } from '@mui/material';
import { useContent } from './ContentProvider';
import ServoState from './ServoState';

const HeaderWrapper = styled.div`
  font-family: ${fonts.main};
  font-size: 6vw;
  margin-top: 5%;
  margin-bottom: 3vh;
`;

const ItemsWrapper = styled.div<{ isOpen: boolean }>`
  margin-left: 5vw;
  padding: 30px;
  width: 60%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 70%;
  transition-duration: 0.3s;
  transition-delay: ${(props) => (props.isOpen ? 0.4 : 0)}s;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
`;

const TextWrapper = styled.div`
  font-family: ${fonts.main};
  font-size: 1.5vh;
`;

const TempWrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  margin-left: 20vw;
  transition-duration: 0.3s;
  transition-delay: ${(props) => (props.isOpen ? 0.4 : 0)}s;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
`;

interface Props {
  isOpen: boolean;
}

const AC = ({ isOpen }: Props) => {
  const { servos } = useContent();
  const { temp } = useContent();

  return (
    <>
      <HeaderWrapper>{'KLIMATYZACJA'}</HeaderWrapper>
      <ItemsWrapper isOpen={isOpen}>
        {servos.map((item) => (
          <ServoState key={item.id} servo={item} />
        ))}
      </ItemsWrapper>
      <TempWrapper isOpen={isOpen}>
        <TextWrapper>{`Temp: ${temp.temp}°`}</TextWrapper>
        <TextWrapper>{`Wilg: ${temp.hum}%`}</TextWrapper>
      </TempWrapper>
    </>
  );
};

export default AC;
