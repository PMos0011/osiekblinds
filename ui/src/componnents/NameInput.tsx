import React, { useRef } from 'react';
import { TextField } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 1vh;
  margin-bottom: 1vh;
`;

interface Props {
  value: string;
  setValue: (value: string) => void;
}

const NameInput = ({ value, setValue }: Props) => {
  const nameInput = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') nameInput.current?.blur();
  };

  return (
    <Container>
      <TextField
        id="schedule-name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Nazwa"
        fullWidth={true}
        variant="outlined"
        onKeyDownCapture={handleKeyDown}
        inputRef={nameInput}
      />
    </Container>
  );
};

export default NameInput;
