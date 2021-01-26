import logo from './logo.svg';
import './App.css';
import { Router } from "@reach/router";
import Library from './Library';
import Browse from './Browse';
import Manga from './Manga';

function App() {
  return (
    <div className="App">
      <Router>
        <Library path="/" />
        <Browse path="browse" />
        <Manga path="manga/:mangaId" />
      </Router>
    </div>
  );
}

export default App;
