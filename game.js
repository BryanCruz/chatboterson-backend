const columns = ["A", "B", "C"];
const lines = ["1", "2", "3"];

let boardState = {};

const symbols = ["X", "O"];
let playerSymbol = "X";
let botSymbol = "O";

const getRandomCoord = coords => {
  return coords[Math.floor(Math.random() * coords.length)];
};

const drawBoard = () => {
  const emptyChar = " ";

  const columnHeaderLine = `${emptyChar}`.concat(
    columns
      .map(col => `${emptyChar}${col}${emptyChar}`)
      .join("|")
      .concat("\n")
  );

  const gameLines = lines.map(line =>
    [line]
      .concat(
        columns.map(
          col =>
            `${emptyChar}${boardState[`${col}${line}`] ||
              emptyChar}${emptyChar}`
        )
      )
      .join("|")
  );

  const board = columnHeaderLine.concat(gameLines.join("\n"));

  return board;
};

const resetBoard = () => {
  boardState = {};
};

const isGameOver = () => hasSomeoneWon() || isATie();

const hasSomeoneWon = () => {
  const winningSchemas = lines
    .map(line => columns.map(col => `${col}${line}`))
    .concat(columns.map(col => lines.map(line => `${col}${line}`)))
    .concat([[0, 1, 2].map(i => `${columns[i]}${lines[i]}`)])
    .concat([[0, 1, 2].map(i => `${columns[i]}${lines[2 - i]}`)]);

  return winningSchemas.some(schema => {
    const firstSymbol = boardState[schema[0]];
    const isWinningSchema =
      firstSymbol !== undefined &&
      schema
        .map(coord => boardState[coord] === firstSymbol)
        .every(isEqualToFirstSymbol => isEqualToFirstSymbol);

    return isWinningSchema;
  });
};

const isATie = () => {
  return !hasSomeoneWon() && Object.keys(boardState).length == 3 * 3;
};

const isMoveAllowed = coord => boardState[coord] === undefined;

const playerMove = coord => {
  boardState[coord] = playerSymbol;
};

const botMove = () => {
  const allCoords = lines.flatMap(line => columns.map(col => `${col}${line}`));

  const allowedCoords = allCoords.filter(isMoveAllowed);

  const coord = getRandomCoord(allowedCoords);

  boardState[coord] = botSymbol;

  return coord;
};

const setSymbols = playerChoice => {
  const playerChoiceIndex = symbols.indexOf(playerChoice);
  playerSymbol = symbols[playerChoiceIndex];
  botSymbol = symbols[1 - playerChoiceIndex];
};

module.exports = {
  drawBoard,
  resetBoard,
  setSymbols,
  isMoveAllowed,
  isGameOver,
  hasSomeoneWon,
  isATie,
  playerMove,
  botMove
};
