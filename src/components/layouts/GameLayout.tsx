import React from 'react';

import Navbar from '../Navbar';

const GameLayout = (props: GameLayoutProps) => (
  <>
    <Navbar />
    <div className='wrapper'>
      <h2>{props.heading}</h2>
      {props.children}
    </div>
  </>
);

type GameLayoutProps = {
  heading: string;
  children: any;
};

export default GameLayout;
