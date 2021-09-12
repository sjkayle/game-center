import { Pipes } from '../components/games';

const games: Game[] = [
  {
    id: 1,
    label: 'Pipes',
    path: '/pipes',
    component: Pipes,
  },
];

export interface Game {
  id: number;
  label: string;
  path: string;
  component: any;
}

export default games;
