import React, { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import styled from 'styled-components';
import { fonts } from '../assets/fonts';
import { ServoDto } from '../tools/commonDtos';
import { useContent } from './ContentProvider';
import ScheduleSwitch from './ScheduleSwitch';

const TextWrapper = styled.div`
  font-family: ${fonts.main};
  font-size: 3vw;
`;

const SwitchWrapper = styled.div`
  margin-top: 5vh;
  display: flex;
`;

const names = ['Sypialnia', 'Pokój', 'Pokój Laury'];

interface Props {
  servo: ServoDto;
}

const ServoState = ({ servo }: Props) => {
  const [state, setState] = useState<number>(100);
  const [disabled, setDisabled] = useState(false);
  const [changeInterval, setChangeInterval] = useState<number | undefined>();
  const [responseInterval, setResponseInterval] = useState<number | undefined>();
  const [flor, setFlor] = useState(false);

  const { setServoState } = useContent();

  const performAction = (val: number) => {
    if (val !== servo.state) {
      setDisabled(true);
      setServoState({ id: servo.id, state: val });
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (flor) setState(100);
    else setState(0);
  }, [flor]);

  useEffect(() => {
    setState(servo.state);
    setDisabled(false);
    if (responseInterval) window.clearTimeout(responseInterval);
    setResponseInterval(undefined);

    if (servo.id === 4) setFlor(servo.state === 100);
  }, [servo.state]);

  useEffect(() => {
    if (changeInterval) window.clearTimeout(changeInterval);
    const interval = window.setTimeout(() => performAction(state), 700);
    setChangeInterval(interval);

    return () => {
      if (changeInterval) window.clearTimeout(changeInterval);
    };
  }, [state]);

  useEffect(() => {
    if (disabled) {
      if (responseInterval) window.clearTimeout(responseInterval);
      const interval = window.setTimeout(() => setState(servo.state), 10000);
      setResponseInterval(interval);
    } else if (responseInterval) window.clearTimeout(responseInterval);

    return () => {
      if (responseInterval) window.clearTimeout(responseInterval);
    };
  }, [disabled]);

  const label = names[servo.id];

  return (
    <>
      {label ? (
        <>
          <TextWrapper>{label}</TextWrapper>
          <Slider
            onChange={(e, val) => setState(val as number)}
            value={state}
            max={100}
            min={0}
            step={25}
            disabled={disabled}
            valueLabelDisplay="auto"
          />
        </>
      ) : (
        <SwitchWrapper>
          <TextWrapper>Parter</TextWrapper>
          <ScheduleSwitch
            disabled={disabled}
            isEnabled={flor}
            toggleEnabled={() => setFlor(!flor)}
          />
          <TextWrapper>Piętro</TextWrapper>
        </SwitchWrapper>
      )}
    </>
  );
};

export default ServoState;
