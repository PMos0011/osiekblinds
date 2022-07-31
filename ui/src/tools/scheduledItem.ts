import { BlindSelection, blindSelectionInitState } from './blindsInitState';
import dayInitState, { WeekDaySelection } from './weekDays';

export interface ScheduleDto {
  id: number;
  value: string;
  up: Date;
  down: Date;
  blindSelection: BlindSelection[];
  daySelection: WeekDaySelection[];
  isActive: boolean;
}

export const initScheduleDto = (): ScheduleDto => {
  return {
    //todo remove id
    id: Math.random(),
    value: '',
    up: new Date('2022-01-01T09:00:00'),
    down: new Date('2022-01-01T21:00:00'),
    blindSelection: blindSelectionInitState(),
    daySelection: dayInitState(),
    isActive: true
  };
};
