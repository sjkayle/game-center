import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Dialog from '../Dialog';
import PipesBoard from './Pipes.board';
import { GameLayout } from '../layouts';
import { PipeCommands as commands } from '../../config/commands';
import { solvePipes } from '../../utils/autosolvers';

import * as slice from '../../redux/slices/gameSlice';
import * as utils from '../../utils/helpers';

const Pipes = () => {
  const dispatch = useCallback(useDispatch(), []); //eslint-disable-line

  const client = useRef<WebSocket | null>(null);

  const isGameOver = useSelector(slice.isGameOver);
  const isGameStarted = useSelector(slice.isGameStarted);
  const isLevelCompleted = useSelector(slice.isLevelCompleted);
  const level = useSelector(slice.level);
  const numOfLevels = useSelector(slice.numOfLevels);
  const selectedGame = useSelector(slice.selectedGame);

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
              dispatch(slice.completeLevel());
              return;
            }
            setResponse(`Game over!\nFinal password:\n${password}`);
            dispatch(slice.finishGame());
            return;
          } else if (val === 'Only 10 verifications allowed per attempt.') {
            dispatch(slice.finishGame());
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
    if (!isGameStarted) dispatch(slice.startGame());
    setMap(undefined);
    setResponse('');
    client.current.send(`${commands.NEW} ${level}`);
    client.current.send(commands.MAP);
  };

  const handleNewGame = () => {
    dispatch(slice.newGame());
    handlePlay();
  };

  const handleNextLevel = () => {
    dispatch(slice.startLevel());
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
      <Dialog message={`Welcome to the ${selectedGame} game.`}>
        <Button
          type='secondary'
          text={isConnected ? `Play` : `Loading...`}
          onClick={handlePlay}
          disabled={!isConnected}
        />
      </Dialog>
    );
  } else if (isGameOver) {
    body = (
      <Dialog message={response}>
        <Button type='secondary' text={`New Game`} onClick={handleNewGame} />
      </Dialog>
    );
  } else if (isLevelCompleted) {
    body = (
      <Dialog message={response}>
        <Button
          type='secondary'
          text={`Next Level`}
          onClick={handleNextLevel}
        />
      </Dialog>
    );
  } else {
    body = (
      <GameLayout heading={`${selectedGame} Level ${level}`}>
        <PipesBoard map={map} onClick={handleRotate} />
        <div className='pos-relative'>
          <Button
            type='primary'
            text='Hint'
            onClick={handleAutoSolve}
            disabled={!Boolean(map)}
          />
          <Button
            type='primary'
            text='Verify'
            onClick={handleVerify}
            disabled={!Boolean(map)}
          />
          {response && <span className='txt-fail'>{response}</span>}
        </div>
        {passwords.length > 0 && (
          <div className='mt-1'>
            {'Passwords unlocked: '}
            {passwords.join(', ')}
          </div>
        )}
      </GameLayout>
    );
  }

  return body;
};

export default Pipes;
