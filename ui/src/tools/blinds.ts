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

export interface ScheduledAction {
  id?: number;
  planName: string;
  up: Date;
  down: Date;
  active: boolean;
  blinds: Blind[];
  days: Day[];
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
