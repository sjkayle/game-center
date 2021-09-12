import { Pipes } from '../components/games';

const games: Game[] = [
  {
    id: 1,
    label: 'Pipes',
    levels: 6,
    path: '/pipes',
    component: Pipes,
  },
];

export interface Game {
  id: number;
  label: string;
  levels: number;
  path: string;
  component: any;
}

export default games;
