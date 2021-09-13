import { Pipes } from '../components/games';

const games: IGame[] = [
  {
    id: 1,
    label: 'Pipes',
    levels: 6,
    path: '/pipes',
    component: Pipes,
    description:
      'Rotate the tiles on the map to make all pipes connected in a single group, with no loops and no dangling pipes.',
  },
];

export interface IGame {
  id: number;
  description?: string;
  label: string;
  levels: number;
  path: string;
  component: any;
}

export default games;
