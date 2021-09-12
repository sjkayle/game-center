import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setGame } from '../redux/slices/gameSlice';
import { Game } from '../config/games';

const Home = (props: HomeProps) => {
  const dispatch = useDispatch();
  return (
    <div className='wrapper'>
      <h1 className='txt-big'>Hello. Select a game.</h1>
      <div>
        {props.games.map((game, idx) => (
          <Link key={idx} to={game.path}>
            <button
              className='btn-primary mx-1'
              onClick={() => dispatch(setGame(game))}
            >
              {game.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

type HomeProps = {
  games: Game[];
};

export default Home;
