import React from 'react';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';
import styled from 'styled-components';

const Pickers = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2vh;
`;

const TimePickersWrapper = styled.div`
  width: 60%;
  margin: 10px;
`;

const StyledPicker = styled(MobileTimePicker)`
  margin: 10px;
`;

interface Props {
  up: Date;
  down: Date;
  setUp: (date: Date) => void;
  setDown: (date: Date) => void;
}

const TimePickers = ({ up, down, setUp, setDown }: Props) => {
  return (
    <Pickers>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <TimePickersWrapper>
          <StyledPicker
            label={'Podnieś'}
            ampm={false}
            value={up}
            onChange={(newValue) => setUp(newValue as Date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </TimePickersWrapper>
        <TimePickersWrapper>
          <StyledPicker
            label={'Opuść'}
            ampm={false}
            value={down}
            onChange={(newValue) => setDown(newValue as Date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </TimePickersWrapper>
      </LocalizationProvider>
    </Pickers>
  );
};

export default TimePickers;
