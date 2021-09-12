// for mapping to corresponding svg files
export const PipesMap = new Map([
  ['╋', 'cross'],
  ['┓', 'elbow-bl'],
  ['┛', 'elbow-lt'],
  ['┏', 'elbow-rb'],
  ['┗', 'elbow-tr'],
  ['━', 'horizontal'],
  ['╻', 'single-b'],
  ['╸', 'single-l'],
  ['╺', 'single-r'],
  ['╹', 'single-t'],
  ['┳', 'tee-b'],
  ['┫', 'tee-l'],
  ['┣', 'tee-r'],
  ['┻', 'tee-t'],
  ['┃', 'vertical'],
]);

// for mapping used in autosolver algorithm
export const PipesMapToCoordinates = new Map([
  ['╋', '1111'],
  ['┓', '0011'],
  ['┛', '1001'],
  ['┏', '0110'],
  ['┗', '1100'],
  ['━', '0101'],
  ['╻', '0010'],
  ['╸', '0001'],
  ['╺', '0100'],
  ['╹', '1000'],
  ['┳', '0111'],
  ['┫', '1011'],
  ['┣', '1110'],
  ['┻', '1101'],
  ['┃', '1010'],
]);
