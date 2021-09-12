import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import { setNumOfLevels } from '../redux/slices/gameSlice';
import games, { Game } from '../config/games';

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
              onClick={() => dispatch(setNumOfLevels(game.levels))}
            >
              {game.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path='/'
          render={(props) => <Home games={games} {...props} />}
        />
        {games.map(({ path, component }, idx) => {
          return <Route key={idx} path={path} component={component} />;
        })}
      </Switch>
    </BrowserRouter>
  );
};

type HomeProps = {
  games: Game[];
};

export default App;
