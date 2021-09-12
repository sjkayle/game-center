/**
 * @param str - input string
 * @returns message from string
 */
export const extractMessage = (str: string) => {
  const [key, val] = str.split(':');
  return [key, val];
};

/**
 * @param str - input string
 * @returns password from string
 */
export const extractPassword = (str: string) => {
  return str.split('Password:')[1].trim();
};

/**
 * @param str - input string
 * @returns formatted to array of arrays (rows and cols)
 */
export const formatTo3dArray = (str: string) => {
  const rows: Array<string[]> = [];
  str
    .trim()
    .split('\n')
    .forEach((row: string) => {
      const cols: string[] = row.split('');
      rows.push(cols);
    });
  return rows;
};

/**
 * @param seq - array sequence to follow
 * @param cur - current item in sequence
 * @returns next item from sequence
 */
export const getNextItem = (seq: string[], cur: string) => {
  const idx = seq.indexOf(cur);
  let nextIdx = idx + 1;
  if (idx === seq.length - 1) {
    nextIdx = 0;
  }
  return seq[nextIdx];
};

/**
 * @param arr - input array
 * @param n - number of elements per group
 * @returns array of arrays of elements grouped by n
 */
export const groupElementsByN = (arr: string[], n: number) => {
  return arr.reduce(
    (acc: any, cur, idx) =>
      (idx % n ? acc[acc.length - 1].push(cur) : acc.push([cur])) && acc,
    []
  );
};
