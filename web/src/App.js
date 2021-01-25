import logo from './logo.svg';
import './App.css';
import { Router } from "@reach/router";
import Navbar from './common/Navbar';
import Browse from './Browse';

function App() {
  return (
    <div className="App">
      <Router>
        <Browse path="browse" />
      </Router>
      <Navbar />
    </div>
  );
}

export default App;
