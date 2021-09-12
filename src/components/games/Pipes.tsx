import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PipesBoard from './Pipes.board';
import Dialog from '../Dialog';
import { GameLayout } from '../layouts';
import { RootState } from '../../redux/store';
import * as actions from '../../redux/slices/game.slice';
import * as utils from '../../utils/helpers';
import { solvePipes } from '../../utils/autosolvers';

const Pipes = () => {
  const isGameOver = useSelector((state: RootState) => state.game.isGameOver);
  const isGameStarted = useSelector(
    (state: RootState) => state.game.isGameStarted
  );
  const isLevelCompleted = useSelector(
    (state: RootState) => state.game.isLevelCompleted
  );
  const level = useSelector((state: RootState) => state.game.level);
  const passwords = useSelector((state: RootState) => state.game.passwords);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [map, setMap] = useState<Array<string[]> | undefined>();
  const [response, setResponse] = useState<IPipesServer>('');

  const client = useRef<WebSocket | null>(null);

  const dispatch = useCallback(useDispatch(), []); //eslint-disable-line

  useEffect(() => {
    client.current = new WebSocket('wss://hometask.eg1236.com/game-pipes/');
    client.current.onopen = () => setIsConnected(true);
    return () => {
      client.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!client.current) return;

    client.current.onmessage = (e: MessageEvent) => {
      const { data } = e;
      const [key, val] = utils.extractMessage(data);

      switch (key) {
        case 'map':
          setMap(utils.formatTo3dArray(val));
          break;

        case 'verify':
          if (data.includes('Correct!')) {
            const password = utils.extractPassword(data);
            dispatch(actions.completeLevel(password));
            setResponse(`New password unlocked: ${password}`);
            return;
          }
          if (data.includes('Only 10 verifications allowed per attempt.')) {
            dispatch(actions.finishGame());
            setResponse(`Game over. ${val}`);
            return;
          }
          setResponse(val);
          break;

        default:
          break;
      }
    };
  }, [dispatch]);

  const handlePlay = () => {
    if (!client.current) return;
    if (!isGameStarted) {
      dispatch(actions.startGame());
    }
    setMap(undefined);
    setResponse('');
    client.current.send(`new ${level}`);
    client.current.send(`map`);
  };

  const handleNewGame = () => {
    dispatch(actions.reset());
    handlePlay();
  };

  const handleNextLevel = () => {
    dispatch(actions.startLevel());
    handlePlay();
  };

  const handleRotate = (x: number, y: number) => {
    if (!client.current) return;
    setResponse('');
    client.current.send(`rotate ${x} ${y}`);
    client.current.send(`map`);
  };

  const handleVerify = () => {
    if (!client.current) return;
    client.current.send(`verify`);
  };

  const handleAutoSolve = () => {
    const pipes = solvePipes(map!);
    const groupedPipes = utils.groupElementsByN(pipes, 3);
    groupedPipes.forEach((grp: string[]) => {
      if (!client.current) return;
      client.current.send(`rotate ${grp.join('\n')}`);
      client.current.send(`map`);
    });
  };

  let body;

  if (!isGameStarted) {
    body = (
      <Dialog
        buttonText={isConnected ? `Play` : `Loading...`}
        disabled={!isConnected}
        message={`Welcome to the Pipes game.`}
        onClick={handlePlay}
      />
    );
  } else if (isGameOver) {
    body = (
      <Dialog
        buttonText={`New Game`}
        message={response}
        onClick={handleNewGame}
      />
    );
  } else if (isLevelCompleted) {
    body = (
      <Dialog
        buttonText={`Next Level`}
        message={response}
        onClick={handleNextLevel}
      />
    );
  } else {
    body = (
      <GameLayout title={`Pipes`} level={level}>
        <PipesBoard map={map} onClick={handleRotate} />
        <div className='pos-relative'>
          <button
            className='btn-primary'
            onClick={handleAutoSolve}
            disabled={!Boolean(map)}
          >
            Hint
          </button>
          <button
            className='btn-primary'
            onClick={handleVerify}
            disabled={!Boolean(map)}
          >
            Verify
          </button>
          {response && <span className='txt-fail'>{response}</span>}
        </div>
        {passwords.length > 0 && (
          <div className='mt-1'>
            {`Passwords unlocked: `}
            {passwords.join(', ')}
          </div>
        )}
      </GameLayout>
    );
  }

  return body;
};

export default Pipes;
