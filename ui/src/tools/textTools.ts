import { BlindSelection } from './blindsInitState';
import { WeekDaySelection } from './weekDays';

export const textLimit = (value: string, limit: number) => {
  if (value.length < limit) return value;
  else return value.substring(0, limit) + '...';
};

export const dateJoin = (up: Date, down: Date) => {
  return `${toTwoDigits(up.getHours())}:${toTwoDigits(up.getMinutes())}
  - ${toTwoDigits(down.getHours())}:${toTwoDigits(down.getMinutes())}`;
};

export const resolveSelectedBlinds = (blinds: BlindSelection[]): string => {
  return blinds
    .filter((blind) => blind.isAdded)
    .map((blind) => blind.name)
    .join(', ');
};

export const resolveSelectedDays = (days: WeekDaySelection[]): string => {
  return days
    .filter((day) => day.isAdded)
    .map((day) => day.name)
    .join(', ');
};

const toTwoDigits = (num: number): string => {
  return String(num).padStart(2, '0');
};
