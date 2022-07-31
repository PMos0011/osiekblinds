interface Blind {
  name: string;
  id: number;
  doubleArrow?: boolean;
}

const blinds: Blind[] = [
  { name: 'Całość', id: 0, doubleArrow: true },
  { name: 'Salon Lewa', id: 1 },
  { name: 'Salon Prawa', id: 2 },
  { name: 'Kuchnia', id: 3 },
  { name: 'Kotłownia', id: 4 },
  { name: 'Sypialnia', id: 5 },
  { name: 'Garderoba', id: 6 },
  { name: 'Łazienka', id: 7 },
  { name: 'Gabinet', id: 8 },
  { name: 'Pokój', id: 9 }
];

export default blinds;
