import { MoveDirection } from '../componnents/BlindSelector';

export interface Blind {
  blindName: string;
  id: number;
  global: boolean;
}

export interface Day {
  id: number;
  shortName: string;
  dayName: string;
}

export interface BlindState {
  id: number;
  direction: MoveDirection;
  position: number;
  inMove: boolean;
}

export interface InitData {
  days: Day[];
  blinds: Blind[];
  actions: ScheduledAction[];
  blindState: BlindState[];
}

export interface ScheduledAction {
  id?: number;
  planName: string;
  up: Date;
  down: Date;
  active: boolean;
  blinds: Blind[];
  days: Day[];
}

export interface BindActionDto {
  direction: string;
  id: number;
}

export const initSchedule = (): ScheduledAction => {
  return {
    planName: '',
    up: new Date('2022-01-01T09:00:00'),
    down: new Date('2022-01-01T21:00:00'),
    blinds: [],
    days: [],
    active: true
  };
};
