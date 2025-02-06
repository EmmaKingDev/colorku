import "./App.css";
import SudokuBoard from "./components/SudokuBoard";

function App() {
  return (
    <div className="app">
      <h1 className="title">
        <span>C</span>
        <span>o</span>
        <span>l</span>
        <span>o</span>
        <span>r</span>
        <span>k</span>
        <span>u</span>
      </h1>
      <SudokuBoard />
    </div>
  );
}

export default App;
