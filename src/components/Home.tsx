import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setGame } from '../redux/slices/gameSlice';
import { IGame } from '../config/games';

const Home = (props: HomeProps) => {
  const dispatch = useDispatch();
  return (
    <div className='wrapper'>
      <h1 className='txt-big'>Hello. Select a game.</h1>
      <div>
        {props.games.map((game, idx) => {
          const { label, levels } = game;
          const games = {
            label,
            levels,
          };
          return (
            <Link key={idx} to={game.path}>
              <button
                className='btn-primary mx-1'
                onClick={() => dispatch(setGame(games))}
              >
                {game.label}
              </button>
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
