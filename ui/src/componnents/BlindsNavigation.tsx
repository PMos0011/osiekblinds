import React from 'react';
import styled from 'styled-components';
import { useContent } from './ContentProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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

  const DisplayBlinds = () => {
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

  const Spinner = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  };

  return blinds.length === 0 ? Spinner() : DisplayBlinds();
};

export default BlindsNavigation;
