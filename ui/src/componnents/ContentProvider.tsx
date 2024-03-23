import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { BindActionDto, Blind, Day, InitData, ScheduledAction } from '../tools/blinds';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { ServoDto, TempDto } from '../tools/commonDtos';

interface ContentProviderType {
  blinds: Blind[];
  days: Day[];
  schedules: ScheduledAction[];
  servos: ServoDto[];
  temp: TempDto;
  toggleSchedule: (id: number) => void;
  deleteSchedule: (id: number) => void;
  saveSchedule: (action: ScheduledAction) => void;
  enableBlind: (action: BindActionDto) => void;
  setServoState: (servo: ServoDto) => void;
}

const ContentProviderContext = React.createContext<ContentProviderType>(null!);

interface Props {
  children: ReactNode;
}

const ContentProvider = ({ children }: Props) => {
  const [stompClient, setStompClient] = useState<Client>();
  const [blinds, setBlinds] = useState<Blind[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [schedules, setSchedules] = useState<ScheduledAction[]>([]);
  const [temp, setTemp] = useState<TempDto>({ temp: -1, hum: -1 });
  const [servos, setServos] = useState<ServoDto[]>([]);

  useEffect(() => {
    const socketClient = new SockJS('http://192.168.1.50/ws');
    setStompClient(over(socketClient));
    return () => {
      socketClient.close();
    };
  }, []);

  useEffect(() => {
    if (stompClient)
      stompClient.connect(
        {},
        (frame) => {
          setStompClient(stompClient);
          stompClient.subscribe('/init/res', (payload) => {
            const initData: InitData = JSON.parse(payload.body);
            setBlinds(initData.blinds);
            setDays(initData.days);
            setSchedules(initData.actions);
          });

          stompClient.subscribe('/schedules', (payload) => setSchedules(JSON.parse(payload.body)));
          stompClient.subscribe('/servo/state', (payload) => setServos(JSON.parse(payload.body)));
          stompClient.subscribe('/temp/state', (payload) => setTemp(JSON.parse(payload.body)));

          stompClient.send('/app/init');
          stompClient.send('/app/servo');
          stompClient.send('/app/temp');
        },
        () => console.log('websocket error')
      );
  }, [stompClient]);

  const toggleSchedule = (id: number) => {
    stompClient!.send('/app/toggle', {}, id.toString());
  };

  const deleteSchedule = (id: number) => {
    stompClient!.send('/app/delete', {}, id.toString());
  };
  const saveSchedule = (action: ScheduledAction) => {
    stompClient!.send('/app/add', {}, JSON.stringify(action));
  };
  const enableBlind = (action: BindActionDto) => {
    stompClient!.send('/app/blinds', {}, JSON.stringify(action));
  };

  const setServoState = (servo: ServoDto) => {
    stompClient!.send('/app/servo/set', {}, JSON.stringify(servo));
  };

  return (
    <ContentProviderContext.Provider
      value={{
        blinds,
        days,
        schedules,
        servos,
        temp,
        toggleSchedule,
        deleteSchedule,
        saveSchedule,
        enableBlind,
        setServoState
      }}>
      {children}
    </ContentProviderContext.Provider>
  );
};

const useContent = () => useContext(ContentProviderContext);

export { ContentProvider, useContent };
