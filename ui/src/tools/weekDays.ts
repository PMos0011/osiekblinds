const days = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Ni'];

export interface WeekDaySelection {
  name: string;
  isAdded: boolean;
}

export default (): WeekDaySelection[] => {
  return days.map((day) => ({
    name: day,
    isAdded: false
  }));
};
