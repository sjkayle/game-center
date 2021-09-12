import React from 'react';

import { PipesMap } from '../../config/maps';

const Board = (props: BoardProps) => (
  <div className='board'>
    {props.map ? (
      props.map.map((row: string[], i: number) => (
        <div key={i} className='board--row'>
          {row.map((pipe: string, j: number) => (
            <span
              key={j}
              className='board--cell'
              onClick={() => props.onClick(j, i)}
            >
              <img
                src={`./assets/images/${PipesMap.get(pipe)}.svg`}
                alt={pipe}
                width='50'
              />
            </span>
          ))}
        </div>
      ))
    ) : (
      <h4>Loading map...</h4>
    )}
  </div>
);

type BoardProps = {
  map: Array<string[]> | undefined;
  onClick: (x: number, y: number) => void;
};

export default Board;
