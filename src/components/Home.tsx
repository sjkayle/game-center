import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from './Button';
import { setGame } from '../redux/slices/gameSlice';
import { IGame } from '../config/games';

const Home = (props: HomeProps) => {
  const dispatch = useDispatch();
  return (
    <div className='wrapper'>
      <h1 className='txt-big'>Hello. Select a game.</h1>
      <div>
        {props.games.map((cur, idx) => {
          const game = {
            label: cur.label,
            levels: cur.levels,
            description: cur.description,
          };
          return (
            <Link key={idx} to={cur.path}>
              <Button
                type='primary'
                text={cur.label}
                onClick={() => dispatch(setGame(game))}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

type HomeProps = {
  games: IGame[];
};

export default Home;
