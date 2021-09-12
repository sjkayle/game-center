import { Pipes } from '../components/games';

const games: IGame[] = [
  {
    id: 1,
    label: 'Pipes',
    levels: 6,
    path: '/pipes',
    component: Pipes,
  },
];

export interface IGame {
  id: number;
  label: string;
  levels: number;
  path: string;
  component: any;
}

export default games;
