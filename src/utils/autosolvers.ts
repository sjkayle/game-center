import { getNextItem } from './helpers';
import { PipesMapToCoordinates as PipesMap } from '../config/maps';

/**
 * Flow:
 * 1) Map each pipe to its corresponding value in `PipesMap`
 * 2) Loop through each pipe and check whether it needs to be rotated
 * 3) Rotate pipe based on its corresponding sequence
 * 4) Lock pipes that have been identified to have correct orientations
 * 5) Push all coordinates of rotated to `pipesToRotate` array
 * 6) Return array for execution
 *
 * Identified rules:
 * [X] Horizontal or vertical pipes along the edges should align with the board edges
 * [X] The flat part of the T pipes along the edges should align with the board edges
 * [ ] No single-ends along the edges should be sticking out of the board
 * [ ] Single-ends should not connect to each other directly
 * [X] Elbow pipes along the edges should connect to locked pipes
 * [X] Elbow pipes in corners should align the board corners
 * [X] Single-ends or lines adjacent to open-ended locked pipes should connect to the locked pipe (e.g. cross pipes)
 * [ ] No isolated paths
 * [ ] Hmmmmmmmm...
 */

/**
 * @param map - input map
 * @returns array of coordinates to be rotated
 */
export const solvePipes = (map: Array<string[]>) => {
  const SEQ_SINGLES = ['1000', '0100', '0010', '0001'];
  const SEQ_ELBOWS = ['1100', '0110', '0011', '1001'];
  const SEQ_TEES = ['1110', '0111', '1011', '1101'];
  const SEQ_LINES = ['1010', '0101'];

  const checkSequence = (seq: string[], cur: string, exp: string) => {
    if (seq.includes(cur!)) {
      if (cur !== exp) {
        return getNextItem(seq, cur!);
      }
    }
    return undefined;
  };

  const pipesToRotate: string[] = [];

  const arrPipeObj = map.map((row: string[]) =>
    row.map((pipe: string) => ({
      pipe: PipesMap.get(pipe),
      locked: PipesMap.get(pipe) === '1111',
    }))
  );
  const mapRows = arrPipeObj.length;
  let top = arrPipeObj[0];
  const mapCols = top.length;
  let btm = arrPipeObj[mapRows - 1];

  let isUnsolved = true;
  while (isUnsolved) {
    isUnsolved = false;

    // check for elbows in corners
    {
      let next;
      if (SEQ_ELBOWS.includes(top[0].pipe!)) {
        next = checkSequence(SEQ_ELBOWS, top[0].pipe!, '0110');
        if (next) {
          pipesToRotate.push(`0 0`);
          top[0].pipe = next;
          isUnsolved = true;
          continue;
        } else top[0].locked = true;
      }
      if (SEQ_ELBOWS.includes(top[mapCols - 1].pipe!)) {
        next = checkSequence(SEQ_ELBOWS, top[mapCols - 1].pipe!, '0011');
        if (next) {
          pipesToRotate.push(`${mapCols - 1} 0`);
          top[mapCols - 1].pipe = next;
          isUnsolved = true;
          continue;
        } else top[mapCols - 1].locked = true;
      }
      if (SEQ_ELBOWS.includes(btm[0].pipe!)) {
        next = checkSequence(SEQ_ELBOWS, btm[0].pipe!, '1100');
        if (next) {
          pipesToRotate.push(`0 ${mapRows - 1}`);
          btm[0].pipe = next;
          isUnsolved = true;
          continue;
        } else btm[0].locked = true;
      }
      if (SEQ_ELBOWS.includes(btm[mapCols - 1].pipe!)) {
        next = checkSequence(SEQ_ELBOWS, btm[mapCols - 1].pipe!, '1001');
        if (next) {
          pipesToRotate.push(`${mapCols - 1} ${mapRows - 1}`);
          btm[mapCols - 1].pipe = next;
          isUnsolved = true;
          continue;
        } else btm[mapCols - 1].locked = true;
      }
    }

    // loop top/bottom edges
    for (let i = 1; i < mapCols - 1; i++) {
      // for lines and tees
      let nextLine, nextTee;
      if (SEQ_LINES.includes(top[i].pipe!) || SEQ_TEES.includes(top[i].pipe!)) {
        nextLine = checkSequence(SEQ_LINES, top[i].pipe!, '0101');
        nextTee = checkSequence(SEQ_TEES, top[i].pipe!, '0111');
        if (nextLine || nextTee) {
          pipesToRotate.push(`${i} 0`);
          top[i].pipe = nextLine || nextTee;
          isUnsolved = true;
          continue;
        } else top[i].locked = true;
      }

      if (SEQ_LINES.includes(btm[i].pipe!) || SEQ_TEES.includes(btm[i].pipe!)) {
        nextLine = checkSequence(SEQ_LINES, btm[i].pipe!, '0101');
        nextTee = checkSequence(SEQ_TEES, btm[i].pipe!, '1101');
        if (nextLine || nextTee) {
          pipesToRotate.push(`${i} ${mapRows - 1}`);
          btm[i].pipe = nextLine || nextTee;
          isUnsolved = true;
          continue;
        } else btm[i].locked = true;
      }

      // for elbows
      let nextElbow;
      if (SEQ_ELBOWS.includes(top[i].pipe!)) {
        if (top[i + 1].locked && top[i + 1].pipe?.charAt(3) === '1') {
          nextElbow = checkSequence(SEQ_ELBOWS, top[i].pipe!, '0110');
          if (nextElbow) {
            pipesToRotate.push(`${i} 0`);
            top[i].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else top[i].locked = true;
        }
        if (top[i - 1].locked && top[i - 1].pipe?.charAt(1) === '1') {
          nextElbow = checkSequence(SEQ_ELBOWS, top[i].pipe!, '0011');
          if (nextElbow) {
            pipesToRotate.push(`${i} 0`);
            top[i].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else top[i].locked = true;
        }
      }
      if (SEQ_ELBOWS.includes(btm[i].pipe!)) {
        if (btm[i + 1].locked && btm[i + 1].pipe?.charAt(3) === '1') {
          nextElbow = checkSequence(SEQ_ELBOWS, btm[i].pipe!, '1100');
          if (nextElbow) {
            pipesToRotate.push(`${i} ${mapRows - 1}`);
            btm[i].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else btm[i].locked = true;
        }
        if (btm[i - 1].locked && btm[i - 1].pipe?.charAt(1) === '1') {
          nextElbow = checkSequence(SEQ_ELBOWS, btm[i].pipe!, '1001');
          if (nextElbow) {
            pipesToRotate.push(`${i} ${mapRows - 1}`);
            btm[i].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else btm[i].locked = true;
        }
      }
    }

    // loop right/left edges
    for (let i = 1; i < mapRows - 1; i++) {
      // for lines and tees
      let nextLine, nextTee;
      if (
        SEQ_LINES.includes(arrPipeObj[i][mapCols - 1].pipe!) ||
        SEQ_TEES.includes(arrPipeObj[i][mapCols - 1].pipe!)
      ) {
        nextLine = checkSequence(
          SEQ_LINES,
          arrPipeObj[i][mapCols - 1].pipe!,
          '1010'
        );
        nextTee = checkSequence(
          SEQ_TEES,
          arrPipeObj[i][mapCols - 1].pipe!,
          '1011'
        );
        if (nextLine || nextTee) {
          pipesToRotate.push(`${mapCols - 1} ${i}`);
          arrPipeObj[i][mapCols - 1].pipe = nextLine || nextTee;
          isUnsolved = true;
          continue;
        } else arrPipeObj[i][mapCols - 1].locked = true;
      }

      if (
        SEQ_LINES.includes(arrPipeObj[i][0].pipe!) ||
        SEQ_TEES.includes(arrPipeObj[i][0].pipe!)
      ) {
        nextLine = checkSequence(SEQ_LINES, arrPipeObj[i][0].pipe!, '1010');
        nextTee = checkSequence(SEQ_TEES, arrPipeObj[i][0].pipe!, '1110');
        if (nextLine || nextTee) {
          pipesToRotate.push(`0 ${i}`);
          arrPipeObj[i][0].pipe = nextLine || nextTee;
          isUnsolved = true;
          continue;
        } else arrPipeObj[i][0].locked = true;
      }

      // for elbows
      let nextElbow;
      if (SEQ_ELBOWS.includes(arrPipeObj[i][mapCols - 1].pipe!)) {
        if (
          arrPipeObj[i - 1] &&
          arrPipeObj[i - 1][mapCols - 1].locked &&
          arrPipeObj[i - 1][mapCols - 1].pipe?.charAt(2) === '1'
        ) {
          nextElbow = checkSequence(
            SEQ_ELBOWS,
            arrPipeObj[i][mapCols - 1].pipe!,
            '1001'
          );
          if (nextElbow) {
            pipesToRotate.push(`${mapCols - 1} ${i}`);
            arrPipeObj[i][mapCols - 1].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else arrPipeObj[i][mapCols - 1].locked = true;
        }
        if (
          arrPipeObj[i + 1][mapCols - 1].locked &&
          arrPipeObj[i + 1][mapCols - 1].pipe?.charAt(0) === '1'
        ) {
          nextElbow = checkSequence(
            SEQ_ELBOWS,
            arrPipeObj[i][mapCols - 1].pipe!,
            '0110'
          );
          if (nextElbow) {
            pipesToRotate.push(`${mapCols - 1} ${i}`);
            arrPipeObj[i][mapCols - 1].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else arrPipeObj[i][mapCols - 1].locked = true;
        }
      }
      if (SEQ_ELBOWS.includes(arrPipeObj[i][0].pipe!)) {
        if (
          arrPipeObj[i - 1][0].locked &&
          arrPipeObj[i - 1][0].pipe?.charAt(2) === '1'
        ) {
          nextElbow = checkSequence(SEQ_ELBOWS, arrPipeObj[i][0].pipe!, '1100');
          if (nextElbow) {
            pipesToRotate.push(`0 ${i}`);
            arrPipeObj[i][0].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else arrPipeObj[i][0].locked = true;
        }
        if (
          arrPipeObj[i + 1][0].locked &&
          arrPipeObj[i + 1][0].pipe?.charAt(0) === '1'
        ) {
          nextElbow = checkSequence(SEQ_ELBOWS, arrPipeObj[i][0].pipe!, '0110');
          if (nextElbow) {
            pipesToRotate.push(`0 ${i}`);
            arrPipeObj[i][0].pipe = nextElbow;
            isUnsolved = true;
            continue;
          } else arrPipeObj[i][0].locked = true;
        }
      }
    }

    // loop through pipes that are still not locked
    for (let i = 0; i < mapRows; i++) {
      for (let j = 0; j < mapCols; j++) {
        if (arrPipeObj[i][j].locked) {
          continue;
        }

        // check for lines or single-ends not connected to locked open-ended pipes
        if (
          SEQ_LINES.includes(arrPipeObj[i][j].pipe!) ||
          SEQ_SINGLES.includes(arrPipeObj[i][j].pipe!)
        ) {
          let nextLine, nextSingle;
          if (
            arrPipeObj[i - 1] &&
            arrPipeObj[i - 1][j].locked &&
            arrPipeObj[i - 1][j].pipe?.charAt(2) === '1'
          ) {
            nextLine = checkSequence(SEQ_LINES, arrPipeObj[i][j].pipe!, '1010');
            nextSingle = checkSequence(
              SEQ_SINGLES,
              arrPipeObj[i][j].pipe!,
              '1000'
            );
            if (nextLine || nextSingle) {
              pipesToRotate.push(`${j} ${i}`);
              arrPipeObj[i][j].pipe = nextLine || nextSingle;
              isUnsolved = true;
              continue;
            } else arrPipeObj[i][j].locked = true;
          }
          if (
            arrPipeObj[i][j + 1] &&
            arrPipeObj[i][j + 1].locked &&
            arrPipeObj[i][j + 1].pipe?.charAt(3) === '1'
          ) {
            nextLine = checkSequence(SEQ_LINES, arrPipeObj[i][j].pipe!, '0101');
            nextSingle = checkSequence(
              SEQ_SINGLES,
              arrPipeObj[i][j].pipe!,
              '0100'
            );
            if (nextLine || nextSingle) {
              pipesToRotate.push(`${j} ${i}`);
              arrPipeObj[i][j].pipe = nextLine || nextSingle;
              isUnsolved = true;
              continue;
            } else arrPipeObj[i][j].locked = true;
          }
          if (
            arrPipeObj[i + 1] &&
            arrPipeObj[i + 1][j].locked &&
            arrPipeObj[i + 1][j].pipe?.charAt(0) === '1'
          ) {
            nextLine = checkSequence(SEQ_LINES, arrPipeObj[i][j].pipe!, '1010');
            nextSingle = checkSequence(
              SEQ_SINGLES,
              arrPipeObj[i][j].pipe!,
              '0010'
            );
            if (nextLine || nextSingle) {
              pipesToRotate.push(`${j} ${i}`);
              arrPipeObj[i][j].pipe = nextLine || nextSingle;
              isUnsolved = true;
              continue;
            } else arrPipeObj[i][j].locked = true;
          }
          if (
            arrPipeObj[i][j - 1] &&
            arrPipeObj[i][j - 1].locked &&
            arrPipeObj[i][j - 1].pipe?.charAt(1) === '1'
          ) {
            nextLine = checkSequence(SEQ_LINES, arrPipeObj[i][j].pipe!, '0101');
            nextSingle = checkSequence(
              SEQ_SINGLES,
              arrPipeObj[i][j].pipe!,
              '0001'
            );
            if (nextLine || nextSingle) {
              pipesToRotate.push(`${j} ${i}`);
              arrPipeObj[i][j].pipe = nextLine || nextSingle;
              isUnsolved = true;
              continue;
            } else arrPipeObj[i][j].locked = true;
          }
        }
      }
    }
  }
  return pipesToRotate;
};

// TODO: fix left and right elbow loop
