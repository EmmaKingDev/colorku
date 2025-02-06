import { useState, useEffect } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "./SudokuBoard.css";

const initialBoard = Array(9)
  .fill()
  .map(() => Array(9).fill(0));

// Color mapping for numbers 1-9
const colorMap = {
  1: "#c37de7",
  2: "#8b97ff",
  3: "#a5f07d",
  4: "#FFAF71",
  5: "#FFF082",
  6: "#FF9ECE",
  7: "#87d1e8",
  8: "#aaf4cd",
  9: "#F2B694",
};

function SudokuBoard() {
  // Load initial state from sessionStorage or use default
  const [board, setBoard] = useState(() => {
    const savedBoard = sessionStorage.getItem("sudokuBoard");
    return savedBoard ? JSON.parse(savedBoard) : initialBoard;
  });

  const [selectedNumber, setSelectedNumber] = useState(null);

  // Save board state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("sudokuBoard", JSON.stringify(board));
  }, [board]);

  const handleDragStart = (e, number) => {
    e.dataTransfer.setData("number", number);
    e.dataTransfer.setData("type", "number");
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const number = parseInt(e.dataTransfer.getData("number"));
    const type = e.dataTransfer.getData("type");

    if (type === "number") {
      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] = number;
      setBoard(newBoard);
    }
  };

  const handleBinDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type === "cell") {
      const row = parseInt(e.dataTransfer.getData("row"));
      const col = parseInt(e.dataTransfer.getData("col"));

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = 0;
      setBoard(newBoard);
    }
  };

  const handleCellDragStart = (e, row, col, number) => {
    e.dataTransfer.setData("number", number);
    e.dataTransfer.setData("row", row);
    e.dataTransfer.setData("col", col);
    e.dataTransfer.setData("type", "cell");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleResetGame = () => {
    setBoard(initialBoard);
    sessionStorage.removeItem("sudokuBoard");
  };

  return (
    <div className="game-container">
      <div className="sudoku-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{
                  backgroundColor: cell ? colorMap[cell] : "white",
                  color: cell ? colorMap[cell] : "transparent",
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                draggable={cell !== 0}
                onDragStart={(e) =>
                  handleCellDragStart(e, rowIndex, colIndex, cell)
                }
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls-container">
        <div className="number-selector">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <div
              key={number}
              className={`number-cell ${
                selectedNumber === number ? "selected" : ""
              }`}
              style={{
                backgroundColor: colorMap[number],
                color: colorMap[number],
              }}
              onClick={() => setSelectedNumber(number)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, number)}
            >
              {number}
            </div>
          ))}
        </div>
        <div
          className="delete-bin"
          onDragOver={handleDragOver}
          onDrop={handleBinDrop}
        >
          <RiDeleteBin6Fill size={28} />
        </div>
      </div>
      <button onClick={handleResetGame} className="reset-button">
        RESET
      </button>
      <a
        href="https://github.com/EmmaKingDev"
        target="_blank"
        rel="noopener noreferrer"
        className="creator-link"
      >
        made by emmakingdev
      </a>
    </div>
  );
}

export default SudokuBoard;
