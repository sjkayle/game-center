import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';
import games from '../config/games';

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

export default App;
