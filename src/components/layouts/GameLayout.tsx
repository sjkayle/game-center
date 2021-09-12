import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { reset } from '../../redux/slices/game.slice';

const GameLayout = (props: GameLayoutProps) => {
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
          {props.title}
          {props.level && <span>, level {props.level}</span>}
        </h1>
        {props.children}
      </div>
    </>
  );
};

type GameLayoutProps = {
  title: string;
  level?: number;
  children: any;
};

export default GameLayout;
