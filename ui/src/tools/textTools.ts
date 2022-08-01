import { Blind, Day } from './blinds';

export const textLimit = (value: string, limit: number) => {
  if (value.length < limit) return value;
  else return value.substring(0, limit) + '...';
};

export const dateJoin = (up: Date, down: Date) => {
  const upLocal = new Date(up);
  const downLocal = new Date(down);
  return `${toTwoDigits(upLocal.getHours())}:${toTwoDigits(upLocal.getMinutes())}
  - ${toTwoDigits(downLocal.getHours())}:${toTwoDigits(downLocal.getMinutes())}`;
};

export const resolveSelectedBlinds = (blinds: Blind[]): string => {
  return blinds
    .sort((a, b) => a.id - b.id)
    .map((blind) => blind.blindName)
    .join(', ');
};

export const resolveSelectedDays = (days: Day[]): string => {
  return days
    .sort((a, b) => a.id - b.id)
    .map((day) => day.shortName)
    .join(', ');
};

const toTwoDigits = (num: number): string => {
  return String(num).padStart(2, '0');
};
