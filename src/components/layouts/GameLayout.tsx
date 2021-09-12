import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '../../redux/store';
import { reset } from '../../redux/slices/gameSlice';

const GameLayout = (props: GameLayoutProps) => {
  const level = useSelector((state: RootState) => state.game.level);
  const selectedGame = useSelector(
    (state: RootState) => state.game.selectedGame
  );

  const dispatch = useDispatch();
  return (
    <>
      <nav>
        <Link to='/' onClick={() => dispatch(reset())}>
          ← Go Back
        </Link>
      </nav>
      <div className='wrapper'>
        <h1>
          {selectedGame}
          {level && <span>, level {level}</span>}
        </h1>
        {props.children}
      </div>
    </>
  );
};

type GameLayoutProps = {
  children: any;
};

export default GameLayout;
