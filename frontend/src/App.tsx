import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Symfoni } from "./hardhat/SymfoniContext";
import { Garage } from './components/Garage';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Symfoni autoInit={true} >
          <Garage></Garage>
        </Symfoni>
      </header>
    </div>
  );
}

export default App;
