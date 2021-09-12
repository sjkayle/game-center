import React from 'react';
import { useSelector } from 'react-redux';

import Navbar from '../Navbar';
import { RootState } from '../../redux/store';

const GameLayout = (props: GameLayoutProps) => {
  const level = useSelector((state: RootState) => state.game.level);
  const selectedGame = useSelector(
    (state: RootState) => state.game.selectedGame
  );
  return (
    <>
      <Navbar />
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
