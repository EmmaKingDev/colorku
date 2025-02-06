import { useState, useEffect } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "./SudokuBoard.css";
import { getRandomTemplate } from "../data/sudokuTemplates";
import { solutions } from "../data/sudokuSolutions";

const initialBoard = Array(9)
  .fill()
  .map(() => Array(9).fill(0));

// Color mapping for numbers 1-9
const colorMap = {
  1: "#c37de7",
  2: "#8b97ff",
  3: "#96e86a",
  4: "#ffb05d",
  5: "#FFF082",
  6: "#FF9ECE",
  7: "#87d1e8",
  8: "#b3fdd6",
  9: "#f7c1a1",
};

function SudokuBoard() {
  const [board, setBoard] = useState(() => {
    const savedBoard = sessionStorage.getItem("sudokuBoard");
    return savedBoard ? JSON.parse(savedBoard) : getRandomTemplate("easy");
  });

  // Add state to track template cells
  const [templateCells, setTemplateCells] = useState(() => {
    const template = board.map((row) => row.map((cell) => cell !== 0));
    return template;
  });

  const [selectedNumber, setSelectedNumber] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [hasWon, setHasWon] = useState(false);

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

      if (checkWin(newBoard)) {
        setHasWon(true);
      }
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

  // Update difficulty change handler
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setHasWon(false);
    const newTemplate = getRandomTemplate(newDifficulty);
    setBoard(newTemplate);
    setTemplateCells(newTemplate.map((row) => row.map((cell) => cell !== 0)));
    sessionStorage.setItem("sudokuBoard", JSON.stringify(newTemplate));
  };

  // Update handleResetGame to reset templateCells
  const handleResetGame = () => {
    const currentTemplate = getRandomTemplate(difficulty);
    setBoard(currentTemplate);
    setTemplateCells(
      currentTemplate.map((row) => row.map((cell) => cell !== 0))
    );
    sessionStorage.setItem("sudokuBoard", JSON.stringify(currentTemplate));
    setHasWon(false);
  };

  const checkWin = (currentBoard) => {
    const currentSolution = solutions[difficulty][0];
    return currentBoard.every((row, i) =>
      row.every((cell, j) => cell === currentSolution[i][j])
    );
  };

  return (
    <div className="game-container">
      <div className={`win-message ${hasWon ? "visible" : ""}`}>You won!</div>
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
                  border: cell ? "1px solid #ffffff" : "1px solid #ccc",
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                draggable={cell !== 0 && !templateCells[rowIndex][colIndex]}
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
      <div className="difficulty-selector">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            className={`difficulty-button ${
              difficulty === level ? "selected" : ""
            }`}
            onClick={() => handleDifficultyChange(level)}
          >
            {level.toUpperCase()}
          </button>
        ))}
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
        made by emma
      </a>
    </div>
  );
}

export default SudokuBoard;
