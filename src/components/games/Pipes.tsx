import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '../Dialog';
import PipesBoard from './Pipes.board';
import { GameLayout } from '../layouts';
import { PipeCommands as commands } from '../../config/commands';
import { RootState } from '../../redux/store';
import { solvePipes } from '../../utils/autosolvers';

import * as actions from '../../redux/slices/gameSlice';
import * as utils from '../../utils/helpers';

const Pipes = () => {
  const dispatch = useCallback(useDispatch(), []); //eslint-disable-line

  const client = useRef<WebSocket | null>(null);

  const isGameOver = useSelector((state: RootState) => state.game.isGameOver);
  const isGameStarted = useSelector((state: RootState) => state.game.isGameStarted);
  const isLevelCompleted = useSelector((state: RootState) => state.game.isLevelCompleted);
  const level = useSelector((state: RootState) => state.game.level);
  const numOfLevels = useSelector((state: RootState) => state.game.numOfLevels);
  const selectedGame = useSelector((state: RootState) => state.game.selectedGame);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [response, setResponse] = useState<IPipesServer>('');
  const [map, setMap] = useState<Array<string[]> | undefined>();
  const [passwords, setPasswords] = useState<string[]>([]);

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
        case commands.MAP:
          setMap(utils.formatTo3dArray(val));
          break;

        case commands.VERIFY:
          if (val.includes('Password')) {
            const password = utils.extractPassword(data);
            if (level < numOfLevels) {
              setResponse(`Password unlocked:\n${password}`);
              setPasswords((prev) => [...prev, password]);
              dispatch(actions.completeLevel());
              return;
            }
            setResponse(`Game over!\nFinal password:\n${password}`);
            dispatch(actions.finishGame());
            return;
          } else if (val === 'Only 10 verifications allowed per attempt.') {
            dispatch(actions.finishGame());
            setResponse(`Game over!\n${val}`);
            return;
          }
          setResponse(val);
          break;

        default:
          break;
      }
    };
  }, [dispatch, level, numOfLevels]);

  const handlePlay = () => {
    if (!client.current) return;
    if (!isGameStarted) dispatch(actions.startGame());
    setMap(undefined);
    setResponse('');
    client.current.send(`${commands.NEW} ${level}`);
    client.current.send(commands.MAP);
  };

  const handleNewGame = () => {
    dispatch(actions.newGame());
    handlePlay();
  };

  const handleNextLevel = () => {
    dispatch(actions.startLevel());
    handlePlay();
  };

  const handleRotate = (x: number, y: number) => {
    if (!client.current) return;
    setResponse('');
    client.current.send(`${commands.ROTATE} ${x} ${y}`);
    client.current.send(commands.MAP);
  };

  const handleVerify = () => {
    if (!client.current) return;
    client.current.send(commands.VERIFY);
  };

  const handleAutoSolve = () => {
    const pipes = solvePipes(map!);
    if (pipes.length === 0) return;
    const groupedPipes = utils.groupElementsByN(pipes, 3);
    groupedPipes.forEach((grp: string[]) => {
      if (!client.current) return;
      client.current.send(`${commands.ROTATE} ${grp.join('\n')}`);
      client.current.send(commands.MAP);
    });
  };

  let body;

  if (!isGameStarted) {
    body = (
      <Dialog
        buttonText={isConnected ? `Play` : `Loading...`}
        disabled={!isConnected}
        message={`Welcome to the ${selectedGame} game.`}
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
      <GameLayout>
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
