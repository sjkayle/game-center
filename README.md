# Pipes Puzzle

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Level Passwords Obtained

- Level 1: **JustWarmingUp**
- Level 2: **DefinitelyWarm**
- Level 3: **GettingTooHot**

## Known Limitations

### Negative scenarios

There was no error handling added.
The application does not handle any invalid inputs or unexpected behavior by the user.

### Autosolver algorithm

The [autosolver](./src/utils/autosolvers.ts) will be executed when the _Hint_ button is clicked.

Please note however that this will not solve the entire puzzle.
Instead, it will only solve most of the pipes (_straight-lines_, _elbows_, and _tees_) along the edges of the board.
It will also solve _single-ended_ or _straight-line_ pipes that are adjacent to _cross_ pipes.

## Key Decisions

### State Management

At first, I was not considering to use an external state management library as I belive that I would be able to mannage the state inside the components themselves.

But after reading this line from the instructions,

> If possible, your design should be such that makes adding other similar games less difficult.

I have decided to use [Redux Toolkit](https://redux-toolkit.js.org/), which holds the state that could possibly be shared by other components (or new games) as the applicatin grows.

This makes the application more dynamic and highly scalable.

To add a new game, simply add a new object inside the `games` array in the [games.ts](./src/config/games.ts) file, and then develop the components or reuse existing components necessary for the new game.

## Steps to Launch

### Live Demo

Go to the [live website](https://sjkayle-game-center.netlify.app/) deployed in **Netlify**.

### To run in development mode

1. Clone the repository

`git clone https://github.com/sjkayle/frontend-pipes.git`

2. Install the node modules

`npm install`

3. Run the application

`npm start`

### `npm start`

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
