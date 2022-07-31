import blinds from './blinds';

export interface BlindSelection {
  name: string;
  id: number;
  isAdded: boolean;
}

export const blindSelectionInitState = (): BlindSelection[] => {
  return blinds
    .filter((blind) => blind.id !== 0)
    .map((blind) => ({
      name: blind.name,
      id: blind.id,
      isAdded: false
    }));
};
