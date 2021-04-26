import './App.css';
import { useState } from 'react';

const connector = 4;
const minRow = 6;
const minCols = 7;

// Starting point of the app
// Adding page title
// Calling the ModifyBoard for rows and cols and connection length - which will modify the borad rows and cols
// Calling the GameBoard component which will display the board - where we can play the game.
// The minimum board size would be 3X3 #rowCount=3 and #colCount=3
// Initially we are making each and every button as null to display nothing on the board
function App(props) {
  const [connection, setConnection] = useState(connector);
  const [winnerStaus, setWinnerStatus] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [rowCount, setRowCount] = useState(minRow);
  const [colCount, setColCount] = useState(minCols);
  const [nextRed, isNextRed] = useState(true);
  const [board, updateBoard] = useState(Array(colCount).fill(0).map(row => new Array(rowCount).fill(null)));
  let status = !winnerStaus ? nextRed ? "Next player: Red" : "Next player: Yellow" : "Winner: " + winnerName;
  const handleRows = (count) => {
    setRowCount(count);
    updateBoard(Array(colCount).fill(0).map(row => new Array(count).fill(null)));
  };
  const handleCols = (count) => {
    setColCount(count);
    updateBoard(Array(count).fill(0).map(row => new Array(rowCount).fill(null)));
  };
  const handleBoardClick = (row, col) => {
    let copy = [...board];
    if (copy[row][col]) {
      return;
    }
    if (nextRed) {
      copy[row][col] = 'X';
    } else {
      copy[row][col] = 'O';
    }
    if (!winnerStaus) {
      const winner = calculateWinner(copy, copy[row][col], connection);
      // const winnerTwo= isWinner(copy, copy[row][col], connection,row,col);
      isNextRed(!nextRed);
      updateBoard(copy);
      if (winner) {
        setWinnerStatus(true);
        winner === 'O' ? setWinnerName("Yellow") : setWinnerName("Red");
        return;
      }
    }
  };
  const handleRefresh = () => {
    setWinnerStatus(false);
    setWinnerName("");
    isNextRed(true);
    updateBoard(Array(colCount).fill(0).map(row => new Array(rowCount).fill(null)));
  };

  const handleConnection = (conn) => {
    setConnection(conn);
  }
  return (

    <div>
      <div className="header">
        {props.title}
      </div>
      <div className="game-status">

        {status}
      </div>
      <GameBoard board={board} onClick={handleBoardClick} />
      <ModifyBoard type={"row"} count={rowCount} countHandler={handleRows} />
      <ModifyBoard type={"col "} count={colCount} countHandler={handleCols} />
      <ModifyBoard type={"con"} count={connection} countHandler={handleConnection} />
      <div style={{ marginTop: '20px' }}>
        <button
          style={
            {
              padding: '10px 17px',
              color: '#fff',
              backgroundColor: '#13a4a4',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }
          }
          onClick={handleRefresh}>
          NewGame
          </button>
      </div>
    </div>
  );
}

function GameBoard(props) {
  return (
    <div className="container">
      {props.board.map((value, key) => (<GameRow key={key} rows={value} row={key} onClick={props.onClick} />))}
    </div>
  );
}

function GameRow(props) {
  const handleOnclick = (event) => {

    props.onClick(props.row, event.target.value);
  }
  return (
    <div>
      {
        props.rows.map((value, key) => {
          return (
            <button
              key={key}
              value={key}
              onClick={handleOnclick}
              className="game-field"
              style={{ color: value === 'X' ? '#FF3333' : '#FACF33' }}>
              {value}
            </button>
          )
        }
        )
      }
    </div>
  );
}

function ModifyBoard(props) {
  const [counter, setCounter] = useState(props.count);
  const handleAdd = () => {
    if (counter >= 3 && counter < 9) {
      setCounter(counter + 1);
      props.countHandler(counter + 1);
    }

  };
  const handleSub = () => {
    if (counter > 3 && counter <= 9) {
      setCounter(counter - 1)
      props.countHandler(counter - 1);
    }
  };
  return (
    <div className="board-modifier">
      <div style={{ marginRight: '10px' }}>
        {props.type}:
      </div>
      <button style={
        {
          marginRight: '3px',
          color: '#fff',
          backgroundColor: '#f05030',
          border: 'none',
          cursor: 'pointer'
        }} onClick={handleSub}>
        -
      </button>
      <div>
        {counter}
      </div>
      <button style={
        {
          marginLeft: '3px',
          color: '#fff',
          backgroundColor: '#f05030',
          border: 'none',
          cursor: 'pointer'
        }
      } onClick={handleAdd}>
        +
      </button>
    </div>
  );
}

// example mXn matrix
// [00,01,02,03]
// [10,11,12,13]
// [20,21,22,23]
// [30,31,32,33]

// Algorithm for connect-p-game winner decider
// 1) Algorithm will expect the snapshot board(mXn) player entered value and connection length
// 1) Take a copy of original m X n matrix
// 2) Adjust the copied matrix to nXn form (Add null rows or columns if required for adjustments) for smooth calculation.
function calculateWinner(squares, val, conn) {
  let copy = [...squares];
  let rowLen = squares.length;
  let colLen = squares[0].length;
  for (let i = 0; i < (rowLen - colLen); i++) {
    squares.map((value, key) => { copy[key] = [...copy[key], null] });
  }
  for (let i = 0; i < (colLen - rowLen); i++) {
    copy = [...copy, Array(colLen).fill(null)]
  }
  rowLen = copy.length;
  colLen = copy[0].length;
  let rowCount = 0;
  let colCount = 0;
  let countOne = [];
  let countTwo = [];
  let countThree = [];
  let countFour = [];
  let position = 0;
  let reversePosition = 0;
  for (let i = 0; i < rowLen; i++) {
    countOne[i] = 0;
    countTwo[i] = 0;
    countThree[i] = 0;
    countFour[i] = 0;
    position = i;
    reversePosition = (rowLen - 1) - i;
    for (let j = 0; j < colLen; j++) {
      rowCount = (copy[i][j] === val) ? (rowCount + 1) : 0;
      colCount = (copy[j][i] === val) ? (colCount + 1) : 0;
      countOne[i] = (copy[(colLen - 1) - j][position] === val) ? (countOne[i] + 1) : 0;
      countTwo[i] = (copy[j][position] === val) ? (countTwo[i] + 1) : 0;
      countThree[i] = (copy[(colLen - 1) - j][reversePosition] === val) ? (countThree[i] + 1) : 0;
      countFour[i] = (copy[j][reversePosition] === val) ? (countFour[i] + 1) : 0;
      reversePosition--;
      position++;
      if (rowCount === conn || colCount === conn || countOne[i] === conn || countTwo[i] === conn || countThree[i] === conn || countFour[i] === conn) {
        return val;
      }
    }

  }
  return null;
}
export default App;
