import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { BindActionDto, Blind, BlindState, Day, InitData, ScheduledAction } from '../tools/blinds';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';

interface ContentProviderType {
  blinds: Blind[];
  days: Day[];
  schedules: ScheduledAction[];
  blindsState: BlindState[];
  toggleSchedule: (id: number) => void;
  deleteSchedule: (id: number) => void;
  saveSchedule: (action: ScheduledAction) => void;
  enableBlind: (action: BindActionDto) => void;
}

const ContentProviderContext = React.createContext<ContentProviderType>(null!);

interface Props {
  children: ReactNode;
}

const ContentProvider = ({ children }: Props) => {
  const [stompClient, setStompClient] = useState<Client>(
    over(new SockJS('http://192.168.0.116/ws'))
  );
  const [blinds, setBlinds] = useState<Blind[]>([]);
  const [blindsState, setBlindsState] = useState<BlindState[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [schedules, setSchedules] = useState<ScheduledAction[]>([]);

  useEffect(() => {
    if (stompClient)
      stompClient.connect(
        {},
        (frame) => {
          setStompClient(stompClient);
          const subs = stompClient.subscribe('/init/res', (payload) => {
            subs.unsubscribe();
            const initData: InitData = JSON.parse(payload.body);
            setBlinds(initData.blinds);
            setDays(initData.days);
            setSchedules(initData.actions);
            setBlindsState(initData.blindState);
          });

          stompClient.send('/app/init');

          stompClient.subscribe('/schedules', (payload) => setSchedules(JSON.parse(payload.body)));
          stompClient.subscribe('/blinds/state', (payload) =>
            setBlindsState(JSON.parse(payload.body))
          );
        },
        () => console.log('websocket error')
      );
  }, [stompClient]);

  const toggleSchedule = (id: number) => {
    stompClient.send('/app/toggle', {}, id.toString());
  };

  const deleteSchedule = (id: number) => {
    stompClient.send('/app/delete', {}, id.toString());
  };
  const saveSchedule = (action: ScheduledAction) => {
    stompClient.send('/app/add', {}, JSON.stringify(action));
  };
  const enableBlind = (action: BindActionDto) => {
    stompClient.send('/app/blinds', {}, JSON.stringify(action));
  };

  return (
    <ContentProviderContext.Provider
      value={{
        blinds,
        days,
        schedules,
        blindsState,
        toggleSchedule,
        deleteSchedule,
        saveSchedule,
        enableBlind
      }}>
      {children}
    </ContentProviderContext.Provider>
  );
};

const useContent = () => useContext(ContentProviderContext);

export { ContentProvider, useContent };
